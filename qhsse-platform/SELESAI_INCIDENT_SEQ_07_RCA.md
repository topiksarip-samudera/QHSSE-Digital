# SELESAI INCIDENT SEQUENCE 07: Root Cause Analysis

**Date:** 2026-06-23 | **Tests:** 486 cumulative (41 files)

## Features

### Database (5 tables)
- `incident_root_causes` — Root cause summary with cause category, verified flag
- `incident_5why` — Step-ordered 5-Why analysis
- `incident_fishbones` — Fishbone/Ishikawa per category (people/equipment/procedure/environment/management/measurement)
- `incident_cause_factors` — Detailed factor breakdown with contribution level
- `incident_rca_reviews` — RCA review/approval pending/approved/rejected

### Backend API (7 endpoints)
- `GET /:id/rca` — Full RCA data (root causes + 5Whys + fishbones + factors + reviews)
- `PATCH /:id/rca` — Create/update root cause entry
- `POST /:id/rca/5why` — Add 5-Why step
- `POST /:id/rca/fishbone` — Add fishbone dimension
- `POST /:id/rca/factors` — Add cause factor
- `POST /:id/rca/submit` — Submit RCA → capa_in_progress
- `POST /:id/rca/review` — Review RCA (pending/approved/rejected)

**Build:** API ✅ | Web ✅ | **Tests:** 486/486 PASS
