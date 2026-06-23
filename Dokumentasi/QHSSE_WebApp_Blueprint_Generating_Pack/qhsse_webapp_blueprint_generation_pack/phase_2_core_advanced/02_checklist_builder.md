# PHASE 2 — CORE ADVANCED — 02. Checklist Builder

## Tujuan

Membangun core `Checklist Builder` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Checklist template
- [ ] Sections/items
- [ ] Answer types
- [ ] Scoring/weighting
- [ ] Critical items
- [ ] Mandatory evidence/comment
- [ ] Auto finding/action
- [ ] Versioning

## Database / Tabel Minimal

- `checklists`
- `checklist_versions`
- `checklist_sections`
- `checklist_items`
- `checklist_answer_options`
- `checklist_responses`
- `checklist_response_items`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /checklists`
- `POST /checklists/:id/publish`
- `POST /checklist-responses`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
checklist-builder.view
checklist-builder.create
checklist-builder.update
checklist-builder.delete
checklist-builder.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
checklist-builder.submit
checklist-builder.approve
checklist-builder.reject
checklist-builder.close
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

- Critical bad answer can create finding/action.
- Evidence required for certain answers.
- Score calculated server-side.

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
- Status akhir ditulis: `SELESAI CORE: Checklist Builder`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Checklist Builder" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Checklist Builder" dan jangan lanjut core berikutnya.
```
