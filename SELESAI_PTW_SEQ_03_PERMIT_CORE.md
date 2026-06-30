# SELESAI PTW SEQUENCE 03: Permit Request Core

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (3 tables)
- **permits** — permit_number, permit_type, title, description, site, department, area, start/end date, applicant, supervisor, issuer, status
- **permit_work_locations** — permit_id, name, description, sortOrder
- **permit_workers** — permit_id, userId, fullName, role, competency

### Backend API
- POST /permits — Create permit
- GET /permits — List permits
- GET /permits/:id — Get permit detail
- PATCH /permits/:id — Update permit
- DELETE /permits/:id — Delete permit
- POST /permits/:id/submit — Submit for approval
- POST /permits/:id/locations — Add work locations
- POST /permits/:id/workers — Add workers
- DELETE /permits/:id/workers/:id — Remove worker

### Business Rules
- Draft only — edit/delete restricted to Draft status
- Status: Draft ↗ Submitted
- Tenant isolation enforced on all queries
- Permission guards on all endpoints

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
