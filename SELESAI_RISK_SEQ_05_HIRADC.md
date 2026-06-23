# SELESAI RISK SEQUENCE 05: HIRADC / HIRARC Builder

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (3 new tables, replaced existing)
- `hiradc_records` — HIRADC header (title, description, department, location, assessor, status)
- `hiradc_activities` — Activity rows (name, routine/non_routine/emergency flags, sort order)
- `hiradc_hazards` — Hazard per activity with full risk calculation (hazard description, consequence, existing controls, initial severity×likelihood→score/level, additional controls, residual severity×likelihood→score/level, PIC, due date)

### Backend API (`/api/v1/hiradc`)
- `POST /` — Create HIRADC with activities
- `GET /` — List all HIRADC records
- `GET /:id` — Get detail with activities + hazards tree
- `DELETE /:id` — Soft delete (draft only)
- `POST /:id/submit` — Submit for review
- `POST /:id/activities` — Add activity row
- `POST /hazards` — Add hazard with auto-calculated initial + residual risk
- `PATCH /hazards/:hazardId` — Update hazard (recalculates risk scores)

### Risk Calculation Engine
- Initial risk: severity × likelihood → score mapped to matrix cell (level, label, color)
- Residual risk: same calculation after controls
- Uses company's `risk_matrix_definitions` table

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
