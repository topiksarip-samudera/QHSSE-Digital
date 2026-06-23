# PHASE 3 — CORE ENTERPRISE — 05. Backup & Restore UI

## Tujuan

Membangun core `Backup & Restore UI` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Manual backup
- [ ] Scheduled backup
- [ ] DB/file/full backup
- [ ] Encryption
- [ ] Retention
- [ ] Restore request/approval
- [ ] Backup health

## Database / Tabel Minimal

- `backups`
- `backup_schedules`
- `restore_requests`
- `restore_logs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /backups`
- `POST /restore-requests`
- `POST /restore-requests/:id/approve`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
backup-restore-ui.view
backup-restore-ui.create
backup-restore-ui.update
backup-restore-ui.delete
backup-restore-ui.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
backup-restore-ui.submit
backup-restore-ui.approve
backup-restore-ui.reject
backup-restore-ui.close
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

- Production restore requires approval.
- Backup encrypted.
- Failure notification.
- Restore audited.

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
- Status akhir ditulis: `SELESAI CORE: Backup & Restore UI`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Backup & Restore UI" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Backup & Restore UI" dan jangan lanjut core berikutnya.
```
