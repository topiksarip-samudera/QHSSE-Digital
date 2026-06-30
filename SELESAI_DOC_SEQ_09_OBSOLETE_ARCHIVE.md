# SELESAI DOCUMENT CONTROL SEQUENCE 09: Obsolete & Archive

**Date:** 2026-06-24 | **Tests:** 492/492 PASS

## Features

### Database
- `document_obsolete_records` — reason, obsoletedBy, obsoletedAt
- `document_archive_records` — reason, archivedBy, archivedAt

### Backend API (`/api/v1/documents`)
- `POST /documents/:id/obsolete` — Mark document as obsolete
- `POST /documents/:id/archive` — Archive obsolete document
- `POST /documents/:id/restore` — Restore archived document

### Business Rules
- Status transitions:
  - Published → Obsolete → Archived
  - Archived → Restored → Draft

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
