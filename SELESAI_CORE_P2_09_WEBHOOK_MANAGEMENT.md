# SELESAI CORE: Webhook Management (Phase 2 — Core 09)

**Status:** COMPLETE (2026-06-22) | **Tests:** 427 cumulative (+3 webhook tests)

## Features

### Database (4 tables)
- `webhooks` — URL, secret (HMAC-SHA256), enable/disable, expiry
- `webhook_events` — Per-webhook event subscriptions (e.g. action.created)
- `webhook_logs` — Delivery logs (status code, response, payload, duration, error)
- `webhook_retries` — Retry attempts with status tracking

### Backend API (`/api/v1/webhooks`)
- CRUD webhooks + event management
- ✅ POST `/:id/test` — Real HTTP POST with HMAC-SHA256 signature header
- ✅ GET `/:id/logs` — Delivery history with status codes and durations
- Secure: secret stored hashed, only shown on creation

### Frontend (2 pages)
- **Webhooks page** — Create form, table with name/URL/events/status/logs, test button, logs viewer, enable/disable toggle
- **Settings page** — Max retries slider, timeout configuration

**Build:** API ✅ | Web ✅ | **Tests:** 427/427 PASS
