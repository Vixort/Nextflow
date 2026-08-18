# DESIGN.md - Nextflow Design System & Visual Guidelines

## Visual Identity & Design Philosophy

Nextflow follows an **Anti-AI-Slop, High-Agency Design System** focused on sharp geometry, crisp contrast, real studio photography, and restrained typography.

---

## 1. Color Palette

- **Background Neutral (Primary)**: `#090a0f` / `bg-slate-950` / `bg-black`
- **Surface Elevation**: `#0a0b12` / `bg-slate-900` / `bg-white/5`
- **Border Tokens**: `border-white/10` / `border-slate-800` / `border-cyan-500/20`
- **Text Color Hierarchy**:
  - Primary Text: `#ffffff` / `text-white`
  - Secondary Text: `#cbd5e1` / `text-slate-300`
  - Muted Text: `#64748b` / `text-slate-400` / `text-slate-500`
- **Singular Accent**: Cyan (`#06b6d4` / `text-cyan-400` / `bg-cyan-500`) with high contrast against dark surfaces.

---

## 2. Typography Rules

- **Display & Headings**: Font Sans (`Inter`, `Geist`, `Satoshi`) with bold/extrabold weight (`font-extrabold`, `font-black`).
- **Technical Metrics & Badges**: Font Mono (`font-mono`, `text-[10px]`, `tracking-widest`).
- **NO EMOJIS**: Strictly 100% emoji-free across all page components, labels, and text copy. Replace symbols with clean Lucide SVG icons (`<Star />`, `<Zap />`, `<CheckCircle2 />`).

---

## 3. Geometry & Layout Rules

- **Sharp Angular Edges**: Use `rounded-none` or `rounded-sm` for cards, buttons, badges, and image containers. No bubbly rounded pills (`rounded-full`) or bloated `rounded-3xl` cards.
- **Mobile-First Stability**: Always use `min-h-[100dvh]` for full-height Hero sections to prevent address bar jumps on iOS Safari and mobile Chrome.
- **Grid Structure**: Use clean, balanced CSS grid layouts (`grid-cols-1 md:grid-cols-2` or `grid-cols-1 md:grid-cols-3` / `md:grid-cols-4`) with responsive fallbacks (`w-full px-4 sm:px-6 lg:px-8`).

---

## 4. Components & Presets

- **Hero Immersive Video**: Full-bleed background video hero (`min-h-[100dvh]`) with HTML5 autoplay video loop, dark vignette overlay, and sharp `rounded-none` CTAs.
- **Products Horizontal Scroll Rail**: `EcommerceProductsRail` snap carousel showing flagship goods with sharp 0px frames and add-to-cart buttons.
- **Feature Matrix**: `FeatureListSplit` enriched with 3-metric summary grid (`DISPATCH 24h`, `GUARANTEE 2y`, `TEST TRIAL 30d`).
