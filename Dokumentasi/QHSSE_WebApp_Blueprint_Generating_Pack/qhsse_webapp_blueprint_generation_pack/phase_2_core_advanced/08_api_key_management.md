# PHASE 2 — CORE ADVANCED — 08. API Key Management

## Tujuan

Membangun core `API Key Management` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Create/revoke/rotate API key
- [ ] Scope
- [ ] Rate limit
- [ ] Expiry
- [ ] Last used
- [ ] Usage log
- [ ] API docs

## Database / Tabel Minimal

- `api_keys`
- `api_key_scopes`
- `api_usage_logs`
- `rate_limits`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /api-keys`
- `POST /api-keys/:id/revoke`
- `POST /api-keys/:id/rotate`
- `GET /api-keys/:id/usage`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
api-key-management.view
api-key-management.create
api-key-management.update
api-key-management.delete
api-key-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
api-key-management.submit
api-key-management.approve
api-key-management.reject
api-key-management.close
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

- API key displayed once.
- API key hashed.
- Scope enforced.
- Usage logged.

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
- Status akhir ditulis: `SELESAI CORE: API Key Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "API Key Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: API Key Management" dan jangan lanjut core berikutnya.
```
