# API Test Cases - ONES Marketplace

## Base URL
`http://localhost:3001/api`

## Test Environment
- Backend: Express + TypeScript (port 3001)
- Frontend: Vite + React (port 5173)

---

## 1. Authentication API Tests

### 1.1 Register

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-AUTH-REG-001 | Register with valid email and password | POST | /auth/register | 201 | Token returned, user object present |
| TC-AUTH-REG-002 | Register with duplicate email | POST | /auth/register | 400 | AUTH_EMAIL_EXISTS error |
| TC-AUTH-REG-003 | Register with invalid email format | POST | /auth/register | 400 | VALIDATION_ERROR |
| TC-AUTH-REG-004 | Register with short password (<6 chars) | POST | /auth/register | 400 | VALIDATION_ERROR |
| TC-AUTH-REG-005 | Register with password without number | POST | /auth/register | 400 | VALIDATION_ERROR |
| TC-AUTH-REG-006 | Register with missing email | POST | /auth/register | 400 | VALIDATION_ERROR |
| TC-AUTH-REG-007 | Register with missing password | POST | /auth/register | 400 | VALIDATION_ERROR |

### 1.2 Login

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-AUTH-LOGIN-001 | Login with valid credentials | POST | /auth/login | 200 | Token returned |
| TC-AUTH-LOGIN-002 | Login with invalid password | POST | /auth/login | 401 | AUTH_INVALID_CREDENTIALS |
| TC-AUTH-LOGIN-003 | Login with non-existent email | POST | /auth/login | 401 | AUTH_INVALID_CREDENTIALS |
| TC-AUTH-LOGIN-004 | Login with invalid email format | POST | /auth/login | 400 | VALIDATION_ERROR |
| TC-AUTH-LOGIN-005 | Login with missing email | POST | /auth/login | 400 | VALIDATION_ERROR |
| TC-AUTH-LOGIN-006 | Login with missing password | POST | /auth/login | 400 | VALIDATION_ERROR |

---

## 2. Apps API Tests

### 2.1 List Apps

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-APPS-LIST-001 | List all apps | GET | /apps | 200 | Returns apps array, total count |
| TC-APPS-LIST-002 | Search apps by name | GET | /apps?q=Slack | 200 | Returns matching apps |
| TC-APPS-LIST-003 | Search apps by description | GET | /apps?q=project | 200 | Returns matching apps |
| TC-APPS-LIST-004 | Search with case insensitive | GET | /apps?q=slack | 200 | Returns matching apps |
| TC-APPS-LIST-005 | Filter by category | GET | /apps?category=Development | 200 | Returns filtered apps |
| TC-APPS-LIST-006 | Sort by installs | GET | /apps?sort=installs | 200 | Apps sorted by installs desc |
| TC-APPS-LIST-007 | Sort by rating | GET | /apps?sort=rating | 200 | Apps sorted by rating desc |
| TC-APPS-LIST-008 | Sort by name | GET | /apps?sort=name | 200 | Apps sorted alphabetically |
| TC-APPS-LIST-009 | Combined search and filter | GET | /apps?q=team&category=Collaboration | 200 | Returns filtered results |
| TC-APPS-LIST-010 | Search with no results | GET | /apps?q=nonexistent | 200 | Returns empty apps array |
| TC-APPS-LIST-011 | Search query too long (>100 chars) | GET | /apps?q=a... | 400 | VALIDATION_ERROR |

### 2.2 Get App by ID

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-APPS-GET-001 | Get existing app | GET | /apps/1 | 200 | Returns app with details |
| TC-APPS-GET-002 | Get non-existent app | GET | /apps/999 | 404 | APP_NOT_FOUND error |
| TC-APPS-GET-003 | Get app with invalid UUID | GET | /apps/invalid-id | 400 | VALIDATION_ERROR |

---

## 3. Categories API Tests

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-CAT-001 | Get all categories | GET | /categories | 200 | Returns categories array |
| TC-CAT-002 | Categories are unique | GET | /categories | 200 | No duplicate categories |

---

## 4. User API Tests (Protected)

### 4.1 Installations

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-USER-INST-001 | Get installations without auth | GET | /user/installations | 401 | AUTH_REQUIRED |
| TC-USER-INST-002 | Get installations with auth | GET | /user/installations | 200 | Returns installed apps |
| TC-USER-INST-003 | Install app without auth | POST | /user/installations | 401 | AUTH_REQUIRED |
| TC-USER-INST-004 | Install app with auth | POST | /user/installations | 201 | Success message |
| TC-USER-INST-005 | Install non-existent app | POST | /user/installations | 404 | APP_NOT_FOUND |
| TC-USER-INST-006 | Install app with invalid UUID | POST | /user/installations | 400 | VALIDATION_ERROR |
| TC-USER-INST-007 | Uninstall app without auth | DELETE | /user/installations/1 | 401 | AUTH_REQUIRED |
| TC-USER-INST-008 | Uninstall app with auth | DELETE | /user/installations/1 | 200 | Success message |
| TC-USER-INST-009 | Uninstall non-existent app | DELETE | /user/installations/999 | 200 | Still returns success |

### 4.2 Profile

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-USER-PROF-001 | Get profile without auth | GET | /user/profile | 401 | AUTH_REQUIRED |
| TC-USER-PROF-002 | Get profile with auth | GET | /user/profile | 200 | Returns profile with email |
| TC-USER-PROF-003 | Update profile without auth | PUT | /user/profile | 401 | AUTH_REQUIRED |
| TC-USER-PROF-004 | Update profile with auth | PUT | /user/profile | 200 | Success message |
| TC-USER-PROF-005 | Update profile with name | PUT | /user/profile | 200 | Name updated |
| TC-USER-PROF-006 | Update profile with bio | PUT | /user/profile | 200 | Bio updated |
| TC-USER-PROF-007 | Update profile with notifications | PUT | /user/profile | 200 | Notifications updated |
| TC-USER-PROF-008 | Update profile with invalid name (>50 chars) | PUT | /user/profile | 400 | VALIDATION_ERROR |

---

## 5. Error Handling Tests

| TC ID | Description | Method | Endpoint | Expected Status | Validation |
|-------|-------------|--------|----------|-----------------|------------|
| TC-ERR-001 | 404 for unknown route | GET | /unknown | 404 | Proper error response |
| TC-ERR-002 | Method not allowed | PUT | /apps | 404 | Proper error response |
| TC-ERR-003 | Invalid JSON body | POST | /auth/login | 400 | Proper error response |

---

## Priority Summary

| Priority | Count |
|----------|-------|
| P0 (Critical) | 25 |
| P1 (High) | 20 |
| P2 (Medium) | 15 |
| Total | 60 |
