# 01 — Foundation & Master Data

## Tujuan

Menyiapkan fondasi modul Audit & Inspection: module registration, settings, master data, numbering, permission, dan default workflow.

## Scope

Sequence ini harus menghasilkan database, backend API, frontend UI, permission, audit log, test minimal, dan acceptance criteria.


## Master Data Wajib

```text
audit_type
inspection_type
finding_type
finding_category
finding_severity
finding_status
audit_status
inspection_status
audit_criteria
inspection_area
answer_rating
compliance_rating
auditor_role
inspection_frequency
```

## Settings Wajib

```text
default_audit_workflow
default_inspection_workflow
default_finding_due_days
auto_create_action_from_finding
require_evidence_for_major_nc
require_root_cause_for_major_nc
score_failed_critical_item_as_zero
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
SELESAI AUDIT INSPECTION SEQUENCE 01: Foundation & Master Data
```
