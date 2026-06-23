# SELESAI CORE: MFA / Multi-Factor Authentication (Phase 3 — Core 02)

**Status:** COMPLETE (2026-06-22) | **Tests:** 442 cumulative (+3 MFA tests)

## Features

### Database (5 tables)
- `mfa_settings` — Company-level MFA enforcement (require/hard, allowed methods)
- `mfa_secrets` — Per-user TOTP secrets with enable/disable
- `recovery_codes` — 8 one-time recovery codes (SHA-256 hashed)
- `trusted_devices` — Device fingerprinting with expiry
- `mfa_logs` — Setup, verify, disable, reset, recovery_used events

### Backend API
- `GET /mfa/status` — Check MFA status
- `POST /mfa/setup` — Generate TOTP secret + 8 recovery codes (one-time shown)
- `POST /mfa/verify` — Verify TOTP code (HMAC-SHA1, ±1 window)
- `POST /mfa/disable` — Disable MFA + clear codes
- `GET /mfa/recovery-codes` — Remaining count
- `POST /admin/users/:id/reset-mfa` — Admin override
- `GET/POST /mfa/settings` — Company settings

### TOTP Implementation
- Native Node.js crypto (no external dependencies)
- HMAC-SHA1 based OTP generation, 30-second window, ±1 skew tolerance

**Build:** API ✅ | Web ✅ | **Tests:** 442/442 PASS
