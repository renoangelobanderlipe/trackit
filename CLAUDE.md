# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

TrackIt — a loans/installment tracking PWA. Monorepo: Next.js frontend + Laravel backend.

## Commands

```bash
# Frontend (Next.js 16 — apps/web)
pnpm dev              # Dev server at localhost:3000
pnpm build            # Production build
pnpm lint             # Biome check (JS/TS linting + formatting)
pnpm format           # Biome auto-format

# Backend (Laravel 13 — apps/server)
pnpm dev:server       # Laravel dev (serve + queue + pail + vite)
pnpm test:server      # Run Pest tests
pnpm lint:server      # Pint formatter (dirty files)

# Or run directly in apps/server:
cd apps/server
php artisan test --compact
php artisan test --compact --filter=CreateLoanTest
vendor/bin/pint --dirty --format agent
```

## Stack

- **Next.js 16** with App Router — read `node_modules/next/dist/docs/` before writing code
- **React 19** with React Compiler (`reactCompiler: true`)
- **MUI 7** + Hugeicons — component library with custom teal theme
- **Laravel 13** with PHP 8.4 — follow Boost guidelines in `apps/server/CLAUDE.md`
- **Laravel Sanctum** — cookie-based SPA authentication
- **PostgreSQL** — primary database
- **Pest 4** — PHP testing | **Biome 2** — JS/TS linting | **Pint** — PHP formatting
- **pnpm workspaces** — monorepo | **Motion** — animations | **dayjs** — dates

## Architecture (apps/server) — Feature-Based Modular

```
app/
├── Actions/              # Single-purpose business logic classes
│   ├── CreateLoan.php           # Create loan + generate installments + validate sum
│   ├── MarkInstallmentPaid.php  # Lock, pay, transition loan status
│   ├── ReversePayment.php       # Lock, reset, revert loan status
│   ├── RegenerateInstallments.php # Delete unpaid, regenerate from remaining
│   └── GetDashboardData.php     # Dashboard aggregation queries
├── Http/
│   ├── Controllers/      # Thin: validate → authorize → delegate → respond
│   ├── Middleware/        # SecurityHeaders
│   ├── Requests/          # Form request validation
│   └── Resources/         # API resource transformation
├── Models/               # Eloquent models (User, Loan, Installment) — UUIDs, soft deletes
├── Policies/             # Centralized authorization (LoanPolicy)
│   └── LoanPolicy.php          # view, update, delete — all check user_id
├── Providers/
└── Services/             # Domain services
    └── InstallmentGenerator.php # Generates installments with rounding correction
```

**Key patterns:**
- Controllers are thin — they delegate to Action classes via dependency injection
- Authorization uses `Gate::authorize('view', $loan)` backed by `LoanPolicy`
- All money math uses `bcmath` (bcadd, bcsub, bcdiv, bccomp) — never float
- Transactions with `lockForUpdate()` on concurrent payment operations

## Architecture (apps/web) — Feature-Based Routes

```
app/
├── (auth)/               # Auth pages (login, register) — split-panel layout
├── (app)/                # Authenticated pages
│   ├── dashboard/        # Summary cards, upcoming payments, active loans
│   └── loans/            # List (infinite scroll + search), detail, create, edit
├── actions/              # Server Actions — RPC bridge to Laravel
lib/
├── rpc.ts                # Typed fetch wrapper: rpc() read-only, rpcMutable() with CSRF
├── types.ts              # Shared TypeScript types
├── format.ts             # formatCurrency, formatDate, decimalSubtract, parseApiError
components/
├── TiLogo.tsx            # Shared logo component (sm/md/lg, solid/glass)
├── animations/           # CountUp, FadeIn, StaggerList, AnimatedProgress, PulsingFab, Confetti
proxy.ts                  # Next.js 16 route protection (replaces middleware.ts)
```

## Auth Flow

All auth goes through Server Actions — browser never calls Laravel directly:

```
Browser → Server Action → rpcMutable() → /sanctum/csrf-cookie → Laravel API
```

- `rpcMutable()` fetches fresh CSRF token before every state-changing request
- Session cookies stored on Next.js domain via `cookieStore.set()`
- `proxy.ts` checks `trackit_authed` cookie for route protection
- `buildCookieHeader()` forwards cookies to Laravel (without URL encoding)

## Key Constraints

- Next.js 16: `proxy.ts` not `middleware.ts`, `cookies()` is async
- Next.js 16: can't pass component functions as props Server → Client
- React Compiler enabled — no manual useMemo/useCallback/React.memo
- All money as strings between API and frontend — `decimalSubtract()` for client math
- `formatCurrency()` shows 2 decimals only when value has cents
- Session cookie name is `trackit-session` (derived from APP_NAME)
- Run `vendor/bin/pint --dirty --format agent` after PHP changes
- Use `php artisan make:` to scaffold Laravel files
- Use `pnpm` only (not npm/npx)
