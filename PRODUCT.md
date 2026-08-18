# PRODUCT.md - Nextflow Product Context

## Product Overview
**Nextflow** is a production-grade visual website builder and template management engine engineered with Next.js 16 (App Router), React 19, Supabase Postgres, and the Puck visual drag-and-drop editor (`@puckeditor/core`).

It enables designers and development teams to construct, edit, preview, and deploy high-converting multi-page web applications and e-commerce storefronts without generic AI design patterns.

---

## Core Product Pillars

### 1. Website Template Studio
- **Visual Puck Editor**: Integrated visual editor with 24 component categories and over 215 component presets (Heroes, Features, Bento Grids, E-Commerce Catalogs, Products Rails, Full-Bleed Video Backgrounds, Testimonials, Footers).
- **Multi-Page Project Data Format**: Full support for multi-page project structures (`active_page_id`, `pages[]`, `ensureContentIds`) stored as JSON in Supabase.

### 2. Nova Market E-Commerce Storefront
- Flagship multi-page e-commerce template (`Home`, `Shop Catalog`, `Product Detail`, `Cart & Checkout`, `About Story`).
- Features high-resolution studio photography, full-bleed video hero sections (`HeroImmersiveVideo`), products horizontal scroll rail (`EcommerceProductsRail`), interactive comparison sliders, and encrypted checkout previews.

### 3. High-Agency Design Language (Anti-AI-Slop)
- **Sharp Angular Geometry**: 0px rectangular edges (`rounded-none`, `border border-white/10`) inspired by luxury design houses (Acne Studios, Bang & Olufsen).
- **Zero-Emoji Discipline**: 100% emoji-free typography, badges, and component defaults across all templates.
- **Mobile-First Stability**: Viewport height stability (`min-h-[100dvh]`), crisp single-column fallbacks on `< 768px`, and high-contrast readable typography.

### 4. Custom Auth & Data Infrastructure
- Custom JWT cookie auth (`jose` + `bcryptjs`) integrated with Supabase Postgres (`website_templates` table).
- Server route protection via `getAuthSession(request)` and distributed rate limiting (60 req/min).

---

## Target Audience
- Web agencies & design studios building custom client websites.
- E-commerce brands seeking high-converting, immersive storefront experiences.
- Product managers & frontend developers needing reusable visual component systems.
