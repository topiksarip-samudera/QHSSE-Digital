# PHASE 3 — CORE ENTERPRISE — 06. System Health Monitoring

## Tujuan

Membangun core `System Health Monitoring` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] CPU/RAM/disk
- [ ] Database/storage
- [ ] Queue/worker
- [ ] API metrics
- [ ] Error/slow query logs
- [ ] Alert rules

## Database / Tabel Minimal

- `system_health_logs`
- `error_logs`
- `api_metrics`
- `queue_metrics`
- `worker_logs`
- `alert_rules`
- `system_alerts`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET /system-health`
- `GET /system-health/errors`
- `GET/POST /alert-rules`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
system-health-monitoring.view
system-health-monitoring.create
system-health-monitoring.update
system-health-monitoring.delete
system-health-monitoring.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
system-health-monitoring.submit
system-health-monitoring.approve
system-health-monitoring.reject
system-health-monitoring.close
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

- Critical errors alert.
- Failed jobs retryable.
- Logs retention.
- Company Admin sees own usage only.

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
- Status akhir ditulis: `SELESAI CORE: System Health Monitoring`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "System Health Monitoring" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: System Health Monitoring" dan jangan lanjut core berikutnya.
```
