# SELESAI CORE: SSO / Single Sign-On (Phase 3 — Core 01)

**Status:** COMPLETE (2026-06-22) | **Tests:** 439 cumulative (+3 SSO tests)

## Features

### Database (4 tables)
- `sso_providers` — OIDC, SAML, Google, Azure, Okta, Keycloak with JSON config
- `sso_mappings` — Claim-to-role/site mapping with auto-provision
- `sso_login_logs` — Login audit (success/failed/blocked, IP, error)
- `identity_provider_configs` — Global IdP config key-value store

### Backend API
- CRUD SSO providers + test configuration endpoint
- SSO login history endpoint
- Provider validation (rejects unsupported types)

### Frontend (3 pages)
- Providers list with test/delete actions, status badges
- Add provider form (name, type: OIDC/SAML/Google/Azure/Okta/Keycloak, client ID/secret, issuer URL)
- Settings (domain restriction, auto-provision toggle)

**Build:** API ✅ | Web ✅ | **Tests:** 439/439 PASS
