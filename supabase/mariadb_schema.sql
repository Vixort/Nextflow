-- ============================================================
-- NEXTFLOW MARIA DB SCHEMA & SEED SCRIPT (MariaDB 12.x)
-- Translation of supabase/schema.sql + migrations from
-- Postgres/Supabase to MariaDB. Idempotent — safe to re-run.
--
-- Notes vs the Postgres original:
--   * UUIDs: CHAR(36) with DEFAULT (UUID())
--   * JSONB -> JSON, TEXT[] -> JSON (db layer parses/stringifies)

-- All datetimes are UTC-naive; run in UTC so DEFAULT
-- CURRENT_TIMESTAMP writes match the app layer.
SET time_zone = '+00:00';
--   * TIMESTAMPTZ -> DATETIME(3)
--   * RLS/roles removed: the app connects as a single full-privilege
--     user (server-side access only, same trust model as service role)
--   * pg_cron jobs -> MariaDB EVENTs (requires event_scheduler=ON)
--   * rate_limit_tick / bump_token_versions -> inline SQL in lib/db/rpc
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. Users (custom auth: bcrypt hash + JWT token_version)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  email         VARCHAR(320) NOT NULL,
  username      VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255) NULL,
  avatar_url    VARCHAR(1024) NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'user',
  token_version INT          NOT NULL DEFAULT 0,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username),
  CONSTRAINT chk_users_role CHECK (role IN ('owner', 'admin', 'moderator', 'user'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Profiles (legacy compatibility — mirrors users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id         CHAR(36)     NOT NULL,
  email      VARCHAR(320) NOT NULL,
  username   VARCHAR(100) NOT NULL,
  full_name  VARCHAR(255) NULL,
  avatar_url VARCHAR(1024) NULL,
  role       VARCHAR(20)  NOT NULL DEFAULT 'user',
  created_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT chk_profiles_role CHECK (role IN ('owner', 'admin', 'moderator', 'user'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Activity logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id          CHAR(36)    NOT NULL DEFAULT (UUID()),
  user_id     CHAR(36)    NULL,
  username    VARCHAR(100) NULL,
  user_role   VARCHAR(20) NULL,
  event_type  VARCHAR(64) NOT NULL,
  action      VARCHAR(255) NOT NULL,
  description TEXT        NOT NULL,
  path        VARCHAR(1024) NULL,
  from_path   VARCHAR(1024) NULL,
  to_path     VARCHAR(1024) NULL,
  metadata    JSON        NULL,
  ip_address  VARCHAR(64) NULL,
  user_agent  TEXT        NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_activity_logs_user_id (user_id),
  KEY idx_activity_logs_event_type (event_type),
  KEY idx_activity_logs_created_at (created_at),
  CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. System settings KV (`key` is a reserved word — quoted everywhere)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
  `key`      VARCHAR(64)  NOT NULL,
  `value`    JSON         NOT NULL,
  updated_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by CHAR(36)     NULL,
  PRIMARY KEY (`key`),
  CONSTRAINT fk_system_settings_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Home sections (dynamic no-code layout builder)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS home_sections (
  id            CHAR(36)    NOT NULL DEFAULT (UUID()),
  name          VARCHAR(255) NOT NULL,
  type          VARCHAR(64) NOT NULL DEFAULT 'custom',
  section_order INT         NOT NULL DEFAULT 1,
  visible       TINYINT(1)  NOT NULL DEFAULT 1,
  is_builtin    TINYINT(1)  NOT NULL DEFAULT 0,
  custom_data   JSON        NULL,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by    CHAR(36)    NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_home_sections_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Website templates (Puck studio project JSON)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS website_templates (
  id                CHAR(36)      NOT NULL DEFAULT (UUID()),
  name              VARCHAR(255)  NOT NULL,
  description       TEXT          NULL,
  category          VARCHAR(100)  NOT NULL DEFAULT 'Landing Page',
  tags              JSON          NULL,
  thumbnail_url     VARCHAR(1024) NULL,
  puck_data         JSON          NOT NULL,
  puck_layout       JSON          NULL,
  puck_texts        JSON          NULL,
  global_css        LONGTEXT      NULL,
  render_mode       VARCHAR(16)   NOT NULL DEFAULT 'puck',
  storage_path      VARCHAR(1024) NULL,
  file_name         VARCHAR(255)  NULL,
  storage_size_bytes BIGINT       NULL,
  is_active         TINYINT(1)    NOT NULL DEFAULT 1,
  created_at        DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  created_by        CHAR(36)      NULL,
  updated_by        CHAR(36)      NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_website_templates_name (name),
  KEY idx_website_templates_updated_at (updated_at),
  KEY idx_website_templates_created_by (created_by),
  KEY idx_website_templates_updated_by (updated_by),
  CONSTRAINT fk_website_templates_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_website_templates_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT chk_website_templates_mode CHECK (render_mode IN ('puck', 'static'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6b. Template tags (selectable presets + admin-added custom tags)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS template_tags (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(40)  NOT NULL,
  group_name  VARCHAR(60)  NULL,
  is_preset   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_template_tags_name (name),
  KEY idx_template_tags_preset (is_preset)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Inquiries (contact form submissions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id            CHAR(36)      NOT NULL DEFAULT (UUID()),
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(320)  NOT NULL,
  phone         VARCHAR(64)   NULL,
  service_type  VARCHAR(100)  NOT NULL,
  business_type VARCHAR(100)  NULL,
  budget        VARCHAR(100)  NULL,
  channel       VARCHAR(64)   NULL,
  message       TEXT          NULL,
  source        VARCHAR(64)   NOT NULL DEFAULT 'contact-page',
  status        VARCHAR(32)   NOT NULL DEFAULT 'new',
  created_at    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_inquiries_created_at (created_at),
  KEY idx_inquiries_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. AI provider API keys (metadata only — key_value stored here
--    plaintext; Supabase Vault has no MariaDB equivalent)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_api_keys (
  id         CHAR(36)      NOT NULL DEFAULT (UUID()),
  provider   VARCHAR(32)   NOT NULL,
  label      VARCHAR(255)  NOT NULL DEFAULT '',
  key_value  TEXT          NOT NULL,
  position   INT           NOT NULL DEFAULT 0,
  enabled    TINYINT(1)    NOT NULL DEFAULT 1,
  model      VARCHAR(128)  NULL,
  base_url   VARCHAR(1024) NULL,
  created_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_ai_api_keys_provider_pos (provider, position),
  CONSTRAINT chk_ai_api_keys_provider CHECK (provider IN ('gemini', 'openrouter', 'openai', 'groq', 'custom'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. AI chat logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id                CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id           CHAR(36)     NULL,
  username          VARCHAR(100) NULL,
  path              VARCHAR(1024) NULL,
  provider          VARCHAR(32)  NOT NULL,
  model             VARCHAR(128) NOT NULL,
  mode              VARCHAR(32)  NULL,
  prompt            LONGTEXT     NULL,
  response          LONGTEXT     NULL,
  prompt_tokens     INT          NULL,
  completion_tokens INT          NULL,
  ip_address        VARCHAR(64)  NULL,
  user_agent        TEXT         NULL,
  duration_ms       INT          NULL,
  `error`           TEXT         NULL,
  created_at        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_ai_chat_logs_created_at (created_at),
  KEY idx_ai_chat_logs_user_id (user_id),
  KEY idx_ai_chat_logs_provider (provider),
  CONSTRAINT fk_ai_chat_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. Contact sessions (per-form-session interaction trail)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_sessions (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  session_key   VARCHAR(128) NOT NULL,
  inquiry_id    CHAR(36)     NULL,
  events        JSON         NOT NULL,
  name          VARCHAR(255) NULL,
  email         VARCHAR(320) NULL,
  phone         VARCHAR(64)  NULL,
  service_type  VARCHAR(100) NULL,
  business_type VARCHAR(100) NULL,
  budget        VARCHAR(100) NULL,
  channel       VARCHAR(64)  NULL,
  message       TEXT         NULL,
  started_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  submitted_at  DATETIME(3)  NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_contact_sessions_session_key (session_key),
  KEY idx_contact_sessions_started_at (started_at),
  KEY idx_contact_sessions_inquiry_id (inquiry_id),
  CONSTRAINT fk_contact_sessions_inquiry FOREIGN KEY (inquiry_id) REFERENCES inquiries (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. Auth lockouts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_lockouts (
  lock_key      VARCHAR(255) NOT NULL,
  failed_count  INT          NOT NULL DEFAULT 0,
  locked_until  DATETIME(3)  NULL,
  last_fail_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (lock_key)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. Rate limits (sliding-window counters)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rate_limits (
  fingerprint  VARCHAR(128) NOT NULL,
  endpoint     VARCHAR(255) NOT NULL,
  window_start DATETIME(3)  NOT NULL,
  `count`      INT          NOT NULL DEFAULT 1,
  PRIMARY KEY (fingerprint, endpoint, window_start)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. Services catalog
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id              CHAR(36)      NOT NULL DEFAULT (UUID()),
  title           VARCHAR(255)  NOT NULL,
  slug            VARCHAR(255)  NOT NULL,
  icon            VARCHAR(64)   NOT NULL DEFAULT 'Globe',
  color           VARCHAR(64)   NOT NULL DEFAULT 'from-cyan-400 to-blue-600',
  description     TEXT          NOT NULL,
  features        JSON          NOT NULL,
  outcome         TEXT          NOT NULL,
  deliverables    JSON          NOT NULL,
  best_for        JSON          NOT NULL,
  timeline        VARCHAR(255)  NOT NULL DEFAULT '',
  contact_service VARCHAR(100)  NOT NULL DEFAULT 'Something else',
  sort_order      INT           NOT NULL DEFAULT 0,
  is_active       TINYINT(1)    NOT NULL DEFAULT 1,
  created_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_slug (slug),
  KEY idx_services_sort (sort_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- updated_at triggers (users, website_templates — matches prod;
-- services/ai_api_keys set updated_at in app code)
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_users_updated_at;
DELIMITER $$
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP(3);
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_website_templates_updated_at;
DELIMITER $$
CREATE TRIGGER trg_website_templates_updated_at
BEFORE UPDATE ON website_templates
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP(3);
END$$
DELIMITER ;

-- ------------------------------------------------------------
-- Cleanup events (replaces pg_cron jobs)
-- ------------------------------------------------------------
DROP EVENT IF EXISTS contact_session_cleanup;
DELIMITER $$
CREATE EVENT contact_session_cleanup
ON SCHEDULE EVERY 1 DAY STARTS '2026-01-01 03:00:00'
DO
BEGIN
  SET @retention_days = COALESCE(
    (SELECT CAST(JSON_UNQUOTE(JSON_EXTRACT(`value`, '$.retention_days')) AS SIGNED)
       FROM system_settings WHERE `key` = 'contact'),
    15
  );
  DELETE FROM contact_sessions
   WHERE submitted_at IS NOT NULL AND submitted_at < UTC_TIMESTAMP(3) - INTERVAL @retention_days DAY;
END$$
DELIMITER ;

DROP EVENT IF EXISTS rate_limit_cleanup;
DELIMITER $$
CREATE EVENT rate_limit_cleanup
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  DELETE FROM rate_limits WHERE window_start < UTC_TIMESTAMP(3) - INTERVAL 2 HOUR;
END$$
DELIMITER ;

DROP EVENT IF EXISTS lockout_cleanup;
DELIMITER $$
CREATE EVENT lockout_cleanup
ON SCHEDULE EVERY 1 HOUR STARTS '2026-01-01 00:15:00'
DO
BEGIN
  DELETE FROM auth_lockouts
   WHERE (locked_until IS NULL OR locked_until < UTC_TIMESTAMP(3) - INTERVAL 1 DAY)
     AND last_fail_at < UTC_TIMESTAMP(3) - INTERVAL 1 DAY;
END$$
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- SEED DATA
-- ------------------------------------------------------------

-- Admin user. The password hash is a placeholder; run
-- `node scripts/seed-admin.mjs` to set the real admin123 hash.
INSERT INTO users (id, email, username, password_hash, full_name, role)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@nextflow.com',
  'admin',
  '$2a$10$eE0m7aGzY8kX5M4f4cZ0u.qW5g1.G8K7n4V6l3b2A1c0D9e8F7g6h',
  'System Owner',
  'owner'
)
ON DUPLICATE KEY UPDATE role = 'owner';

-- System settings (keys match lib/auth/securitySettings.ts defaults).
INSERT INTO system_settings (`key`, `value`) VALUES
  ('general',   JSON_OBJECT('platform_name', 'NEXTFLOW', 'support_email', 'support@nextflow.dev', 'maintenance_mode', FALSE, 'maintenance_message', '', 'public_registration', TRUE)),
  ('security',  JSON_OBJECT('session_timeout_days', 7, 'max_login_attempts', 5, 'lockout_minutes', 15)),
  ('traffic',   JSON_OBJECT('rate_limit_enabled', TRUE, 'rate_limit_per_min', 60, 'payload_limit_mb', 1)),
  ('ai',        JSON_OBJECT('enabled', TRUE, 'contact_enabled', TRUE, 'require_login', TRUE, 'contact_key_id', NULL,
                 'prompts', JSON_OBJECT('template_filter', NULL, 'template_pick', NULL, 'template_build', NULL, 'static_copy', NULL, 'contact_expand', NULL))),
  ('contact',   JSON_OBJECT('enabled', TRUE, 'retention_days', 15,
                 'content', JSON_OBJECT('heading', 'Tell us what you need.', 'heading_accent', 'We''ll do the rest.',
                   'intro', 'A few quick choices — no long forms, no hassle. Every inquiry goes straight to our engineering inbox.',
                   'success_title', 'Message received!',
                   'success_text', 'Thanks {name} — we''ve got your {service} inquiry and will get back to you within 1–2 business days.',
                   'closed_title', 'We''re not accepting new inquiries right now',
                   'closed_text', 'We''ll be back soon — please check again later. You can still email us directly at support@nextflow.dev.',
                   'submit_label', 'Send inquiry', 'show_phone', TRUE, 'show_message', TRUE,
                   'services', JSON_ARRAY('Web Platform', 'SaaS Architecture', 'Mobile Application', 'Event Technology', 'AI & Workflow', 'Something else'),
                   'business_types', JSON_ARRAY('Company', 'Startup', 'Agency', 'Freelancer', 'Student', 'Personal'),
                   'budgets', JSON_ARRAY('Under ฿50K', '฿50K – ฿200K', '฿200K – ฿1M', '฿1M+', 'Not sure yet'),
                   'channels', JSON_ARRAY('Email', 'Phone', 'WhatsApp'))))
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Home sections (builtin).
INSERT INTO home_sections (id, name, type, section_order, visible, is_builtin) VALUES
  ('hero',           'Cinematic Hero Banner',              'builtin', 1, TRUE, TRUE),
  ('social_proof',   'Social Proof & Trusted Logos',       'builtin', 2, TRUE, TRUE),
  ('value_prop',     'Value Proposition Bento Grid',       'builtin', 3, TRUE, TRUE),
  ('why_us',         'Why Us (Problem vs Solution)',       'builtin', 4, TRUE, TRUE),
  ('services',       'Services & Capabilities',            'builtin', 5, TRUE, TRUE),
  ('portfolio',      'Portfolio & Case Studies',           'builtin', 6, TRUE, TRUE),
  ('final_cta',      'Final Conversion CTA Banner',        'builtin', 7, TRUE, TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Services (six existing catalog entries).
INSERT INTO services (title, slug, icon, color, description, features, outcome, deliverables, best_for, timeline, contact_service, sort_order, is_active) VALUES
(
  'Custom Web Platforms', 'custom-web-platforms', 'Globe', 'from-cyan-400 to-blue-600',
  'Awwwards-grade websites and full-scale web platforms built with modern frameworks. Blazing-fast, SEO-optimized, and engineered to scale from launch day.',
  JSON_ARRAY('Enterprise Next.js apps','High-performance front-ends','Headless CMS & e-commerce'),
  'A production-grade web platform your team can actually grow with — fast, SEO-ready, and easy to extend without rewriting everything in a year.',
  JSON_ARRAY('Pixel-perfect responsive web app','SEO + Core Web Vitals optimization','Content management (headless CMS)','Analytics & conversion tracking','Design system + component library','Deployment, CI/CD & documentation'),
  JSON_ARRAY('Companies outgrowing template sites','Startups needing a launch-ready product','Brands that need a standout web presence'),
  '3–8 weeks for a full platform', 'Web Platform', 1, TRUE
),
(
  'SaaS & Cloud Architecture', 'saas-cloud-architecture', 'Boxes', 'from-purple-400 to-indigo-600',
  'We design resilient, multi-tenant SaaS products — from data modeling and auth to billing, observability, and infrastructure that holds under real load.',
  JSON_ARRAY('Multi-tenant backends','Cloud infrastructure (AWS/GCP)','CI/CD & observability'),
  'A backend that stays fast and reliable as you onboard new customers — without the “works on my machine” surprises or surprise cloud bills.',
  JSON_ARRAY('Multi-tenant data architecture','Auth, roles & billing integration','Scalable cloud infrastructure (AWS/GCP)','CI/CD pipelines & automated testing','Observability: logs, metrics, alerts','Cost monitoring & optimization'),
  JSON_ARRAY('SaaS founders on an MVP or v2','Products about to scale users','Teams drowning in tech debt'),
  '4–12 weeks depending on scope', 'SaaS Architecture', 2, TRUE
),
(
  'Mobile Applications', 'mobile-applications', 'Smartphone', 'from-emerald-400 to-teal-600',
  'Native and cross-platform mobile apps with a mobile-first philosophy. Seamless UX, offline support, and app-store-ready quality.',
  JSON_ARRAY('iOS & Android','React Native / Flutter','Push, payments & offline'),
  'An app your users install and keep — smooth on slow networks, offline-capable, and polished enough for the App Store review gauntlet.',
  JSON_ARRAY('iOS & Android app (single codebase)','Push notifications & deep links','In-app payments / subscriptions','Offline-first data sync','App Store / Play Store submission','Crash monitoring & updates'),
  JSON_ARRAY('Businesses reaching customers on phones','Field teams needing offline tools','Startups shipping a companion app'),
  '6–12 weeks for v1', 'Mobile Application', 3, TRUE
),
(
  'Event Technology', 'event-technology', 'Cpu', 'from-orange-400 to-pink-600',
  'Hardware and software integration for events — interactive booths, live IoT, real-time telemetry, and immersive digital orchestration.',
  JSON_ARRAY('Interactive booths & kiosks','Live IoT & sensors','Real-time dashboards'),
  'An event experience that runs itself: interactive touchpoints, live data flowing to screens and dashboards, and zero “can you fix the projector” drama.',
  JSON_ARRAY('Interactive booth & kiosk software','IoT sensor & device integration','Real-time dashboards & telemetry','Live content orchestration','On-site support & dry-run','Post-event analytics report'),
  JSON_ARRAY('Event agencies going digital','Venues upgrading their tech','Brands doing interactive activations'),
  '2–6 weeks before the event', 'Event Technology', 4, TRUE
),
(
  'Bespoke Software Projects', 'bespoke-software-projects', 'Rocket', 'from-sky-400 to-cyan-600',
  'Custom platforms, internal tools, and complex integrations. We turn unique operational challenges into streamlined digital solutions that scale.',
  JSON_ARRAY('Internal tools & portals','System integrations','Legacy modernization'),
  'A custom tool built around how your team actually works — killing the spreadsheet chaos and manual handoffs that slow everyone down.',
  JSON_ARRAY('Custom internal tools & portals','Third-party system integrations','Legacy system modernization','Automated workflows & reports','Training & handover sessions','Maintenance & support retainer'),
  JSON_ARRAY('Operations with manual workflows','Teams stuck on legacy systems','Businesses needing unique tooling'),
  'Scoped per project — 3 weeks typical starting point', 'Something else', 5, TRUE
),
(
  'Security & Reliability', 'security-reliability', 'ShieldCheck', 'from-amber-400 to-red-600',
  'Security is not an afterthought. We build SOC-2-minded systems with audit trails, encrypted data, RBAC, and reliability baked into the architecture.',
  JSON_ARRAY('Security audits','RBAC & encryption','SLOs & uptime guarantees'),
  'Peace of mind: your system is hardened against the attacks that actually happen, with audit trails and uptime you can put in front of clients.',
  JSON_ARRAY('Full security audit & report','Penetration test & remediation','RBAC & encryption hardening','Audit logging & compliance docs','SLOs, monitoring & on-call setup','Incident response runbooks'),
  JSON_ARRAY('Apps handling customer data','Products needing SOC-2 readiness','Teams with no security headcount'),
  '1–3 weeks per audit cycle', 'Something else', 6, TRUE
)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ------------------------------------------------------------
-- Verify
-- ------------------------------------------------------------
-- SELECT COUNT(*) FROM services;          -- expect 6
-- SELECT COUNT(*) FROM system_settings;   -- expect 5
-- SELECT COUNT(*) FROM home_sections;     -- expect 7
-- SHOW EVENTS;                            -- expect 3 active
