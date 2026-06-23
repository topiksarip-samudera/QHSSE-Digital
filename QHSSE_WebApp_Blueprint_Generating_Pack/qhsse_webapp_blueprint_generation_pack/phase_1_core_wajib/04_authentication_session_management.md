# PHASE 1 — CORE WAJIB — 04. Authentication & Session Management

## Tujuan

Membangun core `Authentication & Session Management` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Login/logout
- [ ] Refresh token
- [ ] Forgot/reset/change password
- [ ] Password policy
- [ ] Account lock
- [ ] Force logout
- [ ] Session list

## Database / Tabel Minimal

- `users`
- `sessions`
- `refresh_tokens`
- `password_reset_tokens`
- `login_histories`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`
- `GET /auth/me`
- `GET /auth/sessions`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
authentication-session-management.view
authentication-session-management.create
authentication-session-management.update
authentication-session-management.delete
authentication-session-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
authentication-session-management.submit
authentication-session-management.approve
authentication-session-management.reject
authentication-session-management.close
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

- Password hashed.
- Token expiry.
- Failed login logged.
- Refresh token revocable.
- Inactive/suspended company cannot login.

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
- Status akhir ditulis: `SELESAI CORE: Authentication & Session Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Authentication & Session Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Authentication & Session Management" dan jangan lanjut core berikutnya.
```
