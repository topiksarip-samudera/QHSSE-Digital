# PHASE 3 — CORE ENTERPRISE — 10. Data Retention, Archive & Legal Hold

## Tujuan

Membangun core `Data Retention, Archive & Legal Hold` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Retention policy
- [ ] Auto/manual archive
- [ ] Restore archived data
- [ ] Legal hold
- [ ] Purge request/approval
- [ ] Export before purge

## Database / Tabel Minimal

- `retention_policies`
- `archive_records`
- `legal_holds`
- `purge_requests`
- `purge_logs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /retention-policies`
- `POST /archive`
- `POST /legal-holds`
- `POST /purge-requests`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
data-retention-archive-legal-hold.view
data-retention-archive-legal-hold.create
data-retention-archive-legal-hold.update
data-retention-archive-legal-hold.delete
data-retention-archive-legal-hold.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
data-retention-archive-legal-hold.submit
data-retention-archive-legal-hold.approve
data-retention-archive-legal-hold.reject
data-retention-archive-legal-hold.close
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

- Legal hold cannot be deleted.
- Purge requires approval.
- Archive not delete.
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
- Status akhir ditulis: `SELESAI CORE: Data Retention, Archive & Legal Hold`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Data Retention, Archive & Legal Hold" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Data Retention, Archive & Legal Hold" dan jangan lanjut core berikutnya.
```
