# Backend Code Review + FE/BE Integration Test Report
Date: 2026-02-25
Project: ONES.COM/Marketplace
Scope: backend review + frontend/backend integration smoke/regression checks

## 1) Backend code review summary

### Architecture snapshot
- Stack: Express + TypeScript + Prisma + Elasticsearch
- Entry: `backend/src/server.ts` -> `backend/src/app.ts`
- Route groups:
  - `/api/apps/*`
  - `/api/app-requests/*`

### Findings

#### High
1. **Mock auth is always enabled globally**
   - File: `backend/src/app.ts` + `backend/src/middlewares/auth.ts`
   - `app.use(mockAuth)` is unconditional, meaning all requests are auto-authenticated with fallback user context.
   - Risk: auth bypass in non-dev environments.
   - Recommendation: gate with env flag (e.g. `ENABLE_MOCK_AUTH=true` only in dev), and enforce real auth middleware in production.

2. **Error responses may leak internal details**
   - File: `backend/src/app.ts` global error handler
   - Raw `error.message` is returned to clients. Prisma/Zod internals and environment info can be exposed.
   - Risk: information disclosure.
   - Recommendation: return sanitized messages (`Validation failed`, `Internal server error`) and log internals server-side.

#### Medium
3. **Admin list endpoint lacks org-level data scoping**
   - File: `backend/src/modules/appRequests/appRequests.service.ts` (`listRequests`)
   - Current query filters by status only; no `organizationId` guard.
   - Risk: cross-organization data exposure if shared deployment.
   - Recommendation: scope by actor org unless `PRODUCT_ADMIN` explicitly allowed to view global scope.

4. **Business rules only guarded at route layer for approve/reject**
   - File: `appRequests.routes.ts` + `appRequests.service.ts`
   - Service methods trust caller role context; if reused elsewhere, protection can be bypassed.
   - Recommendation: re-check role and permissions in service layer for defense-in-depth.

#### Low
5. **No duplicate pending request prevention**
   - File: `appRequests.service.ts#createRequest`
   - Same user can repeatedly request same app while pending.
   - Recommendation: enforce uniqueness rule (`requesterId + appId + status=PENDING`).

6. **Search endpoint dependency fallback not graceful**
   - File: `apps.service.ts`
   - Elasticsearch failures return 500 without fallback behavior.
   - Recommendation: optional DB fallback or clearer degraded-mode error contract.

---

## 2) Test environment

- Backend: `npm run dev:backend` (port 4000)
- Frontend: `npm run dev:frontend` (auto-selected port 3003)
- Runtime note:
  - `DATABASE_URL` not present in backend runtime env during test
  - Elasticsearch connectivity for search endpoint not available/ready during test

---

## 3) Backend API test results (executed)

### 3.1 Health
- Request: `GET /health`
- Result: ✅ **200 OK** `{ "ok": true }`

### 3.2 Apps search
- Request: `GET /api/apps/search`
- Result: ❌ **500 Internal Server Error** (`{"message":"Internal server error"}`)
- Likely cause: Elasticsearch unavailable/misconfigured in runtime.

- Request: `GET /api/apps/search?application=jira&hosting=cloud&sortBy=top-rated&page=1&limit=5`
- Result: ❌ **500 Internal Server Error** (same)

- Request: `GET /api/apps/search?sortBy=bad`
- Result: ✅ Validation triggered, but returns ❌ **500** with raw zod payload in message
- Expected better contract: 400 Bad Request + structured validation error.

### 3.3 App detail
- Request: `GET /api/apps/non-existent-key`
- Result: ❌ **500** (Prisma runtime error: missing `DATABASE_URL` exposed in response)
- Expected with healthy env: 404 App not found for unknown key.

### 3.4 App requests
- Request: `GET /api/app-requests` with header `x-user-role: USER`
- Result: ✅ **403 Forbidden** (authorization path works)

- Request: `GET /api/app-requests?page=1&limit=5` with header `x-user-role: PRODUCT_ADMIN`
- Result: ❌ **500** (Prisma runtime error: missing `DATABASE_URL`)

---

## 4) Frontend/backend integration test results

### 4.1 Frontend availability
- Request: `GET /` (frontend)
- Result: ✅ **200**, title detected: `ONES Marketplace`

### 4.2 App detail pages (SSR/route behavior)
- Request: `GET /apps/non-existent-key`
- Result: ✅ **200**, graceful fallback UI rendered (`App not found`)

- Request: `GET /app/non-existent-id`
- Result: ✅ **200**, route responds (fallback page behavior)

### 4.3 End-to-end data path status
- FE shell rendering: ✅
- FE -> BE app detail live data: ⚠️ blocked by backend DB runtime config
- FE -> BE search live data: ⚠️ blocked by backend search backend availability

---

## 5) Overall verdict

- **Code quality baseline**: good modular structure, clear separation by modules/routes/services.
- **Production-readiness blockers**:
  1) mock auth always-on
  2) raw internal error leakage
  3) missing runtime infra/env validation (`DATABASE_URL`, ES connectivity)
- **Integration status**: partial pass (UI available + route fallback pass), core data integration blocked by backend runtime dependencies.

---

## 6) Recommended next actions (priority)

1. Add startup config validation:
   - hard-fail with clear log if `DATABASE_URL` missing
   - health sub-check endpoints (`/health/db`, `/health/search`) or composite readiness.

2. Harden error handling:
   - map zod errors -> 400
   - map known prisma errors -> 4xx/5xx sanitized responses
   - avoid returning raw exception content.

3. Gate mock auth by env:
   - `if (env.nodeEnv === 'development' && env.enableMockAuth) app.use(mockAuth)`

4. Re-run integration after env setup:
   - prepare postgres + prisma migrate + seed
   - prepare elastic index + mappings + seed documents
   - execute API regression suite (search/detail/app-request lifecycle)

