# SELESAI INCIDENT SEQUENCE 05: Initial Review & Workflow

**Date:** 2026-06-23 | **Tests:** 485 cumulative (+2 review tests, 41 files)

## Features

### Database (2 new tables)
- `incident_review_records` — Review audit trail (reviewed/rejected/revision_requested/approved by whom, comments, old→new status)
- `incident_investigator_assignments` — Investigator assignment with due date and status (assigned/in_progress/completed)

### Backend API (6 endpoints)
- `GET /incidents/review-queue` — List incidents pending review (status=submitted)
- `POST /incidents/:id/review` — Advance to under_review
- `POST /incidents/:id/reject` — Return to draft with comment
- `POST /incidents/:id/request-revision` — Return to draft for revision
- `POST /incidents/:id/assign-investigator` — Assign investigator, advance to investigation status
- `GET /incidents/:id/workflow` — Full review history (records + assignments + status timeline)

### Status Flow
```
Draft → Submitted → Under Review → Investigation → ...
            ↓              ↓
         Rejected    Request Revision → Draft
```

### Business Rules
- Review only allowed on submitted status
- Investigators only assignable on under_review status
- All review actions logged to incident_review_records + incident_status_histories
- Permission: incident.view/review/investigate

**Build:** API ✅ | Web ✅ | **Tests:** 485/485 PASS
