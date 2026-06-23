# SELESAI RISK SEQUENCE 02: Risk Register Core

**Date:** 2026-06-23 | **Tests:** 492 cumulative (+3 risk CRUD tests, 42 files)

## Features

### Database
- `risks` — Full risk register (risk_number, title, description, risk owner, severity/likelihood/score/level, initial + residual, status, review frequency, site/department)

### Backend API (`/api/v1/risks`)
- `POST /` — Create risk with auto-calculated score and risk level from company settings
- `GET /` — List risks (paginated, filterable by status, risk level, site, search)
- `GET /:id` — Get risk detail with tenant isolation
- `PATCH /:id` — Update draft only (recalculates score on severity/likelihood change)
- `DELETE /:id` — Soft delete draft only
- `POST /:id/submit` — Submit draft → changes status

### Risk Calculation Engine
- Score = severity × likelihood (auto-computed)
- Risk level mapped from company risk_settings.riskLevels JSON matrix
- Updates recalculated on severity/likelihood change

### Frontend (3 pages)
- **List** (`/dashboard/risk`) — Status/risk level badges, search, pagination
- **Create** (`/dashboard/risk/new`) — Title, description, owner, severity, likelihood
- **Detail** (`/dashboard/risk/[id]`) — Full info, score/level display, submit/edit/delete

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
