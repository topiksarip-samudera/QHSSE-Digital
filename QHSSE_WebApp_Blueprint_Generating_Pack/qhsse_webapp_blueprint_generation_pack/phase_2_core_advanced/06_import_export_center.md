# PHASE 2 — CORE ADVANCED — 06. Import & Export Center

## Tujuan

Membangun core `Import & Export Center` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Download template
- [ ] Upload Excel/CSV
- [ ] Preview import
- [ ] Validation
- [ ] Error report
- [ ] Import history
- [ ] Export filtered/selected/PDF/Excel

## Database / Tabel Minimal

- `import_jobs`
- `import_job_rows`
- `export_jobs`
- `export_logs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `POST /imports`
- `GET /imports/:id/preview`
- `POST /imports/:id/commit`
- `POST /exports`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
import-export-center.view
import-export-center.create
import-export-center.update
import-export-center.delete
import-export-center.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
import-export-center.submit
import-export-center.approve
import-export-center.reject
import-export-center.close
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

- Validate before import.
- Big import via queue.
- Sensitive export audited.
- Clear row-level error.

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
- Status akhir ditulis: `SELESAI CORE: Import & Export Center`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Import & Export Center" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Import & Export Center" dan jangan lanjut core berikutnya.
```
