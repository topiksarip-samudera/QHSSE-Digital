# PHASE 3 — CORE ENTERPRISE — 12. Enterprise Reporting

## Tujuan

Membangun core `Enterprise Reporting` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Report builder
- [ ] Scheduled reports
- [ ] Executive reports
- [ ] Monthly QHSSE report
- [ ] Site/contractor comparison
- [ ] KPI trends
- [ ] Distribution list

## Database / Tabel Minimal

- `report_templates`
- `scheduled_reports`
- `report_runs`
- `report_recipients`
- `report_exports`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /report-templates`
- `GET/POST /scheduled-reports`
- `POST /reports/:id/run`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
enterprise-reporting.view
enterprise-reporting.create
enterprise-reporting.update
enterprise-reporting.delete
enterprise-reporting.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
enterprise-reporting.submit
enterprise-reporting.approve
enterprise-reporting.reject
enterprise-reporting.close
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

- Reports follow permission.
- Distribution logged.
- Report approval optional.
- Multi-site aggregate for executives.

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
- Status akhir ditulis: `SELESAI CORE: Enterprise Reporting`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Enterprise Reporting" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Enterprise Reporting" dan jangan lanjut core berikutnya.
```
