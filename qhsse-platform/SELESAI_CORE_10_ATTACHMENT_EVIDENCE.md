# SELESAI CORE 10: Attachment & Evidence Basic

**Status:** COMPLETE (2026-06-22)
**Tests:** 30 tests passing for attachment service, 344 cumulative tests across 14 test files

## Features Implemented

### Database
- ✅ `attachments` table — links files to records (company-scoped, soft delete)
- ✅ `files` table — file metadata storage (filename, mimeType, size, path, bucket, hash)
- ✅ `file_links` table — cross-module file linking (link one file to multiple records across modules)
- ✅ All tables have `company_id` for tenant isolation
- ✅ Indexes on `company_id`, `record_type + record_id`, `file_id`

### Backend API (`/api/v1/attachments`)
- ✅ `POST /upload` — Upload file with validation (type/size), create attachment + optional file_links
- ✅ `GET /` — List all attachments (paginated, filterable by recordType, recordId, mimeType)
- ✅ `GET /:id` — Get attachment detail (includes file info + file_links)
- ✅ `GET /:id/download` — Download file with proper Content-Type/Disposition headers
- ✅ `GET /record/:recordType/:recordId` — Get attachments by record
- ✅ `GET /records/:module/:recordType/:recordId` — Cross-module record attachments (direct + file_links)
- ✅ `GET /stats/overview` — Attachment statistics (total count, total size, by record type)
- ✅ `PATCH /:id` — Update attachment metadata (description)
- ✅ `DELETE /:id` — Soft delete attachment
- ✅ `POST /bulk-delete` — Bulk soft delete
- ✅ `POST /:id/restore` — Restore soft-deleted attachment
- ✅ `POST /file-links` — Create file link to another record
- ✅ `GET /:id/file-links` — Get file links for an attachment
- ✅ `GET /file-links/record/:module/:recordType/:recordId` — Get file links by record
- ✅ `DELETE /file-links/:fileLinkId` — Soft delete file link

### Business Rules
- ✅ File validation: allowed MIME types (images, documents, archives), max 50MB
- ✅ Company-scoped queries with tenant isolation
- ✅ Permission guards on all endpoints (`attachment-evidence-basic.*`)
- ✅ Soft delete with restore capability
- ✅ Cross-company reference prevention
- ✅ Audit logging via global `AuditLogInterceptor`

### Permissions
- ✅ `attachment-evidence-basic.view`
- ✅ `attachment-evidence-basic.create`
- ✅ `attachment-evidence-basic.update`
- ✅ `attachment-evidence-basic.delete`
- ✅ `attachment-evidence-basic.export`
- ✅ Permissions seeded in `seed.ts`

### Frontend Pages
- ✅ **List Page** (`/dashboard/attachments`) — Stats cards, filters, table with checkboxes, bulk delete, pagination
- ✅ **Upload Page** (`/dashboard/attachments/new`) — File input, record type/ID selector, description, additional linked records
- ✅ **Detail Page** (`/dashboard/attachments/[id]`) — File info, linked record, description with inline edit, download, delete, restore, file links display
- ✅ **Edit Page** (`/dashboard/attachments/[id]/edit`) — Edit description, manage file links (add/remove)
- ✅ **Settings Page** (`/dashboard/attachments/settings`) — Max file size slider, storage backend selection, allowed file types toggles

### Sidebar Navigation
- ✅ Attachments section with sub-links: All Files, Upload, Settings

### API Client
- ✅ Full `attachmentApi` in `lib/api.ts` with upload, CRUD, file links, stats, records endpoints

## Cumulative Progress
- **Cores complete:** 10/13 (Core 01-10)
- **Tests:** 344 total across 14 test files
