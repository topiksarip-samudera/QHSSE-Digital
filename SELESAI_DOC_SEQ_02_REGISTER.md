# SELESAI DOCUMENT CONTROL SEQUENCE 02: Document Register Core

**Date:** 2026-06-24 | **Tests:** 492/492 PASS

## Features

### Database
- `documents` — documentNumber, title, description, documentTypeId, categoryId, ownerId, siteIds, departmentIds, confidentialityId, reviewFrequencyId, nextReviewDate, status

### Backend API (`/api/v1/documents`)
- `POST /documents` — Create document
- `GET /documents` — List all documents
- `GET /documents/:id` — Get document by ID
- `PATCH /documents/:id` — Update document
- `DELETE /documents/:id` — Delete document
- `POST /documents/:id/submit` — Submit document for review

### Business Rules
- Draft documents only can be edited/deleted
- Status flow: Draft → Submitted
- Tenant isolation enforced on all queries

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
