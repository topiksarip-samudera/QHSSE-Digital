# SELESAI INCIDENT SEQUENCE 02: Incident Report Core

**Date:** 2026-06-22 | **Tests:** 479 cumulative (+6 incident CRUD tests, 41 files)

## Features

### Database (2 tables)
- `incidents` — Full incident report (number, title, description, date, reportedBy, site, immediateAction, status)
- `incident_status_histories` — Full audit trail of status changes

### Backend API (`/api/v1/incidents`)
- `POST /` — Create incident draft (auto-generates status history)
- `GET /` — List incidents (paginated, filterable by status, site, search, date range)
- `GET /:id` — Get detail with status history + tenant isolation
- `PATCH /:id` — Update draft only (blocks submitted)
- `DELETE /:id` — Soft delete draft only
- `POST /:id/submit` — Submit draft → status changes to submitted
- `GET /:id/status-history` — Status timeline

### Business Rules
- ✅ Draft only: edit, delete, submit restricted to draft status
- ✅ Tenant isolation: all queries scoped to companyId
- ✅ Status history logged on every status change
- ✅ Permissions: incident.create/view/update/delete/submit

### Frontend (4 pages)
- **List** (`/dashboard/incident`) — Status filter, search, paginated table
- **Create** (`/dashboard/incident/new`) — Title, description, date, site, immediate action
- **Detail** (`/dashboard/incident/[id]`) — Full info, status history timeline, submit/edit/delete buttons
- **Edit** (`/dashboard/incident/[id]/edit`) — Edit draft fields

**Build:** API ✅ | Web ✅ (86 pages) | **Tests:** 479/479 PASS
