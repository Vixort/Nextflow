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