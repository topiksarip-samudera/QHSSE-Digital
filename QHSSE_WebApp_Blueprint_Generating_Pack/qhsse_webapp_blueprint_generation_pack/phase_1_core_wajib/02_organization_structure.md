# PHASE 1 — CORE WAJIB — 02. Organization Structure

## Tujuan

Membangun core `Organization Structure` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Business unit, site, project, department, section, location, position
- [ ] Organization tree
- [ ] Assign user to org unit
- [ ] Multi-site scope foundation

## Database / Tabel Minimal

- `business_units`
- `sites`
- `projects`
- `departments`
- `sections`
- `locations`
- `positions`
- `user_positions`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /sites`
- `GET/POST/PATCH /departments`
- `GET/POST/PATCH /locations`
- `GET/POST/PATCH /positions`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
organization-structure.view
organization-structure.create
organization-structure.update
organization-structure.delete
organization-structure.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
organization-structure.submit
organization-structure.approve
organization-structure.reject
organization-structure.close
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

- Site harus milik company.
- Location dipakai lintas modul.
- User bisa punya banyak site scope.
- Department bisa company-level atau site-level.

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
- Status akhir ditulis: `SELESAI CORE: Organization Structure`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Organization Structure" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Organization Structure" dan jangan lanjut core berikutnya.
```
