# 12 — QA, Test, Permission & Stabilization

## Tujuan

Menjalankan QA menyeluruh, tenant isolation, permission, revision, workflow, file security, QR, audit log, report export, dan release gate.

## Scope

Sequence ini harus menghasilkan database, backend API, frontend UI, permission, audit log, test minimal, dan acceptance criteria.


## QA Wajib

```text
Tenant isolation
Permission backend
File security
Revision control
Published immutable
Workflow
Distribution
Acknowledgement
Controlled copy
Obsolete/archive
QR verification
Audit log
Dashboard calculation
Report export
Regression
```


## Database yang Mungkin Dibuat/Diubah

```text
document_types
document_categories
document_settings
documents
document_metadata
document_revisions
document_files
document_reviewers
document_approvers
document_distributions
document_acknowledgements
document_controlled_copies
document_obsolete_records
document_archive_records
document_qr_codes
document_access_logs
document_download_logs
document_links
document_reports
```

Gunakan hanya tabel yang relevan untuk sequence ini. Jangan duplikasi tabel core yang sudah ada.

## API Pattern

```text
GET /api/v1/documents
POST /api/v1/documents
GET /api/v1/documents/:id
PATCH /api/v1/documents/:id
POST /api/v1/documents/:id/revisions
POST /api/v1/document-revisions/:revisionId/submit-review
POST /api/v1/document-revisions/:revisionId/approve
POST /api/v1/document-revisions/:revisionId/publish
```

Tambahkan endpoint khusus sesuai sequence.

## Frontend Minimal

```text
List page
Create/update form or wizard step
Detail tab
Status badge
Filter/search
Validation message
File preview jika relevan
Attachment/file tab jika relevan
Comment tab jika relevan
Audit trail tab jika relevan
```

## Permission

Tambahkan permission sesuai kebutuhan sequence dan pastikan backend guard aktif.

## Audit Log

Catat create/update/delete/upload/download/submit/review/approve/publish/distribute/acknowledge/obsolete/archive/restore/export sesuai sequence.

## Testing Minimal

```text
Happy path
Validation error
Permission denied
Tenant isolation
Audit log created
Status transition
File access security jika relevan
```

## Acceptance Criteria

- Fitur sequence berjalan end-to-end.
- Tenant-safe.
- Permission backend berjalan.
- UI tidak menampilkan tombol tanpa permission.
- Audit log tercatat.
- Published document immutable jika relevan.
- Test minimal lulus.
- Tidak lanjut sequence berikutnya.

## Status Akhir

```text
SELESAI DOCUMENT CONTROL SEQUENCE 12: QA, Test, Permission & Stabilization
```
