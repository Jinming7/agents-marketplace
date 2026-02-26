# Agents Marketplace

Minimal monorepo bootstrap for REQ-0001 iteration 1.

## Quick start

```bash
npm install
npm run build
```

## Backend env

Create `apps/backend/.env`:

```bash
PORT=3001
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

## Initialize DB schema/data

```bash
npm run db:init --workspace @marketplace/backend
```

This executes `supabase/init.sql` and seeds `public.apps`.

## Verify DB readiness

```bash
npm run db:verify --workspace @marketplace/backend
```

## API quick checks

- `GET /api/meta`
- `GET /api/apps/search?q=slack`
- `GET /api/apps/:appKey`
