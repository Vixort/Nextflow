"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Render } from "@puckeditor/core";
import { normalizeMultiPageData } from "@/lib/puck/multiPageUtils";
import { puckConfig } from "@/lib/puck/puckConfig";
import { applyComponentOverrides } from "@/lib/puck/textSplit";
import {
  extractHtmlTextInventory,
  type HtmlTextEdit,
  type HtmlTextItem,
} from "@/lib/static/htmlTextEdits";
import { Palette, Power, Wand2 } from "lucide-react";
import ThemeCustomizer, {
  DEFAULT_THEME,
  type ThemeColors,
} from "@/components/ThemeCustomizer";
import { ensureReadable, onAccentTextColor } from "@/lib/utils/color";

type PublicTemplate = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  thumbnail_url: string | null;
  global_css: string | null;
  puck_data: unknown;
  render_mode?: "puck" | "static";
  storage_path?: string | null;
  updated_at: string | null;
};

const normalizeSlug = (s: string) =>
  `/${String(s || "").replace(/^\/+|\/+$/g, "")}`;

export default function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [template, setTemplate] = useState<PublicTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [notFoundPath, setNotFoundPath] = useState<string | null>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  // AI ADAPT COPY: text parameters carried from the template chat (/build).
  const [aiOverrides, setAiOverrides] = useState<unknown[] | null>(null);
  const [aiApplied, setAiApplied] = useState<string[]>([]);
  const [aiTemplateName, setAiTemplateName] = useState<string | null>(null);

  // Visitor theme customizer (preview-only, no persistence).
  const [themeOpen, setThemeOpen] = useState(false);
  const [themeEnabled, setThemeEnabled] = useState(false);
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_THEME);
  const [editText, setEditText] = useState(false);

  // AI COPY EDITOR (static HTML templates only, preview-only — nothing saved).
  const [aiOpen, setAiOpen] = useState(false);
  const [aiFetching, setAiFetching] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [inventory, setInventory] = useState<HtmlTextItem[] | null>(null);
  const [edits, setEdits] = useState<HtmlTextEdit[]>([]);
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "model"; content: string }[]
  >([
    {
      role: "model",
      content:
        "AI COPY EDITOR ONLINE. Tell me how you want the copy changed, e.g. \u201Cmake it sound more modern\u201D or \u201Crebrand this as a coffee shop\u201D \u2014 I'll rewrite the text live in the preview.",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const htmlRef = useRef<string | null>(null);
  const aiChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    params
      .then((p) => p.id)
      .then((id) =>
        fetch(`/api/templates/${id}`)
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error("not found"))))
          .then((json) => {
            if (cancelled || !json?.data?.template) return null;

            // AI ADAPT COPY: carry text parameters from the /templates chat.
            const q = new URLSearchParams(window.location.search);
            if (q.get("ai") === "1") {
              const raw = sessionStorage.getItem(`nextflow-ai-overrides:${id}`);
              if (raw) {
                try {
                  const parsed = JSON.parse(raw);
                  setAiOverrides(Array.isArray(parsed.overrides) ? parsed.overrides : []);
                  setAiApplied(Array.isArray(parsed.applied) ? parsed.applied : []);
                  setAiTemplateName(typeof parsed.templateName === "string" ? parsed.templateName : null);
                } catch {
                  setAiOverrides([]);
                }
              } else {
                setAiOverrides([]);
              }
            }

            return json;
          }),
      )
      .then((json) => {
        if (cancelled) return;
        setTemplate(json?.data?.template ?? null);
        setPageIndex(0);
        setNotFoundPath(null);
      })
      .catch(() => {
        if (!cancelled) setError("Template not found or not published.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const pages = useMemo(() => {
    if (!template) return [];
    const multi = normalizeMultiPageData(template.puck_data as never);
    if (aiOverrides && aiOverrides.length > 0) {
      const { pages } = applyComponentOverrides(multi, aiOverrides);
      return pages;
    }
    return multi.pages;
  }, [template, aiOverrides]);

  const isStatic = template?.render_mode === "static";

  const staticSrc = useMemo(() => {
    if (!template || !isStatic || !template.storage_path) return null;
    const q = new URLSearchParams();
    // AI copy edits ride along as a validated query param; the server applies
    // them to the original HTML, so relative asset URLs keep resolving.
    if (edits.length > 0) {
      q.set("aiEdits", JSON.stringify(edits));
    }
    // When theming is off, serve the original exported site untouched.
    if (themeEnabled) {
      // Auto-fix contrast for the static preview too: never ship a text color
      // that blends into the chosen background.
      const safeText = ensureReadable(colors.text, colors.bg);
      if (colors.bg !== DEFAULT_THEME.bg) q.set("bg", colors.bg);
      if (safeText !== DEFAULT_THEME.text) q.set("text", safeText);
      if (colors.accent !== DEFAULT_THEME.accent) q.set("accent", colors.accent);
      if (colors.accentHue !== DEFAULT_THEME.accentHue) q.set("accentHue", colors.accentHue);
    }
    const qs = q.toString();
    return `/api/templates/${template.id}/static/index.html${qs ? `?${qs}` : ""}`;
  }, [template, isStatic, themeEnabled, colors, edits]);

  const activeIndex = Math.min(pageIndex, Math.max(pages.length - 1, 0));
  const activePage = pages[activeIndex] || pages[0];
  const activeSlug = notFoundPath || activePage?.slug || "/";

  const goToPage = (idx: number) => {
    setNotFoundPath(null);
    setPageIndex(idx);
    requestAnimationFrame(() => {
      renderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const scrollToAnchor = (anchorId: string) => {
    if (!renderRef.current) return;
    renderRef.current
      .querySelector(`[id="${CSS.escape(anchorId)}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target instanceof Element ? e.target.closest("a") : null;
    if (!target) return;
    const raw = target.getAttribute("href") || "";

    if (/^(https?:|mailto:|tel:)/i.test(raw)) return;

    e.preventDefault();

    const [pathPart, anchorPart = ""] = raw.split("#");
    const pureHash = pathPart === "" && anchorPart !== "";

    if (pureHash) {
      scrollToAnchor(anchorPart);
      return;
    }

    const path = pathPart || "/";
    if (anchorPart) {
      const idx = pages.findIndex(
        (p) => normalizeSlug(p.slug) === normalizeSlug(path),
      );
      if (idx !== -1) {
        goToPage(idx);
        requestAnimationFrame(() => scrollToAnchor(anchorPart));
        return;
      }
    }

    const idx = pages.findIndex(
      (p) => normalizeSlug(p.slug) === normalizeSlug(path),
    );
    if (idx !== -1) {
      goToPage(idx);
      return;
    }

    setNotFoundPath(path);
    requestAnimationFrame(() => {
      renderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

// Puck accent override: recolors cyan/sky Tailwind utilities via CSS variables.
  const puckThemeStyle = useMemo(() => {
    if (isStatic || !themeEnabled) return null;
    const accent = colors.accent || DEFAULT_THEME.accent;
    const bg = colors.bg || DEFAULT_THEME.bg;
    const text = colors.text || DEFAULT_THEME.text;
    const buttonText = colors.buttonText || onAccentTextColor(accent);
    return `
      [data-puck-canvas]{
        background:${bg} !important;
        color:${text} !important;
      }
      /* Gradient-clipped headings must keep their gradient — never recolor */
      [data-puck-canvas] [class*="bg-clip-text"],
      [data-puck-canvas] [class*="text-transparent"]{
        color:transparent !important;
      }
      /* Links always carry the accent hue */
      [data-puck-canvas] a,
      [data-puck-canvas] [class*="text-cyan"],
      [data-puck-canvas] [class*="text-sky"],
      [data-puck-canvas] [class*="hover:text-cyan"],
      [data-puck-canvas] [class*="hover:text-sky"]{
        color:${accent} !important;
      }
      /* Accent-filled surfaces get a guaranteed readable label */
      [data-puck-canvas] [class*="bg-cyan"],
      [data-puck-canvas] [class*="bg-sky"],
      [data-puck-canvas] [class*="hover:bg-cyan"],
      [data-puck-canvas] [class*="hover:bg-sky"]{
        background-color:${accent} !important;
        color:${buttonText} !important;
      }
      /* White (solid) chip labels stay near-black, even for links, so the
         accent rule above can never wash them out. */
      [data-puck-canvas] [class~="bg-white"],
      [data-puck-canvas] [class~="bg-white"] a{
        color:#0a0f1e !important;
      }
    `;
  }, [colors, isStatic, themeEnabled]);

  // Surface-aware text retheme: instead of forcing ONE color on every word
  // (which erases the template's own palette), only neutral-ink classes
  // (slate/white/black ramps) follow the theme Text, and each of them is
  // re-colored against the REAL background it sits on — so copy is always
  // readable whether it floats on the theme canvas or on a component's own
  // dark/light surface.
  const rethemeText = useCallback(
    (root: Element) => {
      const text = colors.text || DEFAULT_THEME.text;
      const parseRgba = (
        s: string | null,
      ): { r: number; g: number; b: number; a: number } | null => {
        if (!s || s === "transparent" || s === "rgba(0, 0, 0, 0)") return null;
        const m = s.match(
          /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\)/,
        );
        if (!m) return null;
        return {
          r: Number(m[1]),
          g: Number(m[2]),
          b: Number(m[3]),
          a: m[4]
            ? Math.min(Number(m[4].replace("%", "")) / (m[4].includes("%") ? 100 : 1), 1)
            : 1,
        };
      };

      const surfaceOf = (el: Element): string => {
        const layers: { r: number; g: number; b: number; a: number }[] = [];
        let node: Element | null = el;
        while (node) {
          const cs = getComputedStyle(node);
          // Gradient / image art: treat as dark so light copy over media
          // stays legible by the template's design.
          if (cs.backgroundImage && cs.backgroundImage !== "none") {
            return "#0b0e14";
          }
          const c = parseRgba(cs.backgroundColor);
          if (c && c.a > 0) layers.push({ ...c, a: c.a });
          if (node === root) break;
          node = node.parentElement;
        }
        // Composite from the canvas base upward to the element itself.
        const base = parseRgba(getComputedStyle(root).backgroundColor) ?? { r: 9, g: 10, b: 15, a: 1 };
        let r = base.r, g = base.g, b = base.b;
        for (const l of layers.reverse()) {
          r = r * (1 - l.a) + l.r * l.a;
          g = g * (1 - l.a) + l.g * l.a;
          b = b * (1 - l.a) + l.b * l.a;
        }
        return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
      };

      root.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const cls = String(el.className || "");
        const isNeutral =
          /(?:^|\s)text-(?:slate|gray|zinc|neutral)-(?:100|200|300|400|500|600|700|800|900|950)(?:\s|$)/.test(
            cls,
          ) || /(?:^|\s)text-(?:white|black)(?:\s|$)/.test(cls);
        if (!isNeutral) return;
        // Leave own-colored words alone (emerald checks, rose prices, …)
        if (
          /text-(?:cyan|sky|emerald|rose|amber|purple|pink|red|green|blue|yellow|orange|lime|teal|fuchsia|indigo|violet)-[0-9]+/.test(
            cls,
          )
        )
          return;
        if (/bg-clip-text|text-transparent/.test(cls)) return;
        el.style.color = ensureReadable(text, surfaceOf(el));
      });
    },
    [colors],
  );

  // Re-apply the retheme after the canvas re-renders (page change, AI copy,
  // or theme change) — inline styles must follow the latest DOM.
  useEffect(() => {
    const root = renderRef.current;
    // Theming off: strip every retheme-applied inline color so the page
    // shows the template's true design.
    if (isStatic || !themeEnabled) {
      root?.querySelectorAll<HTMLElement>("[style*='color:']").forEach((el) => {
        el.style.removeProperty("color");
      });
      return;
    }
    if (!root) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (renderRef.current) rethemeText(renderRef.current);
      });
    };
    run();
    const mo = new MutationObserver(run);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [rethemeText, isStatic, themeEnabled, template]);

  // Contenteditable text editing (Puck rendered DOM only, preview-only).
  useEffect(() => {
    if (isStatic || !editText || !renderRef.current) return;
    const root = renderRef.current;
    const els = Array.from(root.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,a,li,button"));

    const setEditable = (el: Element) => {
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
    };
    const removeEditable = (el: Element) => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
    };

    if (editText) els.forEach(setEditable);
    return () => els.forEach(removeEditable);
  }, [editText, isStatic, template]);

  // AI copy editor — fetch the raw HTML once (cached), build the text inventory.
  const openAiPanel = useCallback(async () => {
    setAiOpen((v) => !v);
    if (aiOpen || htmlRef.current || !template || !isStatic) return;
    setAiFetching(true);
    try {
      const res = await fetch(`/api/templates/${template.id}/static/index.html`);
      if (!res.ok) throw new Error("failed to fetch template");
      const html = await res.text();
      htmlRef.current = html;
      setInventory(extractHtmlTextInventory(html));
    } catch {
      setAiMessages((prev) => [
        ...prev,
        { role: "model", content: "ERROR: could not load the template HTML." },
      ]);
    } finally {
      setAiFetching(false);
    }
  }, [aiOpen, template, isStatic]);

  // Send the request to the static copy editor and apply text swaps live.
  const sendAiChat = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = aiInput.trim();
      if (!text || aiLoading || !inventory) return;
      setAiInput("");
      setAiMessages((prev) => [...prev, { role: "user", content: text }]);
      setAiLoading(true);
      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: aiMessages,
            mode: "static",
            staticInventory: inventory,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "AI request failed");
        const overrides: { id?: unknown; value?: unknown }[] = Array.isArray(data.overrides)
          ? data.overrides
          : [];
        setEdits((prev) => {
          const next = [...prev];
          for (const ov of overrides) {
            if (typeof ov.id !== "string" || typeof ov.value !== "string") continue;
            const item = inventory.find((i) => i.id === ov.id);
            if (!item) continue;
            const edit = { oldText: item.rawText, value: ov.value };
            const idx = next.findIndex((ed) => ed.oldText === edit.oldText);
            if (idx !== -1) next[idx] = edit;
            else next.push(edit);
          }
          return next;
        });
        setAiMessages((prev) => [
          ...prev,
          { role: "model", content: data.reply || "Preview updated." },
        ]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : undefined;
        setAiMessages((prev) => [
          ...prev,
          { role: "model", content: `ERROR: ${msg || "could not reach the AI."}` },
        ]);
      } finally {
        setAiLoading(false);
      }
    },
    [aiInput, aiLoading, inventory, aiMessages],
  );

  // Auto-scroll the chat area.
  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages, aiFetching, aiLoading]);

  const renderMode = isStatic ? "static" : "puck";

  return (
    <main className="min-h-screen bg-[#06070a] text-slate-200">
      <header className="border-b border-white/10 bg-[#090a0f]/90 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/templates"
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Templates
          </Link>
          <div className="text-center min-w-0">
            <h1 className="text-lg font-black text-white truncate">
              {template?.name || "Template"}
            </h1>
            <p className="text-[11px] text-slate-500">
              {template?.category || "Landing Page"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Home →
            </Link>
          </div>
        </div>
      </header>

      <div className="px-0 md:px-0 py-8 w-full">
        {loading ? (
          <p className="text-slate-400 font-semibold px-6">Loading template...</p>
        ) : error || !template ? (
          <div className="text-center py-20 space-y-4 px-6">
            <p className="text-slate-400 font-semibold">
              {error || "Template not found."}
            </p>
            <Link
              href="/templates"
              className="inline-block px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Back to Templates
            </Link>
          </div>
        ) : isStatic && staticSrc ? (
          <div className="relative rounded-none overflow-hidden border border-white/10 bg-white shadow-2xl flex flex-col min-h-screen w-full">
            <div className="p-2 border-b border-slate-200 bg-white flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-3 flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                <span className="text-emerald-500 text-xs">🔒</span>
                <span className="text-xs font-mono text-slate-600 truncate">
                  nextflow.example.com/
                </span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                  HTML/CSS/JS
                </span>
                <button
                  onClick={() => openAiPanel()}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    aiOpen
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  }`}
                  title={
                    aiOpen
                      ? "AI copy editor ON"
                      : "Tailor the page copy with AI (preview only)"
                  }
                  aria-label="AI copy editor"
                >
                  <Wand2 size={13} />
                </button>
                <button
                  onClick={() => setThemeEnabled((v) => !v)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    themeEnabled
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  }`}
                  title={
                    themeEnabled
                      ? "Custom theme ON — click to see original colors"
                      : "Custom theme OFF — showing original colors"
                  }
                  aria-label="Toggle custom theme"
                >
                  <Power size={13} />
                </button>
                <button
                  onClick={() => setThemeOpen((v) => !v)}
                  className="w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all cursor-pointer"
                  title="Customize theme"
                  aria-label="Customize theme"
                >
                  <Palette size={14} />
                </button>
              </div>
            </div>
            {edits.length > 0 && (
              <div className="px-4 py-2 border-b border-cyan-300/60 bg-cyan-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-cyan-800 whitespace-nowrap">
                    AI Adapted Copy
                  </span>
                  <span className="text-[11px] font-medium text-cyan-700 truncate">
                    {edits.length} text item(s) rewritten on this HTML template
                  </span>
                </div>
                <button
                  onClick={() => setEdits([])}
                  className="px-3 py-1 rounded-md bg-white border border-cyan-400 text-cyan-800 text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-100 cursor-pointer shrink-0"
                >
                  Clear Copy
                </button>
              </div>
            )}
            <iframe
              key={staticSrc}
              src={staticSrc}
              title={template.name}
              sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads"
              className="flex-1 w-full min-h-screen border-0 bg-white"
            />
            {aiOpen && (
              <div className="absolute right-3 top-16 z-30 w-80 max-w-[calc(100%-1.5rem)] bg-[#090a0f] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                <div className="px-3 py-2 border-b border-white/10 bg-[#0a0b12] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 animate-pulse shrink-0" />
                    <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest">
                      AI Copy Editor
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    preview only
                  </span>
                </div>
                <div
                  ref={aiChatRef}
                  className="flex-1 min-h-0 max-h-64 overflow-y-auto px-3 py-3 space-y-3 bg-[#06070a]"
                >
                  {aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1 opacity-60">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">
                          {msg.role === "user" ? "USER_INPUT" : "SYSTEM_RESPONSE"}
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-none border max-w-[95%] text-[11px] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-50 border-r-2 border-r-cyan-400"
                            : "bg-[#0a0b12] border-white/10 text-slate-300 border-l-2 border-l-slate-400"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {(aiFetching || aiLoading) && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-1 opacity-60">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">
                          SYSTEM_PROCESSING
                        </span>
                      </div>
                      <div className="p-2.5 rounded-none border max-w-[90%] text-[11px] leading-relaxed bg-[#0a0b12] border-white/10 text-slate-500 flex items-center gap-2 border-l-2 border-l-slate-400">
                        <div className="w-1 h-1 bg-slate-500 rounded-none animate-ping" />
                        <span className="font-mono text-[9px] tracking-widest uppercase">
                          {aiFetching ? "Loading template..." : "Computing..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <form
                  onSubmit={sendAiChat}
                  className="flex gap-0 border-t border-white/10 bg-[#0a0b12] shrink-0"
                >
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Describe the copy change..."
                    disabled={aiLoading || aiFetching || !inventory}
                    className="flex-1 bg-[#06070a] border-none text-white text-[11px] px-3 py-2 rounded-none focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="submit"
                    disabled={!aiInput.trim() || aiLoading || aiFetching || !inventory}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-[9px] uppercase tracking-widest font-extrabold disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-none shrink-0"
                  >
                    EXECUTE
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : notFoundPath ? (
          <div className="rounded-none overflow-hidden border border-white/10 bg-white shadow-2xl flex flex-col min-h-screen w-full">
            <div className="p-2 border-b border-slate-200 bg-white flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-3 flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                <span className="text-xs font-mono text-slate-600 truncate">
                  nextflow.example.com{notFoundPath}
                </span>
              </div>
            </div>
            <div className="py-24 px-6 text-center">
              <p className="text-6xl font-black text-slate-900 tracking-tight">
                404
              </p>
              <p className="mt-3 text-slate-500 font-semibold">
                The page{" "}
                <span className="font-mono text-rose-500">{notFoundPath}</span>{" "}
                does not exist in this template.
              </p>
              <button
                onClick={() => goToPage(0)}
                className="mt-6 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-sm cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : activePage?.data ? (
          <div className="rounded-none overflow-hidden border border-white/10 bg-white shadow-2xl flex flex-col min-h-screen w-full">
            <div className="p-2 border-b border-slate-200 bg-white flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-3 flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                <span className="text-emerald-500 text-xs">🔒</span>
                <span className="text-xs font-mono text-slate-600 truncate">
                  nextflow.example.com{activeSlug}
                </span>
                <button
                  onClick={() => setThemeEnabled((v) => !v)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    themeEnabled
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  }`}
                  title={
                    themeEnabled
                      ? "Custom theme ON — click to see original colors"
                      : "Custom theme OFF — showing original colors"
                  }
                  aria-label="Toggle custom theme"
                >
                  <Power size={13} />
                </button>
                <button
                  onClick={() => setThemeOpen((v) => !v)}
                  className="ml-auto w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title="Customize theme"
                  aria-label="Customize theme"
                >
                  <Palette size={14} />
                </button>
              </div>
            </div>
            {aiOverrides && aiOverrides.length > 0 && (
              <div className="px-4 py-2 border-b border-cyan-300/60 bg-cyan-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-cyan-800 whitespace-nowrap">
                    AI Adapted Copy
                  </span>
                  <span className="text-[11px] font-medium text-cyan-700 truncate">
                    {aiApplied.length} text field(s) rewritten on this Puck template
                  </span>
                </div>
                <button
                  onClick={() => {
                    const key = `nextflow-ai-overrides:${template?.id ?? window.location.pathname.split("/").pop()}`;
                    sessionStorage.removeItem(key);
                    setAiOverrides(null);
                    setAiApplied([]);
                    setAiTemplateName(null);
                    const q = new URLSearchParams(window.location.search);
                    q.delete("ai");
                    const qs = q.toString();
                    window.location.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`);
                  }}
                  className="px-3 py-1 rounded-md bg-white border border-cyan-400 text-cyan-800 text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-100 cursor-pointer shrink-0"
                >
                  Clear Copy
                </button>
              </div>
            )}
            <div
              ref={renderRef}
              data-puck-canvas
              className="bg-white flex-1 [&_.render-link]:!text-current"
              onClick={handleContainerClick}
            >
              <style>{puckThemeStyle}</style>
              <Render data={activePage.data} config={puckConfig} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 font-semibold">
              Template has no renderable page.
            </p>
          </div>
        )}
      </div>

      <ThemeCustomizer
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        renderMode={renderMode}
        colors={colors}
        enabled={themeEnabled}
        onApply={setColors}
        onToggleEnabled={setThemeEnabled}
        editText={editText}
        onEditText={(v) => setEditText(v)}
      />
    </main>
  );
}
