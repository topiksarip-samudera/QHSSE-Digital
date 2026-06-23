# PHASE 3 — CORE ENTERPRISE — 07. AI Governance

## Tujuan

Membangun core `AI Governance` sebagai bagian dari PHASE 3 — CORE ENTERPRISE. Core ini harus production-grade, multi-tenant, aman, dan siap digunakan oleh modul QHSSE lain.

## Fitur yang Harus Dibuat

- [ ] AI ON/OFF global/company/module/role
- [ ] AI permission
- [ ] Prompt templates
- [ ] Knowledge sources
- [ ] Usage logs
- [ ] Output review
- [ ] Sensitive data redaction
- [ ] Provider config

## Database / Tabel Minimal

- `ai_settings`
- `ai_permissions`
- `ai_prompt_templates`
- `ai_knowledge_sources`
- `ai_usage_logs`
- `ai_output_reviews`
- `ai_provider_configs`

Catatan:
- Tambahkan `company_id` untuk data tenant-specific.
- Tambahkan `created_at`, `updated_at`, `deleted_at` jika perlu soft delete.
- Tambahkan `created_by`, `updated_by` untuk record penting.
- Pastikan index untuk `company_id`, `status`, dan field pencarian utama.

## API Minimal

- `GET/PATCH /ai/settings`
- `GET/POST /ai/prompt-templates`
- `GET /ai/usage-logs`
- `POST /ai/output-reviews`

Gunakan prefix `/api/v1`.

## Permission Minimal

```text
ai-governance.view
ai-governance.create
ai-governance.update
ai-governance.delete
ai-governance.export
```

Jika core ini memiliki approval/workflow, tambahkan:

```text
ai-governance.submit
ai-governance.approve
ai-governance.reject
ai-governance.close
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

- AI cannot approve/close/delete.
- All AI output logged.
- Sensitive data masked.
- Usage limited by plan.

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
- Status akhir ditulis: `SELESAI CORE: AI Governance`.

## Prompt Lanjutan untuk AI Agent

```text
Implementasikan core "AI Governance" sesuai file panduan ini.
Ikuti generating rules global.
Selesaikan database, backend, frontend, permission, audit log, dan test.
Setelah selesai, tulis "SELESAI CORE: AI Governance" dan jangan lanjut core berikutnya.
```
