// WCAG contrast helpers for the theme customizer. Keeps text readable against
// any background chosen by the user — the AI/preview must never render
// invisible copy.

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = String(hex || "").trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const full =
    raw.length === 3
      ? raw.split("").map((c) => c + c).join("")
      : raw;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * linear(rgb.r) + 0.7152 * linear(rgb.g) + 0.0722 * linear(rgb.b)
  );
}

// WCAG contrast ratio between two hex colors (1..21).
export function contrastRatio(a: string, b: string): number | null {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// True when the "text" color is readable against "bg" (AA for normal text).
export function isReadable(text: string, bg: string, min = 4.5): boolean {
  const c = contrastRatio(text, bg);
  return c !== null && c >= min;
}

// Picks white or near-black, whichever contrasts best with the given bg.
export function autoTextColor(bg: string): string {
  const white = "#f8fafc";
  const dark = "#0a0f1e";
  const cw = contrastRatio(white, bg);
  const cd = contrastRatio(dark, bg);
  if (cw === null || cd === null) return white;
  return cd > cw ? dark : white;
}

// Returns given "text" when it's readable on "bg", otherwise an auto-safe one.
export function ensureReadable(text: string, bg: string): string {
  if (!hexToRgb(text) || !hexToRgb(bg)) return autoTextColor(bg);
  return isReadable(text, bg) ? text : autoTextColor(bg);
}

// Dark-on-light check for accent backgrounds, e.g. buttons with a bright
// accent bg need a dark label to stay legible.
export function onAccentTextColor(accent: string): string {
  const cWhite = contrastRatio("#ffffff", accent);
  const cDark = contrastRatio("#0a0f1e", accent);
  if (cWhite === null || cDark === null) return "#0a0f1e";
  return cDark > cWhite ? "#0a0f1e" : "#ffffff";
}