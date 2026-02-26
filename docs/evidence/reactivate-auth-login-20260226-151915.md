# /api/auth/login endpoint samples

## Source
- apps/backend/src/index.ts

## Request sample
```bash
curl -i -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"your-password"}'
```

## Success response sample (200)
```json
{
  "user": { "id": "<uuid>", "email": "demo@example.com" },
  "session": {
    "accessToken": "<jwt>",
    "refreshToken": "<refresh-token>",
    "expiresAt": 1234567890
  }
}
```

## Invalid input response sample (400)
```json
{
  "error": {
    "code": "AUTH_INVALID_INPUT",
    "message": "email and password are required"
  }
}
```

## Invalid credentials response sample (401)
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid credentials"
  }
}
```

## DB not configured response sample (500)
```json
{
  "error": {
    "code": "APP_DB_NOT_CONFIGURED",
    "message": "Supabase is not configured."
  }
}
```
