# PHASE 1 — CORE WAJIB — 10. Attachment & Evidence Basic

## Tujuan

Membangun core `Attachment & Evidence Basic` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Upload/download/delete
- [ ] File preview basic
- [ ] Link to record
- [ ] Metadata
- [ ] Storage local/MinIO/S3-compatible
- [ ] Allowed type/size limit

## Database / Tabel Minimal

- `attachments`
- `files`
- `file_links`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `POST /attachments/upload`
- `GET /attachments/:id`
- `GET /attachments/:id/download`
- `DELETE /attachments/:id`
- `GET /records/:module/:recordId/attachments`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
attachment-evidence-basic.view
attachment-evidence-basic.create
attachment-evidence-basic.update
attachment-evidence-basic.delete
attachment-evidence-basic.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
attachment-evidence-basic.submit
attachment-evidence-basic.approve
attachment-evidence-basic.reject
attachment-evidence-basic.close
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

- File wajib company_id.
- Download sesuai permission.
- Tidak public tanpa auth.
- Soft delete.
- Storage limit per package.

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
- Status akhir ditulis: `SELESAI CORE: Attachment & Evidence Basic`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Attachment & Evidence Basic" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Attachment & Evidence Basic" dan jangan lanjut core berikutnya.
```
