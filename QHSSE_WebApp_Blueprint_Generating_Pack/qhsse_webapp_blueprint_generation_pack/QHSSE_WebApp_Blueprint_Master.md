# START HERE — QHSSE WebApp Blueprint & Generating Pack

Tanggal: 2026-06-21  
Project: QHSSE Integrated Management System WebApp

Paket ini dibuat untuk membantu AI Agent di VS Code menghasilkan WebApp QHSSE secara terstruktur, tidak lompat-lompat, dan tidak meninggalkan core penting.

## Rekomendasi Cara Pakai

Gunakan **mode sequence**. Jangan langsung generate semua modul sekaligus.

Urutan terbaik:

1. Baca `00_PROMPT_AWAL_UNTUK_AI_AGENT.md`
2. Baca `01_MASTER_BLUEPRINT.md`
3. Baca `02_REKOMENDASI_STACK_DAN_ARSITEKTUR.md`
4. Baca `03_GENERATING_RULES_GLOBAL.md`
5. Generate project foundation.
6. Lanjutkan `phase_1_core_wajib/00_PHASE_1_SEQUENCE.md`
7. Selesaikan satu core, jalankan test, baru lanjut core berikutnya.
8. Setelah Phase 1 selesai dan stabil, lanjut Phase 2.
9. Setelah Phase 2 selesai dan stabil, lanjut Phase 3.
10. Setelah semua phase selesai, gunakan folder `qa_acceptance/` untuk validasi akhir.

## Kenapa Harus Split

Project QHSSE terlalu besar jika digenerate sekaligus. Risiko jika tidak split:

- Struktur database berantakan.
- Permission tidak konsisten.
- Workflow tidak reusable.
- Modul QHSSE jadi hardcoded.
- Multi-tenant mudah bocor data.
- AI agent lupa acceptance criteria.
- UI tidak konsisten.
- Testing tidak lengkap.

## Strategi Terbaik

Gunakan struktur:

```text
Phase 1 = Core wajib agar sistem bisa dipakai
Phase 2 = Core advanced agar sistem bisa dikustom
Phase 3 = Core enterprise agar sistem siap SaaS besar
```

## Output yang Ditargetkan

WebApp QHSSE modular dengan:

- Multi-company / multi-tenant
- Multi-site / multi-project
- Role, permission, dan scope access
- Module ON/OFF
- Master data dinamis
- Workflow approval engine
- Form builder
- Checklist builder
- Action tracking
- Attachment evidence
- Audit trail
- Notification
- API key
- Webhook
- Dashboard builder
- SSO, MFA, advanced permission
- Billing SaaS
- AI Governance
- Offline PWA
- Integration center
- Enterprise reporting


---

# PROMPT AWAL SINGKAT UNTUK AI AGENT

Ekstrak dan baca seluruh file dalam folder `qhsse_webapp_blueprint_generation_pack`.

Tugas kamu adalah membangun WebApp QHSSE sesuai blueprint secara sequence.

Aturan wajib:
1. Jangan langsung generate semua sekaligus.
2. Mulai dari `01_MASTER_BLUEPRINT.md`, lalu `02_REKOMENDASI_STACK_DAN_ARSITEKTUR.md`, lalu `03_GENERATING_RULES_GLOBAL.md`.
3. Setelah memahami blueprint, mulai Phase 1 dari `phase_1_core_wajib/00_PHASE_1_SEQUENCE.md`.
4. Selesaikan satu core sampai database, backend API, frontend UI, permission, audit log, test, dan acceptance criteria terpenuhi.
5. Setelah satu core selesai, berikan status `SELESAI CORE: <nama core>` dan jangan lanjut core berikutnya sebelum diminta.
6. Gunakan prinsip modular, multi-tenant, secure-by-default, audit-log-by-default, dan permission-check-in-backend.
7. Jangan hardcode workflow, master data, checklist, form, role, dan module access jika bisa dibuat dinamis.
8. Semua fitur harus siap ON/OFF per company, role, package, dan module jika relevan.
9. Buat kode production-grade, bukan prototype kosong.
10. Jika ada pilihan teknis, gunakan rekomendasi dalam file stack dan arsitektur.

Mulai dengan membuat rencana implementasi Phase 1 dan scaffold project sesuai blueprint.


---

# 01 — MASTER BLUEPRINT WEBAPP QHSSE

## Visi Produk

WebApp QHSSE ini adalah platform manajemen terintegrasi untuk Quality, Health, Safety, Security, dan Environment. Sistem harus menjadi pusat data untuk risiko, insiden, permit, audit, inspeksi, dokumen, training, compliance, environment, quality, security, contractor, action tracking, evidence, dan reporting.

## Prinsip Utama

1. Modular: semua modul bisa ON/OFF.
2. Multi-tenant: data antar company harus terisolasi.
3. Multi-site: setiap company bisa punya banyak site, project, department, dan location.
4. Workflow-driven: approval tidak boleh hardcoded.
5. Evidence-driven: setiap record penting bisa punya attachment dan bukti.
6. Audit-ready: semua perubahan penting harus tercatat.
7. Role-and-scope based: permission harus dicek di backend.
8. Configurable: form, checklist, numbering, template, workflow harus bisa dikustom.
9. Mobile-first: lapangan harus nyaman lewat PWA/mobile browser.
10. AI-assisted, not AI-controlled: AI hanya memberi draft/rekomendasi, tidak approve/close/delete.

## Modul Produk Besar

### Core Platform

- Company / tenant management
- Organization structure
- User management
- Authentication
- Role & permission
- Master data
- Module management
- Workflow engine
- Notification
- Attachment & evidence
- Audit log
- Dashboard
- Action tracking
- Form builder
- Checklist builder
- Numbering generator
- Template management
- Import/export
- Calendar/schedule
- API key
- Webhook
- Global search
- Collaboration
- SSO/MFA
- Billing/subscription
- Backup/restore
- System monitoring
- AI governance
- Offline PWA
- Integration center
- Data governance
- Enterprise reporting

### QHSSE Operational Modules

- Risk Management / HIRADC / JSA / Bowtie
- Incident Management / Investigation / RCA / CAPA
- Audit & Inspection
- Permit to Work
- Document Control
- Training & Competency
- Legal & Compliance Register
- Environment Management
- Quality Management
- Security Management
- Emergency Response
- Contractor Management
- Asset & Equipment

## Paket SaaS Rekomendasi

### Basic

- Incident
- Action tracking
- Inspection basic
- Document basic
- Dashboard basic

### Professional

- Risk
- Permit to Work
- Audit
- Training
- Legal compliance
- Contractor
- Advanced dashboard

### Enterprise

- Multi-company advanced
- SSO/MFA
- Advanced workflow
- Advanced permission
- API & webhook
- AI assistant
- Offline PWA
- Integration center
- Enterprise reporting

## Rekomendasi Development

Jangan membangun modul QHSSE besar sebelum core kuat. Urutan terbaik:

1. Core Phase 1
2. Incident + Action + Attachment
3. Risk + HIRADC + JSA
4. Audit + Inspection + Checklist
5. Permit to Work + Workflow
6. Document Control
7. Training + Competency
8. Legal + Environment + Quality + Security
9. AI Assistant dan Enterprise features

## Prinsip Data

Semua tabel bisnis utama harus punya:

```text
id
company_id
site_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

Semua record penting harus mendukung:

```text
attachments
comments
workflow instance
audit log
numbering code
permission scope
```

## Prinsip Keamanan

- Permission wajib dicek di backend.
- Jangan percaya frontend.
- Semua query harus filter company_id.
- API key di-hash.
- Password di-hash.
- File tidak boleh public tanpa token.
- Audit log tidak boleh diedit.
- Soft delete untuk record penting.
- Sensitive data harus bisa dimasking di Phase 3.

## Definition of Done Global

Sebuah fitur dianggap selesai jika memiliki:

1. Database schema/migration.
2. Backend service.
3. Backend API.
4. Permission guard.
5. Validation.
6. Audit log.
7. Frontend page/component.
8. Error handling.
9. Loading/empty states.
10. Unit/integration test minimal.
11. Seed/sample data jika relevan.
12. Acceptance criteria terpenuhi.


---

# 02 — REKOMENDASI STACK DAN ARSITEKTUR

## Rekomendasi Utama

Gunakan stack berikut untuk WebApp QHSSE SaaS serius:

```text
Frontend     : Next.js + TypeScript
Backend      : NestJS + TypeScript
Database     : PostgreSQL
ORM          : Prisma
Cache/Queue  : Redis + BullMQ
Storage      : MinIO untuk self-hosted, S3-compatible untuk cloud
Auth         : JWT + Refresh Token, Phase 3 bisa tambah SSO/OIDC/SAML
Search       : PostgreSQL FTS awal, Meilisearch/OpenSearch untuk scale
UI           : Tailwind CSS + shadcn/ui
Validation   : Zod di frontend, class-validator/Zod di backend
Testing      : Vitest/Jest + Playwright
Deployment   : Docker Compose awal, Kubernetes jika enterprise
Reverse Proxy: Nginx atau Traefik
Monitoring   : OpenTelemetry + Prometheus/Grafana optional
```

## Alternatif Lebih Cepat

Jika ingin MVP cepat:

```text
Laravel + Filament + PostgreSQL + Redis + MinIO
```

Namun untuk SaaS modular enterprise, rekomendasi utama tetap:

```text
Next.js + NestJS + PostgreSQL + Prisma + Redis + MinIO
```

## Arsitektur Tingkat Tinggi

```text
Browser / PWA
   ↓
Next.js Frontend
   ↓
NestJS API Gateway / Backend
   ├── Auth Module
   ├── Core Platform Modules
   ├── QHSSE Modules
   ├── Workflow Engine
   ├── Notification Service
   ├── File Service
   ├── AI Governance Service
   └── Integration Service
   ↓
PostgreSQL + Redis + MinIO
```

## Struktur Monorepo Rekomendasi

```text
qhsse-platform/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── shared/              # shared types, constants, schemas
│   ├── ui/                  # shared UI components optional
│   └── config/              # eslint, tsconfig, prettier
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docs/
├── docker/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Backend Module Pattern

Setiap module backend minimal memiliki:

```text
module/
├── dto/
├── entities or prisma mapping
├── module.controller.ts
├── module.service.ts
├── module.repository.ts optional
├── module.policy.ts
├── module.audit.ts optional
├── module.spec.ts
└── index.ts
```

## Frontend Module Pattern

Setiap module frontend minimal memiliki:

```text
app/(dashboard)/module-name/
├── page.tsx
├── create/page.tsx
├── [id]/page.tsx
├── [id]/edit/page.tsx
components/module-name/
hooks/use-module-name.ts
lib/api/module-name.ts
schemas/module-name.schema.ts
```

## Konvensi API

Gunakan prefix:

```text
/api/v1
```

Format response sukses:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Format error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

## Multi-Tenant Enforcement

Wajib buat middleware/guard yang membaca:

```text
current_user
current_company_id
current_scope
current_permissions
```

Semua query bisnis wajib filter:

```text
company_id = current_company_id
```

Super Admin boleh override tetapi tetap harus masuk audit log.

## Event-Driven Internal

Gunakan event internal untuk:

```text
record.created
record.updated
workflow.approval_requested
workflow.approved
workflow.rejected
action.assigned
action.overdue
file.uploaded
notification.sent
```

Event memudahkan notification, audit log, webhook, dan AI governance.


---

# 03 — GENERATING RULES GLOBAL UNTUK AI AGENT

## Aturan Umum

1. Jangan membuat kode dummy kosong.
2. Jangan membuat fitur hanya UI tanpa backend.
3. Jangan membuat backend tanpa permission guard.
4. Jangan membuat tabel tanpa company_id jika data tenant-specific.
5. Jangan membuat action destructive tanpa audit log.
6. Jangan hardcode data yang harusnya master data.
7. Jangan hardcode approval yang harusnya workflow.
8. Jangan membuat file upload public tanpa proteksi.
9. Jangan mengabaikan test.
10. Jangan lanjut core berikutnya sebelum core sekarang selesai.

## Urutan Implementasi Setiap Core

Untuk setiap core, lakukan urutan ini:

```text
1. Baca file panduan core.
2. Buat/update database schema.
3. Buat migration.
4. Buat seed data jika perlu.
5. Buat backend DTO/validation.
6. Buat backend service.
7. Buat backend controller/API.
8. Tambahkan permission.
9. Tambahkan audit log.
10. Tambahkan notification jika relevan.
11. Buat frontend page.
12. Buat table/list/detail/form.
13. Tambahkan error/loading/empty state.
14. Tambahkan test.
15. Jalankan lint/test/build.
16. Cocokkan dengan acceptance criteria.
17. Tulis status selesai.
```

## Pola Status yang Wajib Dipakai AI Agent

Setelah menyelesaikan core:

```text
SELESAI CORE: <nama core>
Yang dibuat:
- Database:
- Backend:
- Frontend:
- Permission:
- Audit log:
- Test:
- Catatan:

Jangan lanjut core berikutnya sebelum user meminta continue.
```

## Permission Minimum

Setiap modul minimal punya permission:

```text
<module>.view
<module>.create
<module>.update
<module>.delete
<module>.export
```

Jika workflow:

```text
<module>.submit
<module>.approve
<module>.reject
<module>.close
```

## Audit Log Minimum

Catat:

```text
create
update
delete
restore
submit
approve
reject
close
export
import
upload
download
permission_change
settings_change
```

## Frontend Minimum

Setiap fitur minimal punya:

```text
List page
Create page
Detail page
Edit page
Delete/archive confirmation
Filter/search basic
Pagination
Loading state
Empty state
Error state
Permission-aware UI
```

## Backend Minimum

Setiap fitur minimal punya:

```text
DTO validation
Service layer
Controller/API
Permission guard
Tenant filter
Audit log
Error handling
Pagination
Search/filter
Soft delete jika record penting
```

## Testing Minimum

Untuk setiap core:

```text
Unit test service utama
API test minimal happy path
Permission test minimal
Tenant isolation test minimal
```

## Larangan Penting

- Jangan menyimpan API key plaintext.
- Jangan menyimpan password plaintext.
- Jangan bypass company_id.
- Jangan membuat Super Admin sebagai satu-satunya role yang bisa pakai fitur.
- Jangan delete hard record compliance.
- Jangan expose internal id sensitif di UI jika tidak perlu.


---

# 04 — DATABASE CORE MODEL OVERVIEW

## Prinsip

Semua tabel tenant-specific wajib memiliki `company_id`. Tabel global seperti `plans`, `modules`, dan `permissions` boleh tanpa company_id jika berlaku global.

## Core Tables

```text
tenants
companies
company_settings
business_units
sites
projects
departments
sections
locations
positions
users
user_profiles
user_company_assignments
user_site_assignments
user_department_assignments
roles
permissions
role_permissions
user_roles
user_scopes
modules
module_features
tenant_modules
tenant_feature_flags
master_data_groups
master_data_items
workflows
workflow_steps
workflow_instances
workflow_histories
actions
notifications
attachments
files
audit_logs
```

## Index Wajib

```text
company_id
site_id
created_by
status
deleted_at
code
email
module_name
record_id
created_at
```

## Soft Delete

Gunakan soft delete untuk:

```text
companies
sites
departments
locations
users
roles custom
master_data_items
workflows
actions
attachments
business records
```

## Audit Fields

Untuk record penting:

```text
created_by
updated_by
deleted_by
created_at
updated_at
deleted_at
```

## Status Pattern

Gunakan enum status yang jelas:

```text
active
inactive
draft
submitted
in_review
approved
rejected
closed
cancelled
archived
suspended
```


---

# 05 — UI/UX GUIDELINES

## Prinsip UI

- Clean enterprise dashboard.
- Sidebar modular sesuai module ON/OFF.
- Topbar dengan company/site switcher.
- Permission-aware buttons.
- Mobile responsive.
- Table kuat: search, filter, sort, pagination, column visibility.
- Detail page berbasis tabs.

## Layout Dasar

```text
Login Layout
Dashboard Layout
Admin Layout
Record Detail Layout
Form Builder Layout
Checklist Builder Layout
Workflow Builder Layout
Mobile/PWA Layout
```

## Sidebar Rekomendasi

```text
Dashboard
Risk Management
Incident Management
Audit & Inspection
Permit to Work
Action Tracking
Document Control
Training & Competency
Legal Compliance
Environment
Quality
Security
Contractor Management
Reports
AI Assistant
Core Platform
Settings
```

## Record Detail Tabs

```text
Overview
Details
Workflow
Actions
Attachments
Comments
Audit Trail
History
```

## Komponen Wajib

```text
DataTable
FilterBar
StatusBadge
RiskBadge
PriorityBadge
UserPicker
SitePicker
DepartmentPicker
AttachmentUploader
CommentThread
WorkflowTimeline
AuditTimeline
ConfirmDialog
EmptyState
LoadingSkeleton
ErrorState
PermissionGate
```

## Warna Status

Jangan hardcode di banyak tempat. Simpan mapping di config/master data.

Contoh:

```text
Draft = gray
Submitted = blue
Approved = green
Rejected = red
Overdue = red
Closed = neutral
```


---

# 06 — SECURITY AND API STANDARDS

## Security Default

- HTTPS only di production.
- Password hash bcrypt/argon2.
- JWT short-lived.
- Refresh token rotation.
- API key hashed.
- Rate limit.
- CORS restricted.
- CSRF protection jika menggunakan cookie.
- File upload validation.
- Input validation.
- SQL injection protection melalui ORM dan parameterized query.
- Audit log untuk critical action.

## API Standard

Prefix:

```text
/api/v1
```

Response success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Response error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message",
    "details": []
  }
}
```

## Pagination

Query:

```text
?page=1&pageSize=20&sort=createdAt:desc&search=abc
```

Response meta:

```json
{
  "page": 1,
  "pageSize": 20,
  "total": 100,
  "totalPages": 5
}
```

## Required Guards

```text
AuthGuard
TenantGuard
PermissionGuard
ModuleEnabledGuard
RateLimitGuard
```

## Audit Middleware

Critical endpoint harus memanggil audit service.

Catat:

```text
actor
company
module
action
record_id
old_value
new_value
ip
user_agent
timestamp
```


---

# PHASE 1 — CORE WAJIB — Sequence Generating

## Aturan

Jangan generate semua core sekaligus. Kerjakan sesuai urutan.

## Urutan Core

1. `01_multi_company_tenant_management.md` — Multi-Company / Tenant Management
2. `02_organization_structure.md` — Organization Structure
3. `03_user_management.md` — User Management
4. `04_authentication_session_management.md` — Authentication & Session Management
5. `05_role_permission_access_control.md` — Role, Permission & Access Control
6. `06_master_data_management.md` — Master Data Management
7. `07_module_management_on_off.md` — Module Management ON/OFF
8. `08_workflow_engine_basic.md` — Workflow Engine Basic
9. `09_notification_basic.md` — Notification Basic
10. `10_attachment_evidence_basic.md` — Attachment & Evidence Basic
11. `11_audit_log_basic.md` — Audit Log Basic
12. `12_dashboard_basic.md` — Dashboard Basic
13. `13_action_tracking_basic.md` — Action Tracking Basic

## Cara Kerja

Untuk setiap core:

1. Baca file core.
2. Implementasikan database.
3. Implementasikan backend.
4. Implementasikan frontend.
5. Tambahkan permission.
6. Tambahkan audit log.
7. Tambahkan test.
8. Jalankan lint/test/build.
9. Cocokkan acceptance criteria.
10. Tulis `SELESAI CORE: <nama core>`.
11. Stop dan tunggu instruksi lanjut.

## Prompt Continue

Gunakan prompt ini setiap ingin lanjut:

```text
Continue Sequence. Kerjakan core berikutnya sesuai file sequence. Jika core selesai, jangan lanjut core berikutnya. Berikan keterangan selesai.
```


---

# PHASE 2 — CORE ADVANCED — Sequence Generating

## Aturan

Jangan generate semua core sekaligus. Kerjakan sesuai urutan.

## Urutan Core

1. `01_form_builder.md` — Form Builder
2. `02_checklist_builder.md` — Checklist Builder
3. `03_advanced_workflow_engine.md` — Advanced Workflow Engine
4. `04_numbering_format_generator.md` — Numbering Format Generator
5. `05_template_management.md` — Template Management
6. `06_import_export_center.md` — Import & Export Center
7. `07_calendar_schedule_engine.md` — Calendar & Schedule Engine
8. `08_api_key_management.md` — API Key Management
9. `09_webhook_management.md` — Webhook Management
10. `10_dashboard_builder.md` — Dashboard Builder
11. `11_global_search.md` — Global Search
12. `12_collaboration_comment_thread.md` — Collaboration & Comment Thread

## Cara Kerja

Untuk setiap core:

1. Baca file core.
2. Implementasikan database.
3. Implementasikan backend.
4. Implementasikan frontend.
5. Tambahkan permission.
6. Tambahkan audit log.
7. Tambahkan test.
8. Jalankan lint/test/build.
9. Cocokkan acceptance criteria.
10. Tulis `SELESAI CORE: <nama core>`.
11. Stop dan tunggu instruksi lanjut.

## Prompt Continue

Gunakan prompt ini setiap ingin lanjut:

```text
Continue Sequence. Kerjakan core berikutnya sesuai file sequence. Jika core selesai, jangan lanjut core berikutnya. Berikan keterangan selesai.
```


---

# PHASE 3 — CORE ENTERPRISE — Sequence Generating

## Aturan

Jangan generate semua core sekaligus. Kerjakan sesuai urutan.

## Urutan Core

1. `01_sso_single_sign_on.md` — SSO / Single Sign-On
2. `02_mfa_multi_factor_authentication.md` — MFA / Multi-Factor Authentication
3. `03_advanced_permission.md` — Advanced Permission
4. `04_subscription_billing_package_management.md` — Subscription, Billing & Package Management
5. `05_backup_restore_ui.md` — Backup & Restore UI
6. `06_system_health_monitoring.md` — System Health Monitoring
7. `07_ai_governance.md` — AI Governance
8. `08_offline_pwa.md` — Offline PWA
9. `09_advanced_integration_center.md` — Advanced Integration Center
10. `10_data_retention_archive_legal_hold.md` — Data Retention, Archive & Legal Hold
11. `11_compliance_control_center.md` — Compliance & Control Center
12. `12_enterprise_reporting.md` — Enterprise Reporting

## Cara Kerja

Untuk setiap core:

1. Baca file core.
2. Implementasikan database.
3. Implementasikan backend.
4. Implementasikan frontend.
5. Tambahkan permission.
6. Tambahkan audit log.
7. Tambahkan test.
8. Jalankan lint/test/build.
9. Cocokkan acceptance criteria.
10. Tulis `SELESAI CORE: <nama core>`.
11. Stop dan tunggu instruksi lanjut.

## Prompt Continue

Gunakan prompt ini setiap ingin lanjut:

```text
Continue Sequence. Kerjakan core berikutnya sesuai file sequence. Jika core selesai, jangan lanjut core berikutnya. Berikan keterangan selesai.
```
