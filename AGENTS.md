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
- `SUPABASE_SERVICE_ROLE_KEY` is only for server-side clients; never expose it client-side or in `NEXT_PUBLIC_*`.
- Supabase is used as a plain Postgres DB through `lib/supabase/admin.ts` (`createAdminClient`) and `lib/supabase/server.ts` (`createServerClient`). Env is validated by `lib/env.ts`.

## Environment
- `.env*` is gitignored; copy `.env.example` → `.env.local`. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`. `lib/auth/jwt.ts` falls back to a hardcoded dev secret if `JWT_SECRET` is absent — set it for anything non-local.
- Schema is applied manually (no Supabase CLI config): `supabase/schema.sql` and `supabase/migrations/full_nextflow_setup.sql`. `scripts/seed-admin.js` creates `admin@nextflow.com` / `admin123` and errors with `42P01` if the schema hasn't been run.

## Conventions & gotchas
- `middleware.ts` enforces a **1MB payload limit** on POST/PUT/PATCH `/api` routes and **distributed rate limiting (60 req/min)** on `/api` and `/auth`.
- Server actions use the `safeAction` wrapper + zod schema (`lib/utils/actionHandler.ts`, schemas in `lib/validations/`). API routes validate with zod directly.
- `logger` (`lib/logger.ts`) redacts sensitive keys — don't log tokens/passwords yourself.
- Some user-facing error strings are in Thai; keep that when editing existing messages.
- Load the `supabase` / `supabase-postgres-best-practices` skills (`.agents/skills/`) before changing anything DB-related.

