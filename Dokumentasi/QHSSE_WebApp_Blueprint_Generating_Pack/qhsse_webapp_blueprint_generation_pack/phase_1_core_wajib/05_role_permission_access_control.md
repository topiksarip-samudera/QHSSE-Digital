# PHASE 1 — CORE WAJIB — 05. Role, Permission & Access Control

## Tujuan

Membangun core `Role, Permission & Access Control` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Role CRUD
- [ ] Permission matrix
- [ ] Assign role to user
- [ ] Assign scope to user
- [ ] RBAC + scope access
- [ ] Backend permission guard

## Database / Tabel Minimal

- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `user_scopes`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH/DELETE /roles`
- `GET /permissions`
- `POST /roles/:id/permissions`
- `POST /users/:id/roles`
- `POST /users/:id/scopes`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
role-permission-access-control.view
role-permission-access-control.create
role-permission-access-control.update
role-permission-access-control.delete
role-permission-access-control.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
role-permission-access-control.submit
role-permission-access-control.approve
role-permission-access-control.reject
role-permission-access-control.close
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

- Permission dicek backend.
- Super Admin tidak boleh dihapus.
- Company Admin tidak boleh memberi permission di atas miliknya.
- Scope: global/company/site/project/department/own/assigned/contractor.

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
- Status akhir ditulis: `SELESAI CORE: Role, Permission & Access Control`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Role, Permission & Access Control" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Role, Permission & Access Control" dan jangan lanjut core berikutnya.
```
