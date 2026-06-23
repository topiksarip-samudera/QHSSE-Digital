# SELESAI INCIDENT SEQUENCE 09: Evidence, Attachment, Comment & Timeline

**Date:** 2026-06-23 | **Tests:** 486 cumulative (41 files)

## Features

### Database (1 new table)
- `incident_timeline_events` — Full incident timeline (status_change, comment, evidence_added, review, investigation, rca, capa, close)

### Bridge to Core Modules
- **Attachments**: `GET /:id/attachments` — Queries core `attachments` table (recordType='incident')
- **Comments**: `GET /:id/comments` — Queries core `comments` table (module='incident')
- **Audit Logs**: `GET /:id/audit-logs` — Queries core `audit_logs` by recordId
- **Timeline**: `GET /:id/timeline` — Dedicated timeline events table

### Backend API (4 endpoints)
All company-scoped with `incident.view` permission.

**Build:** API ✅ | Web ✅ | **Tests:** 486/486 PASS
