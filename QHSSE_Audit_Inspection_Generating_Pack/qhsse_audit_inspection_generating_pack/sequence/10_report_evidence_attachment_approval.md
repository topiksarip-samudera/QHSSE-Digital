# 10 — Report, Evidence, Attachment & Approval

## Tujuan

Membangun report generator, PDF/Excel export, approval report, attachment/evidence, comment, dan timeline.

## Scope

Sequence ini harus menghasilkan database, backend API, frontend UI, permission, audit log, test minimal, dan acceptance criteria.


## Fitur Wajib

```text
Audit report PDF
Inspection report PDF
Finding report
Evidence bundle
Attachment tab
Comment thread
Workflow approval report
Export Excel
Report preview
```


## Database yang Mungkin Dibuat/Diubah

```text
audit_programs
audit_plans
audits
inspection_plans
inspections
checklist_execution_results
checklist_execution_items
findings
finding_actions
finding_verifications
audit_reports
inspection_reports
audit_inspection_scores
audit_inspection_settings
```

Gunakan hanya tabel yang relevan untuk sequence ini. Jangan duplikasi tabel core yang sudah ada.

## API Pattern

```text
GET /api/v1/audits
POST /api/v1/audits
GET /api/v1/inspections
POST /api/v1/inspections
GET /api/v1/findings
POST /api/v1/findings
```

Tambahkan endpoint khusus sesuai sequence.

## Frontend Minimal

```text
List page
Create page
Detail page
Edit page
Status badge
Filter/search
Attachment tab jika relevan
Comment tab jika relevan
Audit trail tab jika relevan
```

## Permission

Tambahkan permission sesuai kebutuhan sequence dan pastikan backend guard aktif.

## Audit Log

Catat create/update/delete/submit/approve/reject/close/export/upload/action-assignment sesuai sequence.

## Testing Minimal

```text
Happy path
Validation error
Permission denied
Tenant isolation
Audit log created
```

## Acceptance Criteria

- Fitur sequence berjalan end-to-end.
- Tenant-safe.
- Permission backend berjalan.
- UI tidak menampilkan tombol tanpa permission.
- Audit log tercatat.
- Test minimal lulus.
- Tidak lanjut sequence berikutnya.

## Status Akhir

```text
SELESAI AUDIT INSPECTION SEQUENCE 10: Report, Evidence, Attachment & Approval
```
