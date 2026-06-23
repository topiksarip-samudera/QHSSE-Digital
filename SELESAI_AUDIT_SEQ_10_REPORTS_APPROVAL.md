# SELESAI AUDIT INSPECTION SEQUENCE 10: Report, Evidence, Attachment & Approval

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (2 tables)
- `audit_reports` — Audit report (JSON content: summary, findings, scores, notes) with approval workflow
- `inspection_reports` — Inspection report (JSON content) with approval workflow

### Backend API (7 endpoints)
- `POST /reports/audit/:auditId` — Generate audit report (aggregates notes, executions, findings, scores into JSON)
- `GET /reports/audit/:auditId` — Get audit report
- `POST /reports/inspection/:inspectionId` — Generate inspection report
- `GET /reports/inspection/:inspectionId` — Get inspection report
- `POST /reports/:id/submit` — Submit for approval
- `POST /reports/:id/approve` — Approve (sets approvedBy + approvedAt)
- `POST /reports/:id/reject` — Reject back to draft

### Report Content (JSON)
- Summary (notes, executions, findings counts)
- Full findings list
- Latest score
- Generation timestamp

### Approval Flow
```
Draft → Submitted → Approved
           ↓
        Rejected → Draft
```

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
