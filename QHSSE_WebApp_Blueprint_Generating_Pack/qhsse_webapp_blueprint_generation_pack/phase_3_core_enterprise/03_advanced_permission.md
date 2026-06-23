# PHASE 3 — CORE ENTERPRISE — 03. Advanced Permission

## Tujuan

Membangun core `Advanced Permission` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Field-level permission
- [ ] Record-level permission
- [ ] Data masking
- [ ] Confidential records
- [ ] Temporary access
- [ ] Permission simulator

## Database / Tabel Minimal

- `field_permissions`
- `record_permissions`
- `access_policies`
- `data_masking_rules`
- `temporary_access_grants`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /access-policies`
- `POST /permission-simulator`
- `POST /temporary-access`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
advanced-permission.view
advanced-permission.create
advanced-permission.update
advanced-permission.delete
advanced-permission.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
advanced-permission.submit
advanced-permission.approve
advanced-permission.reject
advanced-permission.close
```

## Halaman Frontend Minimal

```text
List Page
Create Page
Detail Page
Edit Page
Settings Page jika relevan
Filter/Search
Pagination
Empty State
Loading State
Error State
```

## Rule Bisnis Wajib

- Backend is source of truth.
- Sensitive fields masked by default.
- Temporary access expires.
- Confidential access logged.

## Audit Log Wajib

Catat minimal:

```text
create
update
delete/archive
restore jika ada
export
import jika ada
settings change jika ada
permission change jika ada
```

Untuk data sensitif, catat juga:

```text
view sensitive data
download
admin override
```

## Validasi Backend

Backend harus memvalidasi:

```text
required fields
company scope
permission
unique constraints
status transition
file size/type jika ada upload
relationship exists
no cross-company reference
```

## Testing Minimal

Buat test untuk:

```text
create success
update success
list with company isolation
permission denied
validation error
soft delete/archive jika ada
audit log created
```

## Acceptance Criteria

Core ini dianggap selesai jika:

- Database schema dan migration selesai.
- API berjalan dan tervalidasi.
- Permission dicek di backend.
- Frontend list/create/detail/edit tersedia.
- Audit log tercatat.
- Tenant isolation aman.
- Test minimal lulus.
- Tidak ada hardcode yang harusnya configurable.
- Status akhir ditulis: `SELESAI CORE: Advanced Permission`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Advanced Permission" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Advanced Permission" dan jangan lanjut core berikutnya.
```
