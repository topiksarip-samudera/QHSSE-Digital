# SELESAI RISK SEQUENCE 06: JSA / JHA Builder

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (2 new tables + leverage existing)
- `JsaTemplate` — JSA header (title, job title, department, site, status) — existing ✅
- `JsaStep` — Job steps with step number — existing ✅
- `jsa_step_hazards` — Hazard per step with initial risk calculation (severity×likelihood→score/level)
- `jsa_step_controls` — Controls per step (elimination/substitution/engineering/administrative/PPE, PPE requirement)

### Backend API (`/api/v1/jsa`)
- `POST /` — Create JSA record
- `GET /` — List all JSA records
- `GET /:id` — Get detail with steps → hazards + controls tree
- `DELETE /:id` — Soft delete (draft only)
- `POST /:id/submit` — Submit for review
- `POST /:id/steps` — Add job step (auto-numbers)
- `POST /steps/:stepId/hazards` — Add hazard with auto risk scoring
- `POST /steps/:stepId/controls` — Add control with type classification

### Risk Calculation
- Uses company's risk matrix for severity×likelihood→score/level mapping
- Controls classified by hierarchy: elimination, substitution, engineering, administrative, PPE

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
