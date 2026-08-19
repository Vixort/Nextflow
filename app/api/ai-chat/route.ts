import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/jwt";
import { getAiSettings, renderPrompt, extractJsonObject } from "@/lib/ai";
import { AiError } from "@/lib/ai/types";
import { sanitizeText } from "@/lib/static/htmlTextEdits";
import { createAdminClient } from "@/lib/db/client";
import {
  collectInstanceTexts,
  fetchBuildableTemplates,
  formatCatalog,
  validateBuildOverrides,
} from "@/lib/ai/build";

export async function POST(request: NextRequest) {
  try {
    const { message, tags, history, mode, staticInventory } = await request
      .json()
      .catch(() => ({}));

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const settings = (await getAiSettings()).settings;
    // Template AI requires a logged-in user when require_login is on.
    const session = await getAuthSession(request);
    if (settings.require_login && !session) {
      return NextResponse.json(
        { error: "Please sign in to use the AI assistant.", code: "auth_required" },
        { status: 401 },
      );
    }

    // Prompt selection by mode.
    const promptKey =
      mode === "build"
        ? "template_build"
        : mode === "static"
          ? "static_copy"
          : "template_filter";

    // /build (mode === "build") runs a two-stage server pipeline:
    //   stage 1 — AI picks the single best-fit template from the catalog
    //   stage 2 — component ids + current texts are read from the DB
    //             (puck_layout/puck_texts) and AI rewrites them per instance
    if (mode === "build") {
      return await runBuildPipeline(request, message, history, session);
    }

    const knownIds = new Set(
      Array.isArray(staticInventory)
        ? staticInventory
            .filter(
              (it: unknown): it is { id: string } =>
                !!it && typeof it === "object" && typeof (it as { id?: unknown }).id === "string",
            )
            .map((it) => it.id)
        : [],
    );

    const inventoryText =
      mode === "static"
        ? (Array.isArray(staticInventory) ? staticInventory : [])
            .filter(
              (it: unknown): it is { id: string; tag: string; text: string } =>
                !!it &&
                typeof it === "object" &&
                typeof (it as { id?: unknown }).id === "string" &&
                typeof (it as { tag?: unknown }).tag === "string" &&
                typeof (it as { text?: unknown }).text === "string",
            )
            .slice(0, 30)
            .map((it) => `${it.id} [${it.tag}]: ${it.text}`)
            .join("\n")
        : undefined;

    const system = renderPrompt(promptKey, {
      tags: (Array.isArray(tags) ? tags : []).join(", "),
      inventory: inventoryText || "NONE",
    }, settings.prompts);

    const userInfo = {
      user_id: session?.id ?? null,
      username: session?.username ?? null,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      userAgent: request.headers.get("user-agent"),
      path: "template-ai",
    };

    const { runAi } = await import("@/lib/ai/run");
    const result = await runAi({
      context: "templates",
      mode: (mode as string) || "filter",
      path: userInfo.path,
      system,
      user: message,
      history: Array.isArray(history)
        ? history
            .filter(
              (m: unknown): m is { role: string; content: string } =>
                !!m &&
                typeof m === "object" &&
                typeof (m as { role?: unknown }).role === "string" &&
                typeof (m as { content?: unknown }).content === "string",
            )
            .slice(0, 20)
            .map((m) => ({
              role: m.role === "model" ? "model" : "user",
              content: m.content,
            }))
        : undefined,
      user_id: userInfo.user_id,
      username: userInfo.username,
      ip: userInfo.ip,
      userAgent: userInfo.userAgent,
    });

    const responseText = result.text;

    const parsed = extractJsonObject<{
      reply?: unknown;
      suggestedTag?: unknown;
      overrides?: unknown;
    }>(responseText);

    if (parsed) {
      const reply = typeof parsed.reply === "string" ? parsed.reply : "";

      if (mode === "static") {
        const rawOverrides = Array.isArray(parsed.overrides)
          ? (parsed.overrides as unknown[])
          : [];
        const overrides = rawOverrides
          .filter(
            (ov): ov is { id: string; value: string } =>
              !!ov &&
              typeof ov === "object" &&
              typeof (ov as { id?: unknown }).id === "string" &&
              knownIds.has((ov as { id: string }).id) &&
              typeof (ov as { value?: unknown }).value === "string" &&
              ((ov as { value: string }).value.trim().length > 0),
          )
          .slice(0, 12)
          .map((ov) => ({ id: ov.id, value: sanitizeText(ov.value) }));
        return NextResponse.json({
          reply: reply || "Preview updated.",
          suggestedTag: null,
          overrides,
        });
      }

      return NextResponse.json({
        reply,
        suggestedTag:
          typeof parsed.suggestedTag === "string" ? parsed.suggestedTag : null,
        overrides: Array.isArray(parsed.overrides) ? parsed.overrides : [],
      });
    }

    // No parseable JSON at all — surface the raw text so the user still sees
    // the AI's answer instead of a hard error.
    console.error("Failed to parse AI JSON response:", responseText.slice(0, 400));
    return NextResponse.json({
      reply: responseText.replace(/```json/g, "").replace(/```/g, "").trim() || "Done.",
      suggestedTag: null,
      overrides: [],
    });
  } catch (error: unknown) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate AI response." },
      { status: 500 },
    );
  }
}

// ------------------------------------------------------------------
// /build pipeline: pick a template, read its component texts from the
// DB, and rewrite them per component instance with a second AI call.
// ------------------------------------------------------------------
async function runBuildPipeline(
  request: NextRequest,
  message: string,
  history: unknown,
  session: { id: string | null; username: string | null } | null,
) {
  const settings = (await getAiSettings()).settings;

  const userInfo = {
    user_id: session?.id ?? null,
    username: session?.username ?? null,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    userAgent: request.headers.get("user-agent"),
    path: "template-ai",
  };

  const cleanHistory = Array.isArray(history)
    ? history
        .filter(
          (m: unknown): m is { role: string; content: string } =>
            !!m &&
            typeof m === "object" &&
            typeof (m as { role?: unknown }).role === "string" &&
            typeof (m as { content?: unknown }).content === "string",
        )
        .slice(0, 20)
        .map((m) => ({
          role: (m.role === "model" ? "model" : "user") as "user" | "model",
          content: m.content,
        }))
    : undefined;

  const { runAi } = await import("@/lib/ai/run");

  // STAGE 1 — the AI picks the single best-fit build-ready template.
  const catalog = await fetchBuildableTemplates();
  if (catalog.length === 0) {
    return NextResponse.json({
      reply:
        "ยังไม่มี template ที่ build ได้ (ต้องเป็น Puck template ที่บันทึกแบบ v2 แล้ว) — ลองเข้า Studio แล้วบันทึก template อีกครั้ง",
      suggestedTag: null,
      templateId: null,
      overrides: [],
      applied: [],
    });
  }

  const pickSystem = renderPrompt(
    "template_pick",
    { catalog: formatCatalog(catalog) },
    settings.prompts,
  );
  const pickResult = await runAi({
    context: "templates",
    mode: "build-pick",
    path: userInfo.path,
    system: pickSystem,
    user: message,
    history: cleanHistory,
    user_id: userInfo.user_id,
    username: userInfo.username,
    ip: userInfo.ip,
    userAgent: userInfo.userAgent,
  });
  const picked = extractJsonObject<{ reply?: unknown; templateId?: unknown }>(pickResult.text);
  const pickReply = typeof picked?.reply === "string" ? picked.reply : "";
  const templateId = typeof picked?.templateId === "string" ? picked.templateId.trim() : "";
  const chosen = templateId ? catalog.find((t) => t.id === templateId) : undefined;

  if (!chosen) {
    return NextResponse.json({
      reply: pickReply || "ยังไม่มี template ที่เหมาะกับความต้องการของคุณในตอนนี้",
      suggestedTag: null,
      templateId: null,
      overrides: [],
      applied: [],
    });
  }

  // STAGE 2 — read the chosen template's structure + texts from the DB
  // (component ids from puck_layout, current copy from puck_texts).
  const { data: row } = await createAdminClient()
    .from("website_templates")
    .select("puck_layout, puck_texts")
    .eq("id", chosen.id)
    .single();

  const { instances, inventory } = collectInstanceTexts(row?.puck_layout, row?.puck_texts);

  if (!row?.puck_layout || inventory.trim() === "") {
    return NextResponse.json({
      reply: `เลือก "${chosen.name}" ไว้แล้ว แต่ยังไม่มีข้อความที่แก้ได้ใน database — ลองบันทึก template ใหม่จาก Studio`,
      suggestedTag: null,
      templateId: null,
      overrides: [],
      applied: [],
    });
  }

  const buildSystem = renderPrompt(
    "template_build",
    { request: message, inventory },
    settings.prompts,
  );
  const buildResult = await runAi({
    context: "templates",
    mode: "build",
    path: userInfo.path,
    system: buildSystem,
    user: message,
    history: cleanHistory,
    user_id: userInfo.user_id,
    username: userInfo.username,
    ip: userInfo.ip,
    userAgent: userInfo.userAgent,
  });
  const built = extractJsonObject<{ reply?: unknown; overrides?: unknown }>(buildResult.text);
  const { overrides, applied } = validateBuildOverrides(built?.overrides, instances);
  const buildReply = typeof built?.reply === "string" ? built.reply : "";

  return NextResponse.json({
    reply: buildReply || pickReply,
    suggestedTag: null,
    templateId: chosen.id,
    templateName: chosen.name,
    overrides,
    applied,
  });
}