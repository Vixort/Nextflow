-- ============================================================
-- Services catalog: the services grid + every "Learn more"
-- detail is DB-driven (admin-editable, service role only).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Globe',
  color TEXT NOT NULL DEFAULT 'from-cyan-400 to-blue-600',
  description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  outcome TEXT NOT NULL DEFAULT '',
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_for JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline TEXT NOT NULL DEFAULT '',
  contact_service TEXT NOT NULL DEFAULT 'Something else',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services (sort_order);

-- Seed the six existing services (safe re-runnable).
INSERT INTO public.services (title, slug, icon, color, description, features, outcome, deliverables, best_for, timeline, contact_service, sort_order, is_active) VALUES
(
  'Custom Web Platforms', 'custom-web-platforms', 'Globe', 'from-cyan-400 to-blue-600',
  'Awwwards-grade websites and full-scale web platforms built with modern frameworks. Blazing-fast, SEO-optimized, and engineered to scale from launch day.',
  '["Enterprise Next.js apps","High-performance front-ends","Headless CMS & e-commerce"]',
  'A production-grade web platform your team can actually grow with — fast, SEO-ready, and easy to extend without rewriting everything in a year.',
  '["Pixel-perfect responsive web app","SEO + Core Web Vitals optimization","Content management (headless CMS)","Analytics & conversion tracking","Design system + component library","Deployment, CI/CD & documentation"]',
  '["Companies outgrowing template sites","Startups needing a launch-ready product","Brands that need a standout web presence"]',
  '3–8 weeks for a full platform',
  'Web Platform', 1, true
),
(
  'SaaS & Cloud Architecture', 'saas-cloud-architecture', 'Boxes', 'from-purple-400 to-indigo-600',
  'We design resilient, multi-tenant SaaS products — from data modeling and auth to billing, observability, and infrastructure that holds under real load.',
  '["Multi-tenant backends","Cloud infrastructure (AWS/GCP)","CI/CD & observability"]',
  'A backend that stays fast and reliable as you onboard new customers — without the “works on my machine” surprises or surprise cloud bills.',
  '["Multi-tenant data architecture","Auth, roles & billing integration","Scalable cloud infrastructure (AWS/GCP)","CI/CD pipelines & automated testing","Observability: logs, metrics, alerts","Cost monitoring & optimization"]',
  '["SaaS founders on an MVP or v2","Products about to scale users","Teams drowning in tech debt"]',
  '4–12 weeks depending on scope',
  'SaaS Architecture', 2, true
),
(
  'Mobile Applications', 'mobile-applications', 'Smartphone', 'from-emerald-400 to-teal-600',
  'Native and cross-platform mobile apps with a mobile-first philosophy. Seamless UX, offline support, and app-store-ready quality.',
  '["iOS & Android","React Native / Flutter","Push, payments & offline"]',
  'An app your users install and keep — smooth on slow networks, offline-capable, and polished enough for the App Store review gauntlet.',
  '["iOS & Android app (single codebase)","Push notifications & deep links","In-app payments / subscriptions","Offline-first data sync","App Store / Play Store submission","Crash monitoring & updates"]',
  '["Businesses reaching customers on phones","Field teams needing offline tools","Startups shipping a companion app"]',
  '6–12 weeks for v1',
  'Mobile Application', 3, true
),
(
  'Event Technology', 'event-technology', 'Cpu', 'from-orange-400 to-pink-600',
  'Hardware and software integration for events — interactive booths, live IoT, real-time telemetry, and immersive digital orchestration.',
  '["Interactive booths & kiosks","Live IoT & sensors","Real-time dashboards"]',
  'An event experience that runs itself: interactive touchpoints, live data flowing to screens and dashboards, and zero “can you fix the projector” drama.',
  '["Interactive booth & kiosk software","IoT sensor & device integration","Real-time dashboards & telemetry","Live content orchestration","On-site support & dry-run","Post-event analytics report"]',
  '["Event agencies going digital","Venues upgrading their tech","Brands doing interactive activations"]',
  '2–6 weeks before the event',
  'Event Technology', 4, true
),
(
  'Bespoke Software Projects', 'bespoke-software-projects', 'Rocket', 'from-sky-400 to-cyan-600',
  'Custom platforms, internal tools, and complex integrations. We turn unique operational challenges into streamlined digital solutions that scale.',
  '["Internal tools & portals","System integrations","Legacy modernization"]',
  'A custom tool built around how your team actually works — killing the spreadsheet chaos and manual handoffs that slow everyone down.',
  '["Custom internal tools & portals","Third-party system integrations","Legacy system modernization","Automated workflows & reports","Training & handover sessions","Maintenance & support retainer"]',
  '["Operations with manual workflows","Teams stuck on legacy systems","Businesses needing unique tooling"]',
  'Scoped per project — 3 weeks typical starting point',
  'Something else', 5, true
),
(
  'Security & Reliability', 'security-reliability', 'ShieldCheck', 'from-amber-400 to-red-600',
  'Security is not an afterthought. We build SOC-2-minded systems with audit trails, encrypted data, RBAC, and reliability baked into the architecture.',
  '["Security audits","RBAC & encryption","SLOs & uptime guarantees"]',
  'Peace of mind: your system is hardened against the attacks that actually happen, with audit trails and uptime you can put in front of clients.',
  '["Full security audit & report","Penetration test & remediation","RBAC & encryption hardening","Audit logging & compliance docs","SLOs, monitoring & on-call setup","Incident response runbooks"]',
  '["Apps handling customer data","Products needing SOC-2 readiness","Teams with no security headcount"]',
  '1–3 weeks per audit cycle',
  'Something else', 6, true
)
ON CONFLICT (slug) DO NOTHING;