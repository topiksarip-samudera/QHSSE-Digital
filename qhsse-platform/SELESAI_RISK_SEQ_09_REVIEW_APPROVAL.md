# SELESAI RISK SEQUENCE 09: Risk Review, Approval Workflow & Change History

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (1 table)
- `risk_review_records` — Review audit trail (reviewed/approved/rejected/revision_requested by whom, old→new status, comment)

### Backend API (`/api/v1/risks`)
- `GET /review-queue` — Pending review risks (status=submitted)
- `POST /:id/review` — Advance to under_review
- `POST /:id/approve` — Approve risk → status approved
- `POST /:id/reject` — Return to draft with comment
- `POST /:id/request-revision` — Request revision → back to draft
- `GET /:id/review-history` — Full review timeline

### Status Flow
```
Draft → Submitted → Under Review → Approved → Active
                        ↓                ↓
                    Rejected        Revision → Draft
```

### Business Rules
- Review/approve/reject only on submitted or under_review
- All actions logged to risk_review_records
- Permission: risk.review on all mutation endpoints

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
