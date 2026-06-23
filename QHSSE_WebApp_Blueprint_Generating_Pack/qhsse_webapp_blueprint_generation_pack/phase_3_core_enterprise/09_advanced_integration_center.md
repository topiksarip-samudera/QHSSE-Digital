# PHASE 3 — CORE ENTERPRISE — 09. Advanced Integration Center

## Tujuan

Membangun core `Advanced Integration Center` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Integration catalog
- [ ] Connector config
- [ ] Credential encryption
- [ ] Field/data mapping
- [ ] Sync schedule
- [ ] Manual sync
- [ ] Sync log/error/retry

## Database / Tabel Minimal

- `integrations`
- `integration_configs`
- `integration_mappings`
- `integration_sync_jobs`
- `integration_sync_logs`
- `integration_errors`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /integrations`
- `POST /integrations/:id/test`
- `POST /integrations/:id/sync`
- `GET /integrations/:id/logs`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
advanced-integration-center.view
advanced-integration-center.create
advanced-integration-center.update
advanced-integration-center.delete
advanced-integration-center.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
advanced-integration-center.submit
advanced-integration-center.approve
advanced-integration-center.reject
advanced-integration-center.close
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

- Credentials encrypted.
- Per company config.
- Mapping testable.
- Errors clear and retryable.

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
- Status akhir ditulis: `SELESAI CORE: Advanced Integration Center`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Advanced Integration Center" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Advanced Integration Center" dan jangan lanjut core berikutnya.
```
