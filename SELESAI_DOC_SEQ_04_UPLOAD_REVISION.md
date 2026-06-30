# SELESAI DOCUMENT CONTROL SEQUENCE 04: Upload, Draft & Revisions

**Date:** 2026-06-24 | **Tests:** 492/492 PASS

## Features

### Database
- `document_revisions` — revisionNumber, changeSummary, fileId, status
- `document_files` — attachmentId, fileName, fileSize, fileType, version, uploadedBy

### Backend API (`/api/v1/documents`)
- `POST /documents/:id/revisions` — Create revision
- `GET /documents/:id/revisions` — List revisions
- `POST /documents/:id/files` — Upload file
- `GET /documents/:id/files` — List files

### Business Rules
- Revision number auto-increments per document
- Files linked to specific revisions

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
