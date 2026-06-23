# PHASE 3 — CORE ENTERPRISE — 11. Compliance & Control Center

## Tujuan

Membangun core `Compliance & Control Center` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Access review
- [ ] Permission review
- [ ] Admin activity review
- [ ] Data export review
- [ ] Inactive user review
- [ ] Policy acknowledgement
- [ ] Compliance score

## Database / Tabel Minimal

- `access_reviews`
- `permission_reviews`
- `policy_acknowledgements`
- `admin_activity_reviews`
- `compliance_scores`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST /access-reviews`
- `GET/POST /permission-reviews`
- `GET /compliance-score`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
compliance-control-center.view
compliance-control-center.create
compliance-control-center.update
compliance-control-center.delete
compliance-control-center.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
compliance-control-center.submit
compliance-control-center.approve
compliance-control-center.reject
compliance-control-center.close
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

- Admin access reviewed periodically.
- High-risk permissions flagged.
- Inactive user auto-disable optional.
- Sensitive export approval.

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
- Status akhir ditulis: `SELESAI CORE: Compliance & Control Center`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Compliance & Control Center" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Compliance & Control Center" dan jangan lanjut core berikutnya.
```
