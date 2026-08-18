"use client";

import { useState } from "react";
import { Palette, Type, RotateCcw, Zap, Gem, MoonStar, Leaf, Circle, Droplet, Sparkles, Sun, Pencil, X, Wand2 } from "lucide-react";
import { ensureReadable, onAccentTextColor } from "@/lib/utils/color";

const PRESET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cyberpunk: Zap,
  obsidian: Gem,
  midnight: MoonStar,
  emerald: Leaf,
  slate: Circle,
  ruby: Droplet,
  violet: Sparkles,
  amber: Sun,
};

export const THEME_PRESETS: {
  key: string;
  name: string;
  bg: string;
  text: string;
  accent: string;
  accentHue: string;
}[] = [
  { key: "cyberpunk", name: "Cyberpunk Neon", bg: "#090a0f", text: "#f8fafc", accent: "#06b6d4", accentHue: "#22d3ee" },
  { key: "obsidian", name: "Obsidian Gold", bg: "#050505", text: "#fef08a", accent: "#eab308", accentHue: "#facc15" },
  { key: "midnight", name: "Deep Midnight", bg: "#0f172a", text: "#e2e8f0", accent: "#818cf8", accentHue: "#a5b4fc" },
  { key: "emerald", name: "Emerald Luxury", bg: "#022c22", text: "#ecfdf5", accent: "#10b981", accentHue: "#34d399" },
  { key: "slate", name: "Minimal Slate", bg: "#f8fafc", text: "#0f172a", accent: "#0284c7", accentHue: "#0ea5e9" },
  { key: "ruby", name: "Ruby Rouge", bg: "#1a0505", text: "#fee2e2", accent: "#e11d48", accentHue: "#f43f5e" },
  { key: "violet", name: "Ultraviolet", bg: "#13101f", text: "#ede9fe", accent: "#7c3aed", accentHue: "#a78bfa" },
  { key: "amber", name: "Solar Amber", bg: "#1c1402", text: "#fef3c7", accent: "#f59e0b", accentHue: "#fbbf24" },
];

export type ThemeColors = { bg: string; text: string; accent: string; accentHue: string; buttonText?: string };

export const DEFAULT_THEME: ThemeColors = {
  bg: "#090a0f",
  text: "#f8fafc",
  accent: "#06b6d4",
  accentHue: "#22d3ee",
};

type ThemeCustomizerProps = {
  open: boolean;
  onClose: () => void;
  renderMode: "puck" | "static";
  colors: ThemeColors;
  enabled: boolean;
  onApply: (colors: ThemeColors) => void;
  onToggleEnabled: (v: boolean) => void;
  editText?: boolean;
  onEditText?: (v: boolean) => void;
};

const hexInputs = (key: string, colors: ThemeColors) => [
  { key: "bg", label: "Background", value: colors.bg },
  { key: "text", label: "Text", value: colors.text },
  { key: "accent", label: "Accent", value: colors.accent },
];

export default function ThemeCustomizer({
  open,
  onClose,
  renderMode,
  colors,
  enabled,
  onApply,
  onToggleEnabled,
  editText,
  onEditText,
}: ThemeCustomizerProps) {
  const [tab, setTab] = useState<"presets" | "custom">("presets");
  const [autoContrast, setAutoContrast] = useState(true);

  // When auto-contrast is on, body copy adapts to the chosen background so it
  // can never blend into the page surface. The accent stays as chosen — it is
  // a brand color, not body text; readable labels on accent surfaces are
  // handled by onAccentTextColor.
  const pick = (next: Partial<ThemeColors>): ThemeColors => {
    const merged = { ...colors, ...next } as ThemeColors;
    if (!autoContrast) return merged;
    const bg = merged.bg;
    const safeText = ensureReadable(merged.text, bg);
    const buttonText = onAccentTextColor(merged.accent);
    return { ...merged, text: safeText, buttonText };
  };

  const applyPreset = (preset: (typeof THEME_PRESETS)[number]) => {
    onToggleEnabled(true);
    onApply(
      pick({
        bg: preset.bg,
        text: preset.text,
        accent: preset.accent,
        accentHue: preset.accentHue,
      }),
    );
  };

  const reset = () => {
    onToggleEnabled(false);
    onApply(DEFAULT_THEME);
  };

  const setField = (key: string, value: string) => {
    onToggleEnabled(true);
    onApply(pick({ [key]: value }));
  };

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className="fixed top-20 right-4 z-50 w-80 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0e15]/95 backdrop-blur-xl shadow-2xl text-xs text-slate-200"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0d0e15]/95 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Palette size={15} className="text-cyan-400" />
                <span className="font-bold text-sm text-white">Customize</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={reset}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset theme"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close theme customizer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* On/off switch */}
            <div
              className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 transition-colors ${
                enabled ? "border-cyan-500/20 bg-cyan-500/10" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="min-w-0">
                <div className={`text-[11px] font-black uppercase tracking-wider ${enabled ? "text-cyan-300" : "text-slate-400"}`}>
                  {enabled ? "Custom theme ON" : "Custom theme OFF"}
                </div>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                  {enabled
                    ? "Preview is re-themed. Turn off to see the template's original colors."
                    : "Showing the original template colors as designed."}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={enabled}
                onClick={() => onToggleEnabled(!enabled)}
                className={`relative w-10 h-5.5 h-[22px] rounded-full shrink-0 transition-colors cursor-pointer ${
                  enabled ? "bg-cyan-500" : "bg-slate-700"
                }`}
                title="Toggle custom theme"
              >
                <span
                  className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
                    enabled ? "translate-x-[22px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 border-b border-white/10">
            {(["presets", "custom"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {t === "presets" ? "Color Presets" : "Custom Colors"}
              </button>
            ))}
          </div>

          <div className="p-3 space-y-3 max-h-72 overflow-y-auto">
            {tab === "presets" ? (
              <div className="grid grid-cols-2 gap-2">
                {THEME_PRESETS.map((p) => {
                  const active = colors.bg === p.bg && colors.accent === p.accent;
                  return (
                    <button
                      key={p.key}
                      onClick={() => applyPreset(p)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? "border-cyan-500/60 bg-cyan-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                        style={{
                          background: `linear-gradient(135deg, ${p.accent} 0%, ${p.bg} 60%)`,
                        }}
                      />
                      <span className="flex items-center gap-1.5 truncate font-semibold text-[11px] text-slate-200">
                        {(() => {
                          const Icon = PRESET_ICONS[p.key] || Circle;
                          return <Icon className="w-3 h-3 shrink-0 opacity-70" />;
                        })()}
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    const v = !autoContrast;
                    setAutoContrast(v);
                    if (v) onApply(pick({ bg: colors.bg }));
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border font-semibold text-[11px] transition-colors cursor-pointer ${
                    autoContrast
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                  title={autoContrast ? "Auto contrast is on — text stays readable" : "Turn on automatic text contrast"}
                >
                  <span className="flex items-center gap-2">
                    <Wand2 size={12} />
                    Auto contrast
                  </span>
                  <span className={`w-8 h-4 rounded-full relative transition-colors ${autoContrast ? "bg-emerald-500" : "bg-white/15"}`}>
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoContrast ? "left-4" : "left-0.5"}`} />
                  </span>
                </button>
                {hexInputs("", colors).map((f) => (
                  <label key={f.key} className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-300">{f.label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={f.value}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent"
                      />
                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className="w-24 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-mono text-[10px] outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </label>
                ))}
                <p className="text-[10px] text-slate-500 pt-1 leading-snug">
                  Enter a <span className="font-mono">#hex</span> value or pick from the color
                  swatch.
                </p>
              </div>
            )}
          </div>

          {/* Text editing (Puck only) */}
          {renderMode === "puck" && onEditText && (
            <div className="px-3 pb-3">
              <button
                onClick={() => onEditText(!editText)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                  editText
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Type size={13} />
                {editText ? "Text editing on - click any text" : "Edit text on this page"}
              </button>
              {editText && (
                <p className="text-[10px] text-slate-500 mt-1.5 text-center leading-snug flex items-center justify-center gap-1">
                  <Pencil size={10} className="text-emerald-400" />
                  Click any text and type to change it. Preview-only.
                </p>
              )}
            </div>
          )}
          </div>
        </>
      )}
    </>
  );
}
