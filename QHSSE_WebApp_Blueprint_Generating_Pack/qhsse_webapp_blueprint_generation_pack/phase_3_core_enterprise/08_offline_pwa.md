# PHASE 3 — CORE ENTERPRISE — 08. Offline PWA

## Tujuan

Membangun core `Offline PWA` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Installable PWA
- [ ] Offline draft
- [ ] Offline checklist/inspection/action update
- [ ] Sync queue
- [ ] Conflict resolution
- [ ] Local encrypted storage
- [ ] Camera/GPS/QR

## Database / Tabel Minimal

- `sync_jobs`
- `sync_conflicts`
- `sync_logs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `POST /sync/push`
- `GET /sync/pull`
- `GET /sync/conflicts`
- `POST /sync/conflicts/:id/resolve`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
offline-pwa.view
offline-pwa.create
offline-pwa.update
offline-pwa.delete
offline-pwa.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
offline-pwa.submit
offline-pwa.approve
offline-pwa.reject
offline-pwa.close
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

- Offline data encrypted.
- Only accessed data cached.
- No duplicate sync.
- Conflict handled.

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
- Status akhir ditulis: `SELESAI CORE: Offline PWA`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Offline PWA" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Offline PWA" dan jangan lanjut core berikutnya.
```
