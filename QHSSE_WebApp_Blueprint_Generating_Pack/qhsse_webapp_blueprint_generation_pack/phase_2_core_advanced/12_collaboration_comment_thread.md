# PHASE 2 — CORE ADVANCED — 12. Collaboration & Comment Thread

## Tujuan

Membangun core `Collaboration & Comment Thread` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Comment/reply
- [ ] Mention
- [ ] Attachment in comment
- [ ] Internal/public note
- [ ] Notification on mention
- [ ] Soft delete comment

## Database / Tabel Minimal

- `comments`
- `comment_mentions`
- `comment_attachments`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /records/:module/:recordId/comments`
- `POST /comments/:id/reply`
- `DELETE /comments/:id`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
collaboration-comment-thread.view
collaboration-comment-thread.create
collaboration-comment-thread.update
collaboration-comment-thread.delete
collaboration-comment-thread.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
collaboration-comment-thread.submit
collaboration-comment-thread.approve
collaboration-comment-thread.reject
collaboration-comment-thread.close
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

- Internal notes hidden from contractors.
- Mention sends notification.
- Deleted comments soft-deleted.

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
- Status akhir ditulis: `SELESAI CORE: Collaboration & Comment Thread`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Collaboration & Comment Thread" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Collaboration & Comment Thread" dan jangan lanjut core berikutnya.
```
