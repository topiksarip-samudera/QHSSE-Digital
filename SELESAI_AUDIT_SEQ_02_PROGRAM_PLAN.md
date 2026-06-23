# SELESAI AUDIT INSPECTION SEQUENCE 02: Audit Program & Audit Plan

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (3 tables)
- `audit_programs` — Annual/quarterly audit programs (title, description, period, objectives, scope, status)
- `audit_plans` — Detailed audit plans (linked to program, date, duration, lead auditor, site, department)
- `audits` — Individual audits (linked to program/plan, audit type, criteria, team, auditee, start/end dates, score)

### Backend API (14 endpoints)
**Programs:** `POST/GET/:id/PATCH/DELETE /audit-programs`
**Plans:** `POST/GET/:id/DELETE /audit-plans` (filterable by programId)
**Audits:** `POST/GET/:id/PATCH/DELETE /audits` (filterable by planId/programId)

### Hierarchy
```
AuditProgram (1) → AuditPlan (N) → Audit (N)
AuditProgram (1) → Audit (N) directly
```

### Business Rules
- All data company-scoped (tenant isolation)
- Permission guards on all 14 endpoints (`audit.*`)
- Soft delete pattern (status → closed/cancelled)

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
