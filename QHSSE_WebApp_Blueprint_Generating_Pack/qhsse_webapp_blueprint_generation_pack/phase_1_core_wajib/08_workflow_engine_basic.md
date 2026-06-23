# PHASE 1 — CORE WAJIB — 08. Workflow Engine Basic

## Tujuan

Membangun core `Workflow Engine Basic` sebagai bagian dari PHASE 1 — CORE WAJIB. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] Workflow template
- [ ] Step
- [ ] Approver by role/user
- [ ] Sequential approval
- [ ] Submit/approve/reject/request revision
- [ ] Workflow history
- [ ] SLA basic

## Database / Tabel Minimal

- `workflows`
- `workflow_steps`
- `workflow_approvers`
- `workflow_instances`
- `workflow_instance_steps`
- `workflow_histories`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/POST/PATCH /workflows`
- `POST /workflow-instances`
- `POST /workflow-instances/:id/submit`
- `POST /workflow-instances/:id/approve`
- `POST /workflow-instances/:id/reject`
- `GET /workflow-instances/:id/history`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
workflow-engine-basic.view
workflow-engine-basic.create
workflow-engine-basic.update
workflow-engine-basic.delete
workflow-engine-basic.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
workflow-engine-basic.submit
workflow-engine-basic.approve
workflow-engine-basic.reject
workflow-engine-basic.close
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

- Workflow per module/company.
- Reject wajib comment.
- Approval tercatat audit log.
- Perubahan workflow tidak merusak instance lama.

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
- Status akhir ditulis: `SELESAI CORE: Workflow Engine Basic`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "Workflow Engine Basic" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: Workflow Engine Basic" dan jangan lanjut core berikutnya.
```
