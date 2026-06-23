# PHASE 1 — CORE WAJIB — 06. Master Data Management

## Tujuan

Membangun core `Master Data Management` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Master data group/item
- [ ] Global template and company-specific items
- [ ] Active/inactive
- [ ] Color/code/sort order
- [ ] Parent-child item
- [ ] Import/export basic

## Database / Tabel Minimal

- `master_data_groups`
- `master_data_items`
- `master_data_item_translations`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /master-data/groups`
- `GET/POST/PATCH/DELETE /master-data/items`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
master-data-management.view
master-data-management.create
master-data-management.update
master-data-management.delete
master-data-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
master-data-management.submit
master-data-management.approve
master-data-management.reject
master-data-management.close
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

- Item yang sudah dipakai tidak hard delete.
- Company item tidak mengubah global template.
- Filter by company/module.
- Use soft delete/inactive.

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
- Status akhir ditulis: `SELESAI CORE: Master Data Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Master Data Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Master Data Management" dan jangan lanjut core berikutnya.
```
