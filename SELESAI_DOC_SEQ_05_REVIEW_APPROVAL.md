# SELESAI DOCUMENT CONTROL SEQUENCE 05: Review & Approval Workflow

**Date:** 2026-06-24 | **Tests:** 492/492 PASS

## Features

### Backend API (`/api/v1/documents`)
- `POST /documents/:id/approve` — Approve document
- `POST /documents/:id/reject` — Reject document
- `POST /documents/:id/publish` — Publish document

### Business Rules
- Status transitions:
  - Submitted → Approved
  - Submitted / Under Review → Rejected → Draft
  - Approved → Published

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
