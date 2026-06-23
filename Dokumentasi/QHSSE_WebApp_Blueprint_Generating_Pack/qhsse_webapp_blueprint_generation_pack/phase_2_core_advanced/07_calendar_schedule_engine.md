# PHASE 2 — CORE ADVANCED — 07. Calendar & Schedule Engine

## Tujuan

Membangun core `Calendar & Schedule Engine` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Audit/inspection/training/drill schedules
- [ ] Recurring schedules
- [ ] Reminder
- [ ] Auto-generate action
- [ ] Calendar/list/timeline views

## Database / Tabel Minimal

- `schedules`
- `schedule_occurrences`
- `schedule_reminders`
- `recurrence_rules`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /schedules`
- `GET /schedule-occurrences`
- `POST /schedules/:id/generate-occurrences`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
calendar-schedule-engine.view
calendar-schedule-engine.create
calendar-schedule-engine.update
calendar-schedule-engine.delete
calendar-schedule-engine.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
calendar-schedule-engine.submit
calendar-schedule-engine.approve
calendar-schedule-engine.reject
calendar-schedule-engine.close
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

- Occurrences old not deleted.
- Reminder before due.
- Recurring rule supports daily-weekly-monthly-quarterly-yearly.

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
- Status akhir ditulis: `SELESAI CORE: Calendar & Schedule Engine`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Calendar & Schedule Engine" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Calendar & Schedule Engine" dan jangan lanjut core berikutnya.
```
