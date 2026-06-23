# PHASE 1 — CORE WAJIB — 12. Dashboard Basic

## Tujuan

Membangun core `Dashboard Basic` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Personal dashboard
- [ ] Admin dashboard
- [ ] QHSSE basic dashboard
- [ ] My tasks/approvals/notifications
- [ ] Core cards

## Database / Tabel Minimal

- `dashboard_cache_optional`
- `actions`
- `notifications`
- `workflow_instances`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET /dashboard/personal`
- `GET /dashboard/admin`
- `GET /dashboard/qhsse`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
dashboard-basic.view
dashboard-basic.create
dashboard-basic.update
dashboard-basic.delete
dashboard-basic.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
dashboard-basic.submit
dashboard-basic.approve
dashboard-basic.reject
dashboard-basic.close
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

- Dashboard follow permission/scope.
- No cross-company data.
- Cards clickable to filtered pages.
- Fast query with cache optional.

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
- Status akhir ditulis: `SELESAI CORE: Dashboard Basic`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Dashboard Basic" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Dashboard Basic" dan jangan lanjut core berikutnya.
```
