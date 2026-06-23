# 06 — SECURITY AND API STANDARDS

## Security Default

- HTTPS only di production.
- Password hash bcrypt/argon2.
- JWT short-lived.
- Refresh token rotation.
- API key hashed.
- Rate limit.
- CORS restricted.
- CSRF protection jika menggunakan cookie.
- File upload validation.
- Input validation.
- SQL injection protection melalui ORM dan parameterized query.
- Audit log untuk critical action.

## API Standard

Prefix:

```text
/api/v1
```

Response success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Response error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message",
    "details": []
  }
}
```

## Pagination

Query:

```text
?page=1&pageSize=20&sort=createdAt:desc&search=abc
```

Response meta:

```json
{
  "page": 1,
  "pageSize": 20,
  "total": 100,
  "totalPages": 5
}
```

## Required Guards

```text
AuthGuard
TenantGuard
PermissionGuard
ModuleEnabledGuard
RateLimitGuard
```

## Audit Middleware

Critical endpoint harus memanggil audit service.

Catat:

```text
actor
company
module
action
record_id
old_value
new_value
ip
user_agent
timestamp
```
