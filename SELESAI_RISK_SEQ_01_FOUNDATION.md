# SELESAI RISK SEQUENCE 01: Foundation & Master Data

**Date:** 2026-06-23 | **Tests:** 489 cumulative (+3 risk tests, 42 files)

## Features

### Database
- `risk_settings` — Per-company risk config (matrix type 3x3/4x4/5x5/6x6, workflow/attachment toggles, severity/likelihood/risk level JSON definitions)

### Backend API (`/api/v1/risk`)
- `GET /settings` — Get company risk settings (auto-creates defaults with 5×5 matrix)
- `PATCH /settings` — Update settings (severity, likelihood, risk levels configurable)
- `GET /master-data` — Get risk master data groups + items
- `POST /master-data/seed-defaults` — Seed 7 risk master data groups with 100+ items

### Master Data Seeded (7 groups, 100+ items)
- Hazard Category (17 items: Physical, Chemical, Biological, Working at Height, etc.)
- Hazard Type (16 items: Slip/Trip/Fall, Fire/Explosion, etc.)
- Consequence Type (10 items)
- Control Type (10 items: Elimination, Substitution, Engineering, PPE, etc.)
- Risk Category (10 items)
- Risk Status (9 items)
- Review Frequency (7 items)

### Permissions
- `risk.view`, `risk.create`, `risk.update`, `risk.delete`, `risk.manage_settings`, `risk.export`
- Seeded in `seed.ts`

### Frontend (2 pages)
- **Settings** (`/dashboard/risk/settings`) — Matrix type selector, workflow toggle, editable severity labels, risk level color bands
- **Master Data** (`/dashboard/risk/master-data`) — Grouped display, seed defaults button

### Default Matrix (5×5)
Severity: Insignificant(1) → Minor(2) → Moderate(3) → Major(4) → Catastrophic(5)
Likelihood: Rare(1) → Unlikely(2) → Possible(3) → Likely(4) → Almost Certain(5)
Risk: Low(1-6 🟢) → Medium(7-12 🟡) → High(13-19 🟠) → Extreme(20-25 🔴)

**Build:** API ✅ | Web ✅ | **Tests:** 489/489 PASS
