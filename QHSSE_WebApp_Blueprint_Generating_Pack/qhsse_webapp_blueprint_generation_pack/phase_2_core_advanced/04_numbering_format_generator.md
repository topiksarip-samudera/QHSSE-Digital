# PHASE 2 — CORE ADVANCED — 04. Numbering Format Generator

## Tujuan

Membangun core `Numbering Format Generator` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Custom prefix
- [ ] Running number
- [ ] Reset by year/month/site/module
- [ ] Preview
- [ ] Manual override
- [ ] Counter management

## Database / Tabel Minimal

- `numbering_rules`
- `numbering_counters`
- `numbering_histories`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /numbering-rules`
- `POST /numbering-rules/:id/preview`
- `POST /numbering-counters/:id/reset`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
numbering-format-generator.view
numbering-format-generator.create
numbering-format-generator.update
numbering-format-generator.delete
numbering-format-generator.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
numbering-format-generator.submit
numbering-format-generator.approve
numbering-format-generator.reject
numbering-format-generator.close
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

- No duplicates.
- Concurrency safe.
- Manual override audited.
- Different format per company/site/module.

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
- Status akhir ditulis: `SELESAI CORE: Numbering Format Generator`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Numbering Format Generator" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Numbering Format Generator" dan jangan lanjut core berikutnya.
```
