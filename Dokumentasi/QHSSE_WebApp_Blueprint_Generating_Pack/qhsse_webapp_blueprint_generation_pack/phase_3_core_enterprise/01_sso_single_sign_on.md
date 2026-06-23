# PHASE 3 — CORE ENTERPRISE — 01. SSO / Single Sign-On

## Tujuan

Membangun core `SSO / Single Sign-On` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] OIDC
- [ ] SAML
- [ ] Google Workspace
- [ ] Microsoft Entra ID
- [ ] Okta/Keycloak
- [ ] Auto-provision
- [ ] Role mapping
- [ ] Domain restriction

## Database / Tabel Minimal

- `sso_providers`
- `sso_mappings`
- `sso_login_logs`
- `identity_provider_configs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /sso-providers`
- `POST /sso-providers/:id/test`
- `GET /auth/sso/:provider`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
sso-single-sign-on.view
sso-single-sign-on.create
sso-single-sign-on.update
sso-single-sign-on.delete
sso-single-sign-on.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
sso-single-sign-on.submit
sso-single-sign-on.approve
sso-single-sign-on.reject
sso-single-sign-on.close
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

- SSO per company.
- Emergency local Super Admin login.
- Unknown domain rejected.
- SSO failures logged.

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
- Status akhir ditulis: `SELESAI CORE: SSO / Single Sign-On`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "SSO / Single Sign-On" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: SSO / Single Sign-On" dan jangan lanjut core berikutnya.
```
