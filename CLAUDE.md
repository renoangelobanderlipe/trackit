# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

TrackIt — a loans/installment tracking web app. Monorepo: Next.js frontend + Laravel backend.

## Commands

```bash
# Frontend (Next.js 16 — apps/web)
pnpm dev              # Dev server at localhost:3000
pnpm build            # Production build
pnpm start            # Serve production build
pnpm lint             # Biome check (JS/TS linting + formatting)
pnpm format           # Biome auto-format

# Backend (Laravel 13 — apps/server)
pnpm dev:server       # Laravel dev (serve + queue + pail + vite)
pnpm test:server      # Run Pest tests
pnpm lint:server      # Pint formatter (dirty files)

# Or run directly in apps/server:
cd apps/server
php artisan serve     # Laravel server at localhost:8000
php artisan test --compact
php artisan test --compact --filter=CreateLoanTest  # Run single test
vendor/bin/pint --dirty --format agent
```

## Stack

- **Next.js 16.2.1** with App Router — breaking changes from earlier versions; read `node_modules/next/dist/docs/` before writing code
- **React 19** with React Compiler enabled (`reactCompiler: true` in next.config.ts)
- **MUI 7** — component library with AppRouterCacheProvider (v16-appRouter), ThemeProvider, CssBaseline
- **Laravel 13** with PHP 8.4 — follow Laravel Boost guidelines in `apps/server/CLAUDE.md`
- **Laravel Sanctum** — cookie-based SPA authentication
- **PostgreSQL** — primary database
- **Pest 4** for PHP testing
- **Pint** for PHP formatting — run on dirty files before committing
- **TypeScript 5** — strict mode
- **Biome 2** — JS/TS linting and formatting (excludes `apps/server`)
- **pnpm workspaces** — monorepo package manager

## Monorepo Structure

- `apps/web/` — Next.js frontend (`@trackit/web`)
- `apps/server/` — Laravel backend (PHP, has its own `composer.json` and `package.json`)
- Root `package.json` — workspace scripts, shared dev deps (Biome)
- Biome handles JS/TS; Pint handles PHP formatting

## Architecture (apps/web)

- `app/(auth)/` — login, register pages (client-side, calls Laravel directly)
- `app/(app)/` — authenticated pages: dashboard, loans, loan detail, edit
- `app/actions/` — Server Actions that call Laravel via `lib/rpc.ts`
- `lib/rpc.ts` — typed fetch wrapper with cookie forwarding (Server Actions → Laravel)
- `lib/auth-client.ts` — client-side auth fetch (CSRF cookie + XSRF-TOKEN for login/register)
- `lib/types.ts` — shared TypeScript types (Loan, Installment, DashboardData, etc.)
- `proxy.ts` — Next.js 16 route protection (replaces middleware.ts, export `proxy`)
- `app/theme.ts` — MUI theme with CSS variables, Geist Sans font
- Path alias: `@/*` maps to `apps/web/*`

## Architecture (apps/server)

- Standard Laravel 13 structure
- `app/Services/InstallmentGenerator.php` — generates installments from loan params (handles monthly, twice_a_month, weekly, biweekly)
- `app/Http/Resources/` — LoanResource, InstallmentResource (computed fields: total_paid, is_overdue)
- API routes in `routes/api.php` under `auth:sanctum` middleware
- Sanctum with `statefulApi()` middleware in `bootstrap/app.php`
- CORS configured for frontend URL in `config/cors.php`

## Auth Flow

- **Login/Register**: Browser → Laravel directly (fetch + credentials: include)
  1. `GET /sanctum/csrf-cookie` → get XSRF-TOKEN
  2. `POST /api/login` with `X-XSRF-TOKEN` header
  3. Sets `trackit_authed` cookie on Next.js domain for proxy to check
- **Protected pages**: Browser → Server Action → `rpc()` → Laravel (forwards cookies)
- **Logout**: Server Action calls Laravel, clears `trackit_authed` cookie

## Key Constraints

- Next.js 16 uses `proxy.ts` (not `middleware.ts`), export named `proxy`
- Next.js 16: `cookies()` from `next/headers` is async — must `await cookies()`
- Next.js 16: can't pass component functions as props from Server to Client Components (e.g., `component={Link}`)
- React Compiler is enabled — avoid manual `useMemo`/`useCallback`/`React.memo`
- Always run `vendor/bin/pint --dirty --format agent` after modifying PHP files
- Use `php artisan make:` commands to scaffold Laravel files
- Use `pnpm` only for JS (not npm/npx)
