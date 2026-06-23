# PHASE 1 — CORE WAJIB — 09. Notification Basic

## Tujuan

Membangun core `Notification Basic` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] In-app notification
- [ ] Email notification
- [ ] Template basic
- [ ] Read/unread
- [ ] Notification event
- [ ] Reminder basic

## Database / Tabel Minimal

- `notifications`
- `notification_templates`
- `notification_logs`
- `notification_preferences`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET /notifications`
- `GET /notifications/unread-count`
- `POST /notifications/:id/read`
- `POST /notifications/read-all`
- `GET/PATCH /notification-templates`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
notification-basic.view
notification-basic.create
notification-basic.update
notification-basic.delete
notification-basic.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
notification-basic.submit
notification-basic.approve
notification-basic.reject
notification-basic.close
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

- Approval request menghasilkan notification.
- Action overdue menghasilkan reminder.
- Template editable.
- Delivery log tercatat.

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
- Status akhir ditulis: `SELESAI CORE: Notification Basic`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Notification Basic" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Notification Basic" dan jangan lanjut core berikutnya.
```
