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
