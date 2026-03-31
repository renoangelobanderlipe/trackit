# TrackIt

A simple and intuitive loans tracking app that helps you monitor borrowed money, payment schedules, and balances — all in one place. Never lose track of who owes what again.

## Features

- **Loan Management** — Create, edit, and delete loans with provider info, payment frequency, and auto-generated installments
- **Installment Tracking** — Track each payment with due dates, amounts, and statuses (Not Started, In Progress, Done)
- **Payment Recording** — Mark installments as paid (full or partial) with date and notes
- **Dashboard** — Overview of active loans, total owed/paid, and upcoming payments
- **Status Filtering** — Filter loans by Not Started, In Progress, or Done
- **Auto-Transitions** — Loan status automatically updates when payments are made
- **Mobile-First** — Clean, minimal UI built with MUI 7 for mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, MUI 7, TypeScript 5 |
| Backend | Laravel 13, PHP 8.4, Laravel Sanctum |
| Database | PostgreSQL |
| Testing | Pest 4 (PHP), Biome 2 (JS/TS linting) |
| Package Manager | pnpm workspaces (monorepo) |

## Project Structure

```
trackit/
├── apps/
│   ├── web/                    # Next.js frontend (@trackit/web)
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, register pages
│   │   │   ├── (app)/          # Authenticated pages
│   │   │   │   ├── dashboard/  # Summary cards, upcoming payments
│   │   │   │   └── loans/      # List, detail, create, edit
│   │   │   └── actions/        # Server Actions (RPC to Laravel)
│   │   ├── lib/
│   │   │   ├── rpc.ts          # Typed fetch wrapper with cookie forwarding
│   │   │   └── types.ts        # Shared TypeScript types
│   │   └── proxy.ts            # Route protection (Next.js 16)
│   └── server/                 # Laravel backend
│       ├── app/
│       │   ├── Http/Controllers/  # Auth, Loan, Installment, Dashboard
│       │   ├── Models/            # User, Loan, Installment (UUIDs)
│       │   ├── Services/          # InstallmentGenerator
│       │   └── Http/Resources/    # LoanResource, InstallmentResource
│       ├── database/migrations/
│       ├── routes/api.php
│       └── tests/
├── package.json                # Root workspace scripts
├── pnpm-workspace.yaml
└── biome.json                  # JS/TS linting config
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **PHP** >= 8.3
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
createdb trackit    # or create via psql/pgAdmin
cd apps/server
php artisan migrate
```

### 4. Configure the frontend

Create `apps/web/.env.local`:

```env
LARAVEL_URL=http://localhost:8000
NEXT_PUBLIC_LARAVEL_URL=http://localhost:8000
```

### 5. Start development servers

In two separate terminals:

```bash
# Terminal 1: Laravel backend
pnpm dev:server

# Terminal 2: Next.js frontend
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started.

## Available Scripts

### Root (runs from project root)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server (localhost:3000) |
| `pnpm dev:server` | Start Laravel dev server (localhost:8000) |
| `pnpm build` | Production build (frontend) |
| `pnpm lint` | Biome lint check (JS/TS) |
| `pnpm format` | Biome auto-format (JS/TS) |
| `pnpm test:server` | Run Pest tests (backend) |
| `pnpm lint:server` | Run Pint formatter (PHP) |

### Backend (from `apps/server/`)

| Command | Description |
|---------|-------------|
| `php artisan serve` | Start Laravel server |
| `php artisan test --compact` | Run all tests |
| `php artisan test --compact --filter=CreateLoanTest` | Run specific test |
| `php artisan migrate` | Run migrations |
| `php artisan migrate:fresh` | Reset and re-run all migrations |
| `vendor/bin/pint --dirty` | Format changed PHP files |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Log in |
| `POST` | `/api/logout` | Log out (auth required) |
| `GET` | `/api/user` | Get current user (auth required) |

### Loans (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/loans` | List all loans |
| `POST` | `/api/loans` | Create loan (auto-generates installments) |
| `GET` | `/api/loans/{id}` | Get loan with installments |
| `PUT` | `/api/loans/{id}` | Update loan |
| `DELETE` | `/api/loans/{id}` | Delete loan and installments |

### Installments (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/installments/upcoming` | Next 10 pending installments |
| `PATCH` | `/api/installments/{id}/pay` | Mark installment as paid/partial |

### Dashboard (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Summary stats and upcoming payments |

## Data Model

### Loan

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | string | Loan name (e.g., "Phone Installment") |
| `provider` | string? | Lending company (e.g., "Billease") |
| `total_amount` | decimal | Total loan amount |
| `num_installments` | integer | Number of payments |
| `payment_frequency` | enum | `monthly`, `twice_a_month`, `weekly`, `biweekly` |
| `due_days` | int[]? | For twice_a_month: e.g., `[15, 25]` |
| `start_date` | date | First payment date |
| `status` | enum | `not_started`, `in_progress`, `done` |
| `notes` | text? | Optional notes |

### Installment

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `loan_id` | UUID | Foreign key to loan |
| `amount` | decimal | Amount due |
| `label` | string | e.g., "2/6" |
| `due_date` | date | Payment due date |
| `status` | enum | `pending`, `paid`, `partial`, `overdue` |
| `paid_amount` | decimal | Amount actually paid |
| `paid_date` | date? | When payment was made |
| `notes` | text? | Payment notes |

## Architecture Notes

### Auth Flow

All auth goes through Next.js Server Actions — the browser never calls Laravel directly:

```
Browser → Server Action → rpc()/rpcMutable() → Laravel API
```

- **Login/Register**: Server Action calls Laravel, stores session cookies on Next.js domain
- **Protected pages**: `proxy.ts` checks for `trackit_authed` cookie
- **API calls**: `rpc()` forwards cookies to Laravel for session validation

### RPC Layer

Two functions in `lib/rpc.ts`:

- **`rpc()`** — Read-only, safe for Server Components. Forwards cookies but doesn't modify them.
- **`rpcMutable()`** — For mutations (Server Actions only). Stores Laravel response cookies on Next.js domain.

### Loan Status Auto-Transitions

- New loan → `not_started`
- First payment made → `in_progress`
- All installments paid → `done`
- Manual override available via edit page

## Deployment

- **Frontend**: Deploy `apps/web` to [Vercel](https://vercel.com)
- **Backend**: Deploy `apps/server` to [Laravel Cloud](https://cloud.laravel.com)
- Set `LARAVEL_URL` in Vercel env to your Laravel Cloud URL
- Set `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` in Laravel Cloud env to your Vercel URL

## License

Private project.
