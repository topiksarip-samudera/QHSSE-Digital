# PHASE 2 — CORE ADVANCED — 10. Dashboard Builder

## Tujuan

Membangun core `Dashboard Builder` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Widget builder
- [ ] Chart builder
- [ ] Data source
- [ ] Drag/drop layout
- [ ] Role/company/site dashboard
- [ ] Export/share

## Database / Tabel Minimal

- `dashboards`
- `dashboard_widgets`
- `dashboard_filters`
- `dashboard_permissions`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /dashboards`
- `POST /dashboards/:id/widgets`
- `PATCH /dashboards/:id/layout`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
dashboard-builder.view
dashboard-builder.create
dashboard-builder.update
dashboard-builder.delete
dashboard-builder.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
dashboard-builder.submit
dashboard-builder.approve
dashboard-builder.reject
dashboard-builder.close
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

- Widget follows permission.
- No cross-company data.
- Default dashboards remain.
- Custom dashboards cloneable.

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
- Status akhir ditulis: `SELESAI CORE: Dashboard Builder`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Dashboard Builder" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Dashboard Builder" dan jangan lanjut core berikutnya.
```
