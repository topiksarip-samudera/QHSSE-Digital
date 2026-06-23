# PHASE 1 — CORE WAJIB — 03. User Management

## Tujuan

Membangun core `User Management` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Create/edit/activate/deactivate user
- [ ] Invite/reset password
- [ ] Assign company/site/department/position/role/supervisor
- [ ] User type internal/contractor/vendor/auditor/viewer
- [ ] Login history and profile

## Database / Tabel Minimal

- `users`
- `user_profiles`
- `user_company_assignments`
- `user_site_assignments`
- `user_department_assignments`
- `login_histories`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /users`
- `GET/PATCH/DELETE /users/:id`
- `POST /users/:id/activate`
- `POST /users/:id/deactivate`
- `POST /users/:id/assign-role`
- `POST /users/:id/assign-scope`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
user-management.view
user-management.create
user-management.update
user-management.delete
user-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
user-management.submit
user-management.approve
user-management.reject
user-management.close
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

- Email unik.
- Inactive user tidak bisa login.
- Contractor restricted by assigned scope.
- Company Admin hanya kelola user company sendiri.

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
- Status akhir ditulis: `SELESAI CORE: User Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "User Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: User Management" dan jangan lanjut core berikutnya.
```
