# PHASE 1 — CORE WAJIB — 07. Module Management ON/OFF

## Tujuan

Membangun core `Module Management ON/OFF` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Module list
- [ ] Enable/disable module per company
- [ ] Feature flags
- [ ] Role module access
- [ ] Package-based gating foundation
- [ ] Sidebar visibility

## Database / Tabel Minimal

- `modules`
- `module_features`
- `tenant_modules`
- `tenant_feature_flags`
- `role_module_access`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /modules`
- `GET/PATCH /companies/:id/modules`
- `GET/PATCH /companies/:id/features`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
module-management-on-off.view
module-management-on-off.create
module-management-on-off.update
module-management-on-off.delete
module-management-on-off.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
module-management-on-off.submit
module-management-on-off.approve
module-management-on-off.reject
module-management-on-off.close
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

- Modul OFF tidak tampil.
- API modul OFF menolak request.
- Core modules tidak boleh dimatikan.
- Subfitur bisa ON/OFF.

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
- Status akhir ditulis: `SELESAI CORE: Module Management ON/OFF`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Module Management ON/OFF" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Module Management ON/OFF" dan jangan lanjut core berikutnya.
```
