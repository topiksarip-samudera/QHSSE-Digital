# SELESAI PTW SEQUENCE 11: Approval, Activation, Extension & Suspension

**Date:** 2026-06-24 | **Tests:** 492 cumulative (42 files)

## Features

### Database (2 tables)
- **permit_extensions** — oldEndDate, newEndDate, requestedBy, status
- **permit_suspensions** — reason, suspendedBy, resumedBy

### Backend API
- POST /permits/:id/approve — Approve permit
- POST /permits/:id/activate — Activate permit
- POST /permits/:id/extend — Extend permit
- POST /permits/:id/suspend — Suspend permit
- POST /permits/:id/resume — Resume permit
- POST /permits/:id/close — Close permit

### Business Rules
- Submitted ↗ Approved
- Approved ↗ Active
- Active ↗ Suspended ↗ Active (resume)
- Active ↗ Extended
- Active / Extended ↗ Closed

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
