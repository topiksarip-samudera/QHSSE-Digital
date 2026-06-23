# PHASE 1 — CORE WAJIB — 01. Multi-Company / Tenant Management

## Tujuan

Membangun core `Multi-Company / Tenant Management` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Create/edit/suspend company
- [ ] Company profile and settings
- [ ] Tenant data isolation
- [ ] Company logo/code/timezone/language/date format
- [ ] Company-level module/settings foundation

## Database / Tabel Minimal

- `tenants`
- `companies`
- `company_settings`
- `company_users`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET /companies`
- `POST /companies`
- `GET /companies/:id`
- `PATCH /companies/:id`
- `GET /companies/:id/settings`
- `PATCH /companies/:id/settings`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
multi-company-tenant-management.view
multi-company-tenant-management.create
multi-company-tenant-management.update
multi-company-tenant-management.delete
multi-company-tenant-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
multi-company-tenant-management.submit
multi-company-tenant-management.approve
multi-company-tenant-management.reject
multi-company-tenant-management.close
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

- Semua data bisnis wajib memiliki company_id.
- Company inactive/suspended tidak boleh login.
- Company code unik.
- Super Admin boleh cross-company dengan audit log.

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
- Status akhir ditulis: `SELESAI CORE: Multi-Company / Tenant Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Multi-Company / Tenant Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Multi-Company / Tenant Management" dan jangan lanjut core berikutnya.
```
