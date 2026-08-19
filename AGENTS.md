<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack & commands
- Next.js 16.3.0 + React 19, TypeScript (strict), Tailwind v4 (CSS-driven theme in `app/globals.css` — no `tailwind.config`), shadcn/ui (`components.json` style `base-nova`).
- Path alias `@/*` → repo root (`tsconfig.json`).
- Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint` (eslint, no arg). There is **no test framework** — verify with `npm run lint` and `npm run build`.

## Auth is custom — NOT Supabase Auth
- **Do not use `supabase.auth`.** Auth is custom: `bcryptjs` password hashing + `jose` JWT signed HS256, stored in an httpOnly `token` cookie (see `app/api/auth/login/route.ts`, `lib/auth/password.ts`, `lib/auth/jwt.ts`).
- Server routes authenticate via `getAuthSession(request)` (`lib/auth/jwt.ts:33`), which accepts a `Bearer` header or the `token` cookie.

## Database is local MariaDB (this branch) — NOT Supabase
- The whole stack runs on **MariaDB** (see `supabase/mariadb_schema.sql`, applied via `scripts/init-mariadb.sh`; seed = `scripts/seed-admin.mjs`). No `@supabase/*` packages are installed.
- Data access goes through `lib/db/client.ts` — a supabase-js-compatible query builder over `mysql2` (`createAdminClient()` from `@/lib/db/client`). JSON columns are auto stringified on write and parsed on read; datetimes are stored as UTC-naive `YYYY-MM-DD HH:MM:SS.SSS`.
- Env is validated by `lib/env.ts`; required: `JWT_SECRET` (fallback hardcoded dev secret if absent), `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` (local defaults in `scripts/init-mariadb.sh`).
- Static template assets use the local storage driver `lib/storage/` (`./storage/`, gitignored).
- Next 16: network boundary is `proxy.ts` (NOT `middleware.ts`), Node.js runtime — DB-backed checks run there.

## Conventions & gotchas
- `proxy.ts` (Next 16, Node.js runtime — replaces the deprecated `middleware.ts`) enforces a **1MB payload limit** on POST/PUT/PATCH `/api` routes and **distributed rate limiting (60 req/min)** on `/api` and `/auth`.
- Server actions use the `safeAction` wrapper + zod schema (`lib/utils/actionHandler.ts`, schemas in `lib/validations/`). API routes validate with zod directly.
- `logger` (`lib/logger.ts`) redacts sensitive keys — don't log tokens/passwords yourself.
- Some user-facing error strings are in Thai; keep that when editing existing messages.

