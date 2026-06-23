# PHASE 2 — CORE ADVANCED — 01. Form Builder

## Tujuan

Membangun core `Form Builder` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Drag/drop form designer
- [ ] Sections and fields
- [ ] Conditional fields
- [ ] Repeatable fields
- [ ] Formula
- [ ] Submission
- [ ] Versioning/publish

## Database / Tabel Minimal

- `forms`
- `form_versions`
- `form_sections`
- `form_fields`
- `form_field_options`
- `form_conditions`
- `form_submissions`
- `form_submission_values`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /forms`
- `POST /forms/:id/publish`
- `POST /forms/:id/clone`
- `POST /form-submissions`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
form-builder.view
form-builder.create
form-builder.update
form-builder.delete
form-builder.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
form-builder.submit
form-builder.approve
form-builder.reject
form-builder.close
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

- Published form immutable; change via new version.
- Submission stores form version.
- Backend validates required/conditional fields.

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
- Status akhir ditulis: `SELESAI CORE: Form Builder`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Form Builder" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Form Builder" dan jangan lanjut core berikutnya.
```
