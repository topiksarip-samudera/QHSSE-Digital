# PHASE 2 — CORE ADVANCED — 09. Webhook Management

## Tujuan

Membangun core `Webhook Management` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Event selection
- [ ] Secret signing
- [ ] Retry
- [ ] Webhook log
- [ ] Enable/disable
- [ ] Test webhook
- [ ] Payload preview

## Database / Tabel Minimal

- `webhooks`
- `webhook_events`
- `webhook_logs`
- `webhook_retries`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /webhooks`
- `POST /webhooks/:id/test`
- `GET /webhooks/:id/logs`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
webhook-management.view
webhook-management.create
webhook-management.update
webhook-management.delete
webhook-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
webhook-management.submit
webhook-management.approve
webhook-management.reject
webhook-management.close
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

- Signature required.
- Failed webhook retry.
- Payload has event id.
- Only permitted data sent.

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
- Status akhir ditulis: `SELESAI CORE: Webhook Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Webhook Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Webhook Management" dan jangan lanjut core berikutnya.
```
