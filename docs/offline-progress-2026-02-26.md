# Offline Progress (2026-02-26)

## Completed without Vercel access

- Added backend metadata endpoint: `GET /api/meta`
  - returns service name, supabaseConfigured flag, timestamp.
- Added DB verification script: `npm run db:verify --workspace @marketplace/backend`
  - verifies `public.apps` table exists
  - prints apps row count
- Kept one-command bootstrap flow in place:
  - `npm run db:init --workspace @marketplace/backend`

## In progress

- Stabilizing production-oriented config defaults for backend/frontend runtime separation.

## Pending for user return (Vercel permissions)

- Set Vercel **Production Branch** to `staging`.
- Confirm environment variables in Vercel project:
  - `BACKEND_BASE_URL` (frontend runtime)
  - backend secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) if deploying backend runtime.
- Re-run production visit check after above settings.
