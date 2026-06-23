# PHASE 3 — CORE ENTERPRISE — 02. MFA / Multi-Factor Authentication

## Tujuan

Membangun core `MFA / Multi-Factor Authentication` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] TOTP
- [ ] Email OTP
- [ ] Recovery codes
- [ ] Trusted devices
- [ ] Force MFA per company/role
- [ ] Admin reset MFA

## Database / Tabel Minimal

- `mfa_settings`
- `mfa_secrets`
- `recovery_codes`
- `trusted_devices`
- `mfa_logs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `POST /mfa/setup`
- `POST /mfa/verify`
- `POST /mfa/disable`
- `GET /mfa/recovery-codes`
- `POST /admin/users/:id/reset-mfa`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
mfa-multi-factor-authentication.view
mfa-multi-factor-authentication.create
mfa-multi-factor-authentication.update
mfa-multi-factor-authentication.delete
mfa-multi-factor-authentication.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
mfa-multi-factor-authentication.submit
mfa-multi-factor-authentication.approve
mfa-multi-factor-authentication.reject
mfa-multi-factor-authentication.close
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

- Admin roles should require MFA.
- Recovery codes shown once.
- MFA reset audited.

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
- Status akhir ditulis: `SELESAI CORE: MFA / Multi-Factor Authentication`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "MFA / Multi-Factor Authentication" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: MFA / Multi-Factor Authentication" dan jangan lanjut core berikutnya.
```
