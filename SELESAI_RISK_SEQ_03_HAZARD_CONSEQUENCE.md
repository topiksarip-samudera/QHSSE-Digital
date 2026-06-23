# SELESAI RISK SEQUENCE 03: Hazard Identification & Consequence Library

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (5 tables)
- `hazard_categories` — Hazard grouping (Physical, Chemical, Biological, etc.)
- `hazards` — Individual hazards with category + active/inactive toggle
- `consequence_categories` — Consequence grouping
- `consequences` — Individual consequences with category
- `hazard_consequence_mappings` — Many-to-many hazard↔consequence links (upsert pattern)

### Backend API (`/api/v1/risk`)
- `GET/POST /hazard-categories` — CRUD hazard categories
- `GET/POST /hazards` — CRUD hazards, filterable by category
- `PATCH /hazards/:id/toggle` — Active/inactive toggle
- `GET/POST /consequence-categories` — CRUD consequence categories
- `GET/POST /consequences` — CRUD consequences
- `GET/POST /hazard-mappings` — Link hazard to consequence (upsert)
- `DELETE /hazard-mappings/:id` — Soft delete mapping

### Business Rules
- All data company-scoped (no cross-company data sharing)
- Hazard-consequence mappings unique per pair (upsert pattern)
- Toggle active/inactive instead of hard delete

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
