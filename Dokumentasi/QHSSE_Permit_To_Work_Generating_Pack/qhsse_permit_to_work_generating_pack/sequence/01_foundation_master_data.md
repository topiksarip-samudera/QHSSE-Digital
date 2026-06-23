# 01 — Foundation & Master Data

## Tujuan

Menyiapkan fondasi modul PTW: module registration, settings, master data, numbering, permission, default workflow, dan seed permit types.

## Scope

Sequence ini harus menghasilkan database, backend API, frontend UI, permission, audit log, test minimal, dan acceptance criteria.


## Master Data Wajib

```text
permit_type
permit_status
permit_work_category
permit_risk_level
ppe_type
tool_type
equipment_type
energy_type
isolation_type
gas_parameter
gas_test_result
loto_status
simops_status
worker_role
permit_closeout_item
suspension_reason
extension_reason
```

## Default Permit Types

```text
Hot Work
Cold Work
Working at Height
Confined Space Entry
Electrical Work
Lifting Operation
Excavation
LOTO
Radiography
Chemical Work
Line Breaking
Pressure Testing
Night Work
SIMOPS
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
SELESAI PTW SEQUENCE 01: Foundation & Master Data
```
