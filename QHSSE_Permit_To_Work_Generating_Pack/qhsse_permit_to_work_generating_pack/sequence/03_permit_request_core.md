# 03 — Permit Request Core

## Tujuan

Membangun permit register, create/edit/detail, draft/submitted status, basic workflow, numbering, dan tenant-safe CRUD.

## Scope

Sequence ini harus menghasilkan database, backend API, frontend UI, permission, audit log, test minimal, dan acceptance criteria.


## Fitur Wajib

```text
Permit register
Create permit
Edit draft permit
Permit detail
Submit permit
Archive/cancel permit
Permit number
Basic status lifecycle
```


## Database yang Mungkin Dibuat/Diubah

```text
permit_types
permit_type_requirements
permit_settings
permits
permit_work_locations
permit_workers
permit_risk_links
permit_jsa_links
permit_ppe_requirements
permit_tool_requirements
permit_equipment_requirements
permit_competency_checks
permit_gas_tests
permit_loto_points
permit_simops_checks
permit_extensions
permit_suspensions
permit_closeouts
permit_qr_verifications
permit_reports
```

Gunakan hanya tabel yang relevan untuk sequence ini. Jangan duplikasi tabel core yang sudah ada.

## API Pattern

```text
GET /api/v1/permits
POST /api/v1/permits
GET /api/v1/permits/:id
PATCH /api/v1/permits/:id
POST /api/v1/permits/:id/submit
POST /api/v1/permits/:id/approve
POST /api/v1/permits/:id/activate
POST /api/v1/permits/:id/suspend
POST /api/v1/permits/:id/close
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
Attachment tab jika relevan
Comment tab jika relevan
Audit trail tab jika relevan
```

## Permission

Tambahkan permission sesuai kebutuhan sequence dan pastikan backend guard aktif.

## Audit Log

Catat create/update/delete/submit/review/approve/activate/extend/suspend/close/export/upload/QR verification sesuai sequence.

## Testing Minimal

```text
Happy path
Validation error
Permission denied
Tenant isolation
Audit log created
Status transition
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
SELESAI PTW SEQUENCE 03: Permit Request Core
```
