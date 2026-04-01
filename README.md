# TrackIt

A simple and intuitive loans tracking PWA that helps you monitor borrowed money, payment schedules, and balances — all in one place. Never lose track of who owes what again.

## Features

- **Loan Management** — Create, edit, and delete loans with provider info, payment frequency, and auto-generated installments
- **Installment Tracking** — Track each payment with due dates, amounts, and statuses (Not Started, In Progress, Done)
- **Payment Recording** — Mark installments as paid (full or partial), reverse payments, regenerate schedules
- **Dashboard** — Overview of active loans, total owed/paid, overdue count, and upcoming payments
- **Search & Filter** — Search loans by title/provider, filter by status/provider/date range with persisted filters
- **Infinite Scroll** — Paginated loan list with smooth infinite scroll loading
- **Auto-Transitions** — Loan status automatically updates: not_started → in_progress → done
- **PWA** — Installable on mobile, standalone mode, offline-capable app shell
- **Mobile-First** — iOS-native feel with safe areas, touch feedback, and bottom navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, MUI 7, TypeScript 5, Motion |
| Backend | Laravel 13, PHP 8.4, Laravel Sanctum |
| Database | PostgreSQL (UUIDs, soft deletes) |
| Icons | Hugeicons |
| Testing | Pest 4 (PHP), Biome 2 (JS/TS linting) |
| CI/CD | GitHub Actions, Vercel, Laravel Cloud |
| Package Manager | pnpm workspaces (monorepo) |

## Architecture

### Backend — Feature-Based Modular

```
apps/server/app/
├── Actions/                    # Single-purpose business logic
│   ├── CreateLoan.php               # Loan + installments in transaction
│   ├── MarkInstallmentPaid.php      # Lock, pay, transition status
│   ├── ReversePayment.php           # Lock, reset, revert status
│   ├── RegenerateInstallments.php   # Delete unpaid, regenerate remaining
│   └── GetDashboardData.php         # Dashboard aggregation
├── Http/
│   ├── Controllers/            # Thin: validate → authorize → delegate → respond
│   ├── Requests/               # Form request validation
│   └── Resources/              # API transformation (LoanResource, InstallmentResource)
├── Models/                     # Eloquent (User, Loan, Installment) — UUIDs, soft deletes
├── Policies/                   # Centralized authorization
│   └── LoanPolicy.php              # view, update, delete
└── Services/
    └── InstallmentGenerator.php     # Date calculation + rounding correction
```

### Frontend — Feature-Based Routes

```
apps/web/
├── app/
│   ├── (auth)/             # Login, register — split-panel design
│   ├── (app)/              # Authenticated app shell + bottom nav
│   │   ├── dashboard/      # Hero card, upcoming payments, active loans
│   │   └── loans/          # List (search + infinite scroll), detail, create, edit
│   └── actions/            # Server Actions (RPC bridge to Laravel)
├── lib/
│   ├── rpc.ts              # Typed fetch: rpc() read-only, rpcMutable() with CSRF
│   ├── types.ts            # Shared TypeScript types
│   └── format.ts           # Currency, date, decimal utilities
├── components/
│   ├── TiLogo.tsx          # Shared logo (sm/md/lg, solid/glass variants)
│   └── animations/         # CountUp, FadeIn, StaggerList, AnimatedProgress
└── proxy.ts                # Route protection (Next.js 16)
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **PHP** >= 8.4
- **Composer** >= 2
- **PostgreSQL** >= 15

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url> trackit
cd trackit
pnpm install
cd apps/server && composer install
```

### 2. Configure the backend

```bash
cd apps/server
cp .env.example .env
php artisan key:generate
```

Edit `apps/server/.env`:

```env
APP_NAME=Trackit
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=trackit
DB_USERNAME=postgres
DB_PASSWORD=

SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 3. Set up the database

```bash
createdb trackit
cd apps/server
php artisan migrate
```

### 4. Configure the frontend

Create `apps/web/.env.local`:

```env
LARAVEL_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start development servers

```bash
# Terminal 1: Laravel backend
pnpm dev:server

# Terminal 2: Next.js frontend
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm dev:server` | Start Laravel dev server |
| `pnpm build` | Production build (frontend) |
| `pnpm lint` | Biome lint check (JS/TS) |
| `pnpm format` | Biome auto-format (JS/TS) |
| `pnpm test:server` | Run Pest tests (backend) |
| `pnpm lint:server` | Run Pint formatter (PHP) |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register (rate limited: 5/min) |
| `POST` | `/api/login` | Log in (rate limited: 5/min) |
| `POST` | `/api/logout` | Log out |
| `GET` | `/api/user` | Get current user |

### Loans

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/loans?search=&page=&per_page=` | List loans (paginated, searchable) |
| `POST` | `/api/loans` | Create loan (auto-generates installments) |
| `GET` | `/api/loans/{id}` | Get loan with installments |
| `PUT` | `/api/loans/{id}` | Update loan |
| `DELETE` | `/api/loans/{id}` | Soft delete loan |

### Installments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/installments/upcoming` | Next 10 pending installments |
| `PATCH` | `/api/installments/{id}/pay` | Mark paid (rate limited: 10/min) |
| `PATCH` | `/api/installments/{id}/reverse` | Reverse payment (rate limited: 10/min) |
| `POST` | `/api/loans/{id}/regenerate-installments` | Regenerate unpaid installments |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Dashboard summary |
| `GET` | `/api/loan-filters` | Get saved filters |
| `PUT` | `/api/loan-filters` | Save filters |
| `GET` | `/api/health` | Health check |

## Data Model

### Loan

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | string | Loan name |
| `provider` | string? | Lending company |
| `total_amount` | decimal(12,2) | Total loan amount |
| `num_installments` | integer | Number of payments (max: 360) |
| `payment_frequency` | enum | `monthly`, `twice_a_month`, `weekly`, `biweekly` |
| `due_days` | int[]? | For twice_a_month: e.g., `[15, 25]` |
| `start_date` | date | First payment date |
| `status` | enum | `not_started`, `in_progress`, `done` |
| `notes` | text? | Optional notes |
| `deleted_at` | timestamp? | Soft delete |

### Installment

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `loan_id` | UUID | Foreign key |
| `amount` | decimal(12,2) | Amount due |
| `label` | string | e.g., "2/6" |
| `due_date` | date | Payment due date |
| `status` | enum | `pending`, `paid`, `partial` |
| `paid_amount` | decimal(12,2) | Amount paid |
| `paid_date` | date? | When payment was made |
| `notes` | text? | Payment notes |
| `deleted_at` | timestamp? | Soft delete |

## Security

- **CSRF protection** on all API routes (except login/register) via X-XSRF-TOKEN header
- **Rate limiting**: 5/min auth, 60/min global, 10/min payments
- **Authorization**: LoanPolicy enforced via Gate on all endpoints
- **Soft deletes**: loans and installments are recoverable
- **Session**: httpOnly, secure (production), SameSite=lax, 8hr lifetime (30 days with remember me)
- **Money**: bcmath on server, decimalSubtract on client — never float arithmetic
- **Input validation**: max amounts, max installments, date constraints, password complexity

## CI/CD

GitHub Actions runs on push to `main` and all PRs:

- **Frontend Lint** — Biome check + TypeScript typecheck
- **Frontend Build** — Next.js production build
- **Backend Lint** — Pint formatting check
- **Backend Tests** — Pest with SQLite in-memory

Auto-labeler tags PRs by changed files (frontend, backend, devops, docs, etc.).

## Deployment

- **Frontend**: Vercel — set `LARAVEL_URL` and `NEXT_PUBLIC_APP_URL`
- **Backend**: Laravel Cloud — set `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, `SESSION_SECURE_COOKIE=true`

## License

Private project.
