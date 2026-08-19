# TodoList — Services DB + Learn More System (COMPLETE)

## Success
- [x] สำรวจโครงสร้าง admin settings / contact settings เดิม (ใช้เป็นต้นแบบ) — ใช้ pattern ของ contact settings (`system_settings` KV + `/api/contact/settings`)
- [x] ออกแบบตาราง DB: `services` (รวม fields Learn More ไว้ในตารางเดียว — ไม่แยก service_details): id, title, slug (unique), icon, color, description, features[], outcome, deliverables[], best_for[], timeline, contact_service, sort_order, is_active, timestamps + RLS (admin only)
- [x] Migration + apply + sync `supabase/schema.sql` + `types/supabase.ts` (Insert type = `Omit<Service,'id'|'created_at'|'updated_at'>`)
- [x] Seed 6 services (slugs: custom-web-platforms, saas-cloud-architecture, mobile-applications, event-technology, bespoke-software-projects, security-reliability)
- [x] API: public GET (`/api/services` + `?slug=`, active only, 404 ถ้าไม่เจอ) + admin CRUD (`/api/admin/services` — GET รวม inactive / POST / PATCH?id= / DELETE?id=, admin-gated, zod validate (contact_service ต้องอยู่ใน SERVICE_TYPES), slug-unique check, logActivity SERVICE_CREATE/UPDATE/DELETE)
- [x] Data layer: `lib/services/catalog.ts` (getServices/getServiceBySlug/getServiceById/create/update/delete + slugify) + `lib/services/icons.ts` (SERVICE_ICONS map + SERVICE_COLORS ใช้ทั้งหน้าเว็บและ admin)
- [x] Admin UI: แท็บ Services ใน admin — `components/admin/ServicesTab.tsx` (grid การ์ด LIVE/HIDDEN badge + link ดูหน้า; editor full-form: title, slug + auto-gen, icon/color dropdown, description, features/deliverables/best_for list editor, outcome, timeline, contact_service select, sort_order, is_active toggle; delete พร้อม confirm) — เพิ่ม/แก้ไข/ลบ service + แก้ไขรายละเอียด Learn More ได้ครบทุก field
- [x] หน้า service: ดึงข้อมูลจาก DB (แทน hardcode) — `/services` server component (grid ใหม่: gradient icon, glow, ตัวเลข, checklist, CTA → Link) + process section + CTA
- [x] หน้า detail แยก (`/services/[slug]`) แทน modal — server component, generateMetadata, hero, outcome, deliverables, best_for, timeline, features, CTA → `/contact?service=<contact_service>` (ContactForm prefill)
- [x] ลบ `ServiceDetailSheet` (modal เก่า)
- [x] ปรับปรุง layout หน้า services ให้ทันสมัย
- [x] build ✅ lint 428 (ดีกว่า baseline 431 และ HEAD 430)
- [x] ทดสอบจริงผ่านหมด: CRUD ครบ (create→patch partial merge→delete), 409 slug dup, 400 bad enum, 403 ไม่มีสิทธิ์, `/services/[slug]` 200/404, CTA prefill ใช้ได้, ทุกหน้า 200 (services/detail/contact/templates/admin/settings/login/register)

## Fixes & Bugs ที่แก้แล้ว (verified ทุกข้อ)
- [x] `updateSchema = serviceSchema.partial()` ยัง inject `.default()` เข้า fields ที่ client ไม่ส่ง (icon/color โดน reset) → สร้าง updateSchema แยก (ทุก field optional, ไม่มี defaults) — **verified**: PATCH แก้ title ล้วน ไม่กระทบ icon/color/sort/active/outcome/contact ✅ / ส่ง icon+color+is_active → อัปเดตจริง ✅ / 400 bad enum ✅ / 409 slug dup ✅ / ล้างข้อมูลกลับ 6 ✅
- [x] `/contact` prerender พัง: `useSearchParams()` ไม่มี Suspense → wrap `<Suspense fallback={null}>` ใน `app/contact/page.tsx` — **verified**: /contact 200 ✅
- [x] `<motion.span>` ใช้ใน server component → 500 → เปลี่ยนเป็น `Reveal` (client component) — **verified**: ไม่มี framer-motion ใน `app/services/page.tsx` + /services 200 ✅
- [x] types/supabase.ts: `channel: string | null  message: ...` merge กัน (missing newline) → แก้ — **verified**: syntax ปกติ, build ผ่าน ✅
- [x] no-html-link-for-pages จับ `<a href="/services">` ใน PuckTemplateStudio (8) + puckConfig (9) หลังมี route `/services` จริง → เปลี่ยนเป็น `<Link>` หมด (รวม `<a href="/">` ใน puckConfig อีก 1) — **verified**: `rg '<a href="/services'` ทั่วโปรเจค = 0 (นอก todolist.md) ✅
- [x] `react-hooks/set-state-in-effect` จับ `setMounted(true)` sync ใน effect (PuckTemplateStudio) → ใช้ setTimeout(0); ServicesTab ใช้ async load pattern + cancelled flag — **verified**: eslint ServicesTab + PuckTemplateStudio + puckConfig = 0 error ✅
- [x] puckConfig:4254 `{label} // {scanCode}` → `{label}{' // '}{scanCode}` (jsx-no-comment-textnodes) — **verified**: lint ลงจาก 429 → 428 ✅
- [x] dev server ตายบ่อย: `next build` เขียน .next ทับ dev → restart; pkill ต้องรวม `next-server` ด้วย — **verified**: restart ผ่าน `setsid bash -c 'npm run dev > /tmp/opencode/dev2.log 2>&1' & disown` + `pkill -9 -f next-server`
---

# TodoList — MariaDB Migration Plan (branch: `mariadb-mysql`)

> เป้าหมาย: เปลี่ยนฐานข้อมูลจาก Supabase (Postgres + PostgREST) → MariaDB (local, root ไม่มี password) โดยแอปทำงานเหมือนเดิมทุกอย่าง
> สถานะปัจจุบัน: **ทุก phase เสร็จแล้ว (P1–P7)** — ระบบรันบน MariaDB เต็มรูปแบบ, `@supabase/*` ถอดออกแล้ว, test ทั้งหมดผ่าน

## 1. ข้อเท็จจริงจากการสำรวจ (scope จริง)

- 39 ไฟล์ใช้ Supabase client (`createAdminClient` หลัก), ~99 query calls, query surface ที่ใช้จริง:
  `select(62) eq(44) single(24) maybeSingle(15) delete(13) order(11) insert(9) update(8) upsert(7) limit(5) in(3) gte(3) neq(2) contains(1)`
- `rpc()` มีแค่ 2 ตัว: `rate_limit_tick` (middleware rate limiter), `bump_token_versions` (admin force re-login)
- **จุดสถาปัตยกรรมสำคัญ**: Next.js 16 deprecate `middleware.ts` (edge runtime — mysql2 ใช้ไม่ได้) → ต้องย้ายเป็น **`proxy.ts` (Node.js runtime)** ตาม docs `node_modules/next/dist/docs/.../version-16.md:612`
- Storage (Supabase Storage, ไม่ใช่ DB): `template-assets` 23 ไฟล์ (template import/static serve), `avatars` 0 ไฟล์ — แยก abstraction
- โค้ด auth เป็น custom หมดแล้ว (bcrypt+jose+users table) — Supabase Auth หลงเหลือแค่ `app/api/auth/callback/route.ts` + `lib/supabase/server.ts` + health check (dead code)

## 2. ไฟล์ใหม่ที่จะสร้าง

| ไฟล์ | หน้าที่ |
|---|---|
| `lib/db/client.ts` | mysql2 promise pool (singleton) + `db` object API เข้ากันได้กับ supabase-js ที่ใช้จริง (`from().select/eq/in/order/limit/single/maybeSingle/insert/update/upsert/delete/gte/neq/contains`) — auto JSON parse, auto UUID ถ้า insert ไม่ส่ง id |
| `lib/db/rpc.ts` | `rate_limit_tick` + `bump_token_versions` (stored procedure / inline SQL) |
| `lib/db/types.ts` | re-export `isAdminLevel` + row types ที่โค้ดใช้ (ย้ายจาก types/supabase.ts ถ้าจำเป็น) |
| `lib/storage/index.ts` | `getStorage()` — เลือก driver ตาม `STORAGE_DRIVER` (local | supabase) |
| `lib/storage/local.ts` | fs-based storage (`storage/template-assets/`, `storage/avatars/`) — upload/download/remove |
| `supabase/mariadb_schema.sql` | DDL แปลงเต็ม + seed (ดูข้อ 4) |
| `scripts/init-mariadb.sh` | สร้าง DB + user + รัน schema (`mysql < supabase/mariadb_schema.sql`) |
| `scripts/seed-admin.mjs` | เขียนใหม่ด้วย mysql2 (แทน @supabase/supabase-js) |
| `proxy.ts` | แทนที่ `middleware.ts` (rename + nodejs runtime, matcher เดิม) |

## 3. ไฟล์ที่ต้องแก้ไข (41 ไฟล์)

### ชั้น DB core
- [ ] `lib/supabase/admin.ts` → **แทนที่**ด้วย re-export จาก `lib/db/client.ts` (จุดเดียวที่ import ทุกไฟล์ — สลับ backend ทั้งระบบโดยไม่แตะ logic)
- [ ] `lib/supabase/server.ts` → **ลบ** (supabase auth dead code — ใช้แค่ health + auth/callback)
- [ ] `lib/supabase/client.ts` (browser) → **ลบ** (ไม่มีใคร import — ตรวจ `rg` แล้ว)
- [ ] `lib/supabase/middleware.ts` → **ลบ** (updateSession ไม่ถูกใช้ — middleware ใช้ custom auth)
- [ ] `middleware.ts` → **rename เป็น `proxy.ts`** + `export function proxy(...)` + nodejs runtime (edge ใช้ mysql2 ไม่ได้)
- [ ] `lib/env.ts` → เพิ่ม: `DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, STORAGE_DRIVER` (แทน NEXT_PUBLIC_SUPABASE_*) — `SUPABASE_*` เหลือเฉพาะกรณี `STORAGE_DRIVER=supabase`
- [ ] `package.json` → เพิ่ม `mysql2`, ถอด `@supabase/supabase-js`, `@supabase/ssr` (หลังทุกอย่างย้ายเสร็จ)
- [ ] `types/supabase.ts` → คง Row types + `isAdminLevel`; ตรวจ `Database` generic ที่อ้างอิง (สร้างแค่ type เดียวกันใน lib/db)

### lib/ (ย้าย import `createAdminClient` → `lib/db`)
- [ ] `lib/activity.ts`
- [ ] `lib/auth/jwt.ts` (`isTokenVersionValid` — users select)
- [ ] `lib/auth/lockout.ts` (auth_lockouts upsert/delete)
- [ ] `lib/auth/securitySettings.ts` (system_settings)
- [ ] `lib/contact/settings.ts` (system_settings + contact_sessions upsert/select)
- [ ] `lib/settings/runtime.ts` (system_settings — ใช้ใน proxy)
- [ ] `lib/middleware/distributedRateLimiter.ts` (`rpc('rate_limit_tick')` → lib/db/rpc)
- [ ] `lib/services/catalog.ts` (services CRUD)
- [ ] `lib/services/profileService.ts` (profiles — dead แต่ย้ายให้ครบ)
- [ ] `lib/ai/settings.ts` (ai_api_keys + system_settings 'ai' + vault → **vault ไม่อยู่ใน MariaDB** — key เก็บในตารางตามเดิม (plaintext) หรือรอ app-layer encryption แยกงาน)
- [ ] `lib/ai/build.ts` (website_templates select)
- [ ] `lib/ai/run.ts` (ai_chat_logs insert)
- [ ] `lib/actions/authActions.ts` (register/me)

### app/api/ (ย้าย import เดียวกัน)
- [ ] `app/api/activity/route.ts`
- [ ] `app/api/ai-chat/route.ts`
- [ ] `app/api/auth/login/route.ts`
- [ ] `app/api/auth/register/route.ts`
- [ ] `app/api/auth/me/route.ts`
- [ ] `app/api/auth/callback/route.ts` → **ลบ** (Supabase OAuth dead code)
- [ ] `app/api/contact/route.ts`
- [ ] `app/api/contact/track/route.ts`
- [ ] `app/api/health/route.ts` → เขียนใหม่: `SELECT 1` ผ่าน lib/db (แทน supabase.auth.getSession)
- [ ] `app/api/templates/route.ts`
- [ ] `app/api/templates/[id]/route.ts`
- [ ] `app/api/templates/[id]/static/[...path]/route.ts` → ใช้ `lib/storage` (download → local fs)
- [ ] `app/api/admin/ai/route.ts`
- [ ] `app/api/admin/contact/route.ts`
- [ ] `app/api/admin/dashboard/route.ts`
- [ ] `app/api/admin/sections/route.ts`
- [ ] `app/api/admin/services/route.ts`
- [ ] `app/api/admin/settings/route.ts` (`rpc('bump_token_versions')` → lib/db/rpc)
- [ ] `app/api/admin/templates/route.ts`
- [ ] `app/api/admin/templates/[id]/route.ts` (storage remove)
- [ ] `app/api/admin/templates/import/route.ts` (storage upload/remove)
- [ ] `app/api/admin/users/[id]/route.ts`

### app/admin/
- [ ] `app/admin/layout.tsx`, `app/admin/page.tsx` (ส่วนใหญ่ผ่าน API route — ตรวจ import `createAdminClient` โดยตรง)

### Supabase-specific SQL → MariaDB
- [ ] `supabase/schema.sql` + `supabase/migrations/*` → **translate เป็น `supabase/mariadb_schema.sql`** (ไฟล์ใหม่ เก็บต้นฉบับไว้)
- [ ] `scripts/seed-admin.js` → เขียนใหม่ `scripts/seed-admin.mjs` (mysql2)

## 4. แผนการแปล schema (Postgres → MariaDB)

| Postgres | MariaDB | หมายเหตุ |
|---|---|---|
| `UUID DEFAULT gen_random_uuid()` | `CHAR(36) DEFAULT (UUID())` | หรือ app layer `crypto.randomUUID()` — db layer เติมให้อัตโนมัติถ้าไม่มี id |
| `TEXT[]` (tags) | `JSON` | `.contains()` → `JSON_CONTAINS` หรือ filter ใน JS |
| `JSONB` (puck_data, features, metadata...) | `JSON` (alias LONGTEXT + JSON_VALID) | db layer auto `JSON.parse` ตอน read, `JSON.stringify` ตอน write |
| `TIMESTAMPTZ` | `DATETIME(3)` | mysql2 แปลง Date อัตโนมัติ |
| RLS + REVOKE anon/authenticated | **ไม่มี RLS ใน MariaDB** | ความปลอดภัย = แอปเชื่อมด้วย user เดียว full-privilege (server-side only เหมือนเดิม) — ต้องบันทึกในเอกสาร |
| `CREATE TRIGGER ... EXECUTE FUNCTION` | `CREATE TRIGGER ... SET NEW.updated_at = NOW()` | users + website_templates |
| `rate_limit_tick()` plpgsql | stored procedure หรือ inline SQL ใน lib/db/rpc | `INSERT ... ON DUPLICATE KEY UPDATE count = count+1` + cleanup |
| `bump_token_versions()` plpgsql | `UPDATE users SET token_version = token_version + 1` (inline) | |
| `pg_cron` 3 jobs | `CREATE EVENT` (MariaDB event scheduler) | contact-session-cleanup / rate-limit-cleanup / lockout-cleanup |
| `ON CONFLICT (slug) DO NOTHING` | `INSERT IGNORE` / `ON DUPLICATE KEY UPDATE` | services seed + users seed |
| `cron.unschedule/schedule` | `DROP EVENT IF EXISTS` + `CREATE EVENT` | |
| `vault` (ai keys) | **ไม่มี** — `key_value` เก็บตามเดิม (plaintext) | งานแยก: app-layer encryption / KMS (ไม่ใช่ scope นี้) |

## 5. ขั้นตอนการทำ (phases)

- [x] **P1 — ฐานราก**: สร้าง `supabase/mariadb_schema.sql` → รัน `scripts/init-mariadb.sh` → ต่อ `mysql` ได้ → seed admin ผ่าน `scripts/seed-admin.mjs` (13 ตาราง + 3 events + triggers)
- [x] **P2 — db layer**: `lib/db/client.ts` + `lib/db/rpc.ts` → เปลี่ยน `lib/supabase/admin.ts` เป็น re-export → ทดสอบด้วย `lib/services/catalog.ts` (CRUD จริงบน MariaDB) — test-db-layer + test-catalog ALL PASS
- [x] **P3 — lib/ ทั้งหมด**: ย้าย 13 ไฟล์ใน lib/ + เพิ่ม query surface ที่ใช้จริง (`or/lt/not/count-exact`) + `DbResult` แบบ discriminated union (narrowing เหมือน supabase-js) → tsc 0 error
- [x] **P4 — app/api ทั้งหมด**: ย้าย 20 ไฟล์ + ลบ `auth/callback` + เขียน `health` ใหม่ (SELECT ผ่าน lib/db) → ทดสอบ endpoint หลัก (login/register/dashboard/settings/sections/services/contact/track/ai/activity)
- [x] **P5 — middleware→proxy**: `proxy.ts` (Next 16, nodejs runtime) + rate limiter ผ่าน lib/db → 429/503 ทำงาน — แก้ client-bundle leak: `slugify` ย้ายไป `lib/utils/slugify.ts` (ServicesTab ไม่ลาก mysql2 เข้า browser)
- [x] **P6 — storage local**: `lib/storage/` (local driver — upload/download/remove + path traversal guard) + ย้าย template import/static serve
- [x] **P7 — ล้างของเก่า**: ถอด `@supabase/*` ออกจาก package.json, ลบ `lib/supabase/` ทั้งหมด + storage supabase driver + legacy seed scripts, อัปเดต `.env.example` + AGENTS.md → `npm run build` ผ่าน + full test

### บั๊กที่เจอและแก้ระหว่างทาง (verified)
- [x] `insert().select().single()` คืนแถวแรกของตารางแทนแถวใหม่ — `.single()/.maybeSingle()` ไม่ respect writeOp → delegate ไป `execute()` (reg2 test: insert→select→delete ผ่าน)
- [x] `new Date().toISOString()` (string แบบ `Z`) ลง datetime column → MariaDB error 1292 → `toSqlValue` แปลง ISO-8601 string → UTC-naive อัตโนมัติ
- [x] `rate_limit_tick` วนซ้ำไม่ได้ 1→1 — ตัว prune `DELETE ... NOW()-2h` เทียบ local time vs UTC datetimes (race ของ `SET time_zone` fire-and-forget บน connection ใหม่) → `withConnection` รัน SET แบบ await ก่อนทุก rpc; test ใช้ window ล่าสุด (< 2h) แทน fixed 03:00
- [x] mysql2 ถูกดึงเข้า client bundle (ServicesTab ← catalog.ts) → แยก `slugify` เป็น pure util

## 6. Checklist ทดสอบ (หลังทุก phase)

- [ ] `mysql -u root nextflow < supabase/mariadb_schema.sql` ทำงานซ้ำได้ (idempotent)
- [ ] login/register (bcrypt + JWT + token_version) ผ่าน
- [ ] `/services` + `/services/[slug]` + admin Services CRUD (JSON fields วนกลับถูก)
- [ ] contact form + contact_sessions + inquiries + admin contact
- [ ] AI chat (ai_api_keys + ai_chat_logs + system_settings 'ai')
- [ ] admin settings: maintenance 503 / rate limit 429 / payload 413 / force re-login (bump_token_versions)
- [ ] template: import ZIP → static serve → edit → delete (storage local)
- [ ] events scheduler: `SHOW EVENTS` มี 3 ตัว active
- [ ] `npm run lint` + `npm run build` ผ่าน
- [ ] env ใหม่ใน `.env.local` (DB_HOST=127.0.0.1, DB_USER=root, DB_PASSWORD='', DB_NAME=nextflow)

## 7. หมายเหตุ / ความเสี่ยง

- **RLS หายไป** — ต้องชัดเจนว่า security model เปลี่ยน (single-user DB, server-side only) — ยังปลอดภัยกว่า Supabase (anon/authenticated revoke แล้ว) แต่ถ้า DB user รั่ว = เข้าถึงทุกตาราง
- **`proxy.ts`** เป็นการย้ายตาม deprecation ของ Next 16 — ต้องทดสอบ middleware behaviors (matcher, 503 page, rate limit) ให้ครบ เพราะ runtime เปลี่ยน edge→nodejs
- **JSON คอลัมน์** — mysql2 คืน string → db layer ต้อง parse ให้ทุกจุด (features/deliverables/puck_data/metadata)
- **UUID**: ตอน insert ไม่ส่ง id ต้องมี DEFAULT หรือ layer เติม — เลือก layer เติม (ทำงานเหมือน gen_random_uuid)
- **`ai_api_keys.key_value`** ยัง plaintext (vault ไม่มีใน MariaDB) — pending งานแยก
- ขั้นตอนนี้ทำงานบน branch `mariadb-mysql` เท่านั้น — main ไม่ถูกแตะ
