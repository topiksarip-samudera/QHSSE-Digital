# SELESAI PTW SEQUENCE 01: Foundation & Master Data

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (2 tables)
- `permit_settings` — Company PTW config (require JSA, risk assessment, gas test, LOTO, SIMOPS, QR verification, max duration)
- `permit_types` — 14 default permit types (Hot Work, Cold Work, Height, Confined Space, Electrical, Lifting, Excavation, LOTO, Radiography, Chemical, Line Breaking, Pressure Testing, Night Work, SIMOPS)

### Backend API (`/api/v1/ptw`)
- `GET/PATCH /settings` — Get/update PTW settings (auto-create defaults)
- `GET /permit-types` — List permit types
- `POST /permit-types/seed` — Seed 14 default permit types
- `GET /master-data` — Get PTW master data
- `POST /master-data/seed-defaults` — Seed 7 master data groups with 60+ items

### Master Data Seeded (7 groups, 60+ items)
- Permit Work Category (14), Permit Status (9), Risk Level (4), PPE Type (12), Energy Type (8), Isolation Type (6), Worker Role (9)

### Default Permit Types (14)
Hot Work, Cold Work, Working at Height, Confined Space Entry, Electrical Work, Lifting Operation, Excavation, LOTO, Radiography, Chemical Work, Line Breaking, Pressure Testing, Night Work, SIMOPS

### Permissions
- `ptw.view`, `ptw.create`, `ptw.update`, `ptw.delete`, `ptw.manage_settings`, `ptw.export`
- Seeded in `seed.ts`

### Frontend (2 pages)
- **Settings** — 6 checkbox toggles + max duration input
- **Master Data** — Grouped display + seed permit types + seed master data buttons

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
