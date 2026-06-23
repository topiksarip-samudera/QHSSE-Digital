# SELESAI CORE: API Key Management (Phase 2 — Core 08)

**Status:** COMPLETE (2026-06-22) | **Tests:** 424 cumulative (+3 API key tests)

## Features

### Database (4 tables)
- `api_keys` — Key hash, prefix, expiry, status (active/revoked/expired), last used
- `api_key_scopes` — Per-key scope permissions (resource:action pattern)
- `api_usage_logs` — Method, path, status code, duration, IP
- `rate_limits` — Max requests per window (default 1000/hour)

### Backend API (`/api/v1/api-keys`)
- ✅ Create key (generates `qhsse_` prefixed 64-char key, SHA-256 hashed)
- ✅ List keys (with scopes and rate limits)
- ✅ Revoke key
- ✅ Rotate key (revoke old + create new with same scopes/limits)
- ✅ View usage logs

### Frontend Page
- Keys table: name, prefix, status, scopes, rate limit, expiry
- Create key form: name, expiry, scopes, max requests
- New key modal: displays raw key on creation/rotation (SHA-256 hash stored)
- Revoke and rotate actions

**Build:** API ✅ | Web ✅ | **Tests:** 424/424 PASS
