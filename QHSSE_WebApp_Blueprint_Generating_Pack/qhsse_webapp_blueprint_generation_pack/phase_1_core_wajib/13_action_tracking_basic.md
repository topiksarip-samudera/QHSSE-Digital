# PHASE 1 — CORE WAJIB — 13. Action Tracking Basic

## Tujuan

Membangun core `Action Tracking Basic` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Create/assign action
- [ ] Due date/priority/status
- [ ] Progress update
- [ ] Evidence/comment
- [ ] Submit verification
- [ ] Verify/reject close
- [ ] Overdue

## Database / Tabel Minimal

- `actions`
- `action_comments`
- `action_evidences`
- `action_histories`
- `action_verifications`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /actions`
- `GET/PATCH /actions/:id`
- `POST /actions/:id/comment`
- `POST /actions/:id/upload-evidence`
- `POST /actions/:id/submit-verification`
- `POST /actions/:id/verify`
- `POST /actions/:id/reject`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
action-tracking-basic.view
action-tracking-basic.create
action-tracking-basic.update
action-tracking-basic.delete
action-tracking-basic.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
action-tracking-basic.submit
action-tracking-basic.approve
action-tracking-basic.reject
action-tracking-basic.close
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

- Action wajib PIC dan due date.
- Close action butuh evidence jika required.
- Verifier sebaiknya bukan PIC.
- Overdue computed automatically.

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
- Status akhir ditulis: `SELESAI CORE: Action Tracking Basic`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Action Tracking Basic" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Action Tracking Basic" dan jangan lanjut core berikutnya.
```
