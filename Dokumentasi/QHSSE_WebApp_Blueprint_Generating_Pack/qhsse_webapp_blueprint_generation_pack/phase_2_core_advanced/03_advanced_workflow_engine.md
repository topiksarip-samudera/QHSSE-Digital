# PHASE 2 — CORE ADVANCED — 03. Advanced Workflow Engine

## Tujuan

Membangun core `Advanced Workflow Engine` sebagai bagian dari PHASE 2 — CORE ADVANCED. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Conditional approval
- [ ] Parallel approval
- [ ] Dynamic approver
- [ ] Escalation
- [ ] Delegation
- [ ] SLA per step
- [ ] Workflow visual builder
- [ ] Simulation

## Database / Tabel Minimal

- `workflow_conditions`
- `workflow_condition_groups`
- `workflow_escalations`
- `workflow_delegations`
- `workflow_sla_rules`
- `workflow_parallel_steps`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `POST /workflows/:id/simulate`
- `POST /workflow-delegations`
- `GET /workflow-escalations`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
advanced-workflow-engine.view
advanced-workflow-engine.create
advanced-workflow-engine.update
advanced-workflow-engine.delete
advanced-workflow-engine.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
advanced-workflow-engine.submit
advanced-workflow-engine.approve
advanced-workflow-engine.reject
advanced-workflow-engine.close
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

- Workflow changes should not break old instances.
- Escalation when SLA missed.
- Delegation has expiry.

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
- Status akhir ditulis: `SELESAI CORE: Advanced Workflow Engine`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Advanced Workflow Engine" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Advanced Workflow Engine" dan jangan lanjut core berikutnya.
```
