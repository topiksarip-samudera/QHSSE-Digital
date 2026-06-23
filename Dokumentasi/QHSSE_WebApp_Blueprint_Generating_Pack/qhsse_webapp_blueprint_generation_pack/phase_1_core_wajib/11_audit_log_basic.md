# PHASE 1 — CORE WAJIB — 11. Audit Log Basic

## Tujuan

Membangun core `Audit Log Basic` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Track login/logout/failed login
- [ ] Track CRUD
- [ ] Track approval
- [ ] Track upload/download
- [ ] Track settings/permission/workflow changes
- [ ] Filter/export log

## Database / Tabel Minimal

- `audit_logs`
- `activity_logs`
- `login_histories`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET /audit-logs`
- `GET /audit-logs/:id`
- `GET /audit-logs/export`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
audit-log-basic.view
audit-log-basic.create
audit-log-basic.update
audit-log-basic.delete
audit-log-basic.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
audit-log-basic.submit
audit-log-basic.approve
audit-log-basic.reject
audit-log-basic.close
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

- Audit log immutable.
- Export log dicatat.
- Only authorized roles can view.
- Old/new value for update.

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
- Status akhir ditulis: `SELESAI CORE: Audit Log Basic`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Audit Log Basic" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Audit Log Basic" dan jangan lanjut core berikutnya.
```
