# SELESAI CORE: Import & Export Center (Phase 2 — Core 06)

**Status:** COMPLETE (2026-06-22) | **Tests:** 417 cumulative across 22 test files (+4 import-export tests)

## Features

### Database (4 tables)
- `import_jobs` — CSV upload jobs with row counts, status tracking
- `import_job_rows` — Per-row data, validation errors, import status
- `export_jobs` — Export jobs with format, file path, record count
- `export_logs` — Export audit trail (create, download, delete)

### Backend API
- `POST /api/v1/imports` — Upload CSV, auto-parse into rows with preview
- `GET /api/v1/imports/:id/preview` — Preview parsed rows
- `POST /api/v1/imports/:id/commit` — Validate and commit (row-level error reporting)
- `GET /api/v1/imports` — Import history
- `POST /api/v1/exports` — Create export job (CSV/Excel/PDF)
- `GET /api/v1/exports` — Export history with audit logs

### Frontend (2 pages)
- Import page — Upload CSV, preview, commit, import history table
- Export page — Module selection, format selector, generate export

### Business Rules
- Row-level validation with error messages
- Import status: pending → preview → committed
- Export logged with performedBy and IP

**Build:** API ✅ | Web ✅ (59 pages) | **Tests:** 417/417 PASS
