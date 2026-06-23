# PHASE 3 — CORE ENTERPRISE — 04. Subscription, Billing & Package Management

## Tujuan

Membangun core `Subscription, Billing & Package Management` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Plans
- [ ] Feature gates
- [ ] User/site/storage/API/AI limits
- [ ] Trial
- [ ] Invoice
- [ ] Payment status
- [ ] Upgrade/downgrade
- [ ] Grace period

## Database / Tabel Minimal

- `plans`
- `plan_features`
- `subscriptions`
- `subscription_usage`
- `invoices`
- `payments`
- `billing_logs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /plans`
- `GET/PATCH /subscriptions/:companyId`
- `GET /billing/usage`
- `GET /invoices`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
subscription-billing-package-management.view
subscription-billing-package-management.create
subscription-billing-package-management.update
subscription-billing-package-management.delete
subscription-billing-package-management.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
subscription-billing-package-management.submit
subscription-billing-package-management.approve
subscription-billing-package-management.reject
subscription-billing-package-management.close
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

- Plan locks modules.
- Data not deleted on expiry.
- Storage/user limits checked.
- Grace period before suspend.

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
- Status akhir ditulis: `SELESAI CORE: Subscription, Billing & Package Management`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Subscription, Billing & Package Management" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Subscription, Billing & Package Management" dan jangan lanjut core berikutnya.
```
