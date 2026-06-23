# SELESAI RISK SEQUENCE 04: Risk Matrix & Risk Calculation Engine

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (3 tables)
- `risk_matrix_definitions` — Per-company matrix config (name, size, version, active)
- `risk_matrix_cells` — Individual severity×likelihood cells (risk score, level, label, color, required action)
- `risk_matrix_versions` — Immutable version snapshots on update

### Backend API (`/api/v1/risk`)
- `GET /matrix` — Get current matrix with all cells (auto-creates 5×5 default with 25 cells)
- `PATCH /matrix` — Update matrix (creates version snapshot, replaces all cells)
- `POST /matrix/preview` — Calculate risk score from severity × likelihood, return level/label/color
- `GET /matrix/versions` — Version history

### Default Matrix (5×5)
- 25 cells with auto-calculated scores (1-25)
- Risk levels: L=Low (1-3 green) → M=Medium (4-9 yellow) → H=High (10-19 orange) → E=Extreme (20-25 red)

### Frontend
- **Matrix Page** (`/dashboard/risk/matrix`) — Interactive matrix table, score preview calculator, version display, color legend

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
