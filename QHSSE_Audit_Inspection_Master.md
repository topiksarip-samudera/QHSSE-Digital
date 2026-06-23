# START HERE — QHSSE Audit & Inspection Generating Pack

Tanggal: 2026-06-21

Paket ini dibuat untuk menghasilkan modul **Audit & Inspection** pada WebApp QHSSE secara sequence, aman, dan tidak bercampur.

## Posisi Modul dalam Roadmap

```text
Core Platform
→ Stabilization & QA
→ Incident Management
→ Risk Management / HIRADC / JSA
→ Audit & Inspection
→ Permit to Work
→ Document Control
→ Training & Competency
→ Legal & Compliance
→ Environment
→ Quality
→ Security
→ Contractor
→ Emergency
→ Asset & Equipment
```

## Rekomendasi Split

Modul Audit & Inspection sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 Audit Program & Audit Plan
03 Inspection Schedule & Inspection Plan
04 Checklist Template Integration
05 Audit Execution
06 Inspection Execution
07 Finding & Nonconformity Management
08 Corrective Action & Verification
09 Scoring, Rating & Compliance Result
10 Report, Evidence, Attachment & Approval
11 Dashboard, KPI & Analytics
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Audit & Inspection menyentuh banyak core:

```text
Checklist Builder
Form Builder
Workflow
Action Tracking
Attachment
Notification
Audit Log
Schedule
Dashboard
Report Export
Permission
Tenant Isolation
```

Jika digenerate sekaligus, biasanya hasilnya bercampur antara audit, inspection, checklist, finding, action, dan report. Dengan 12 sequence, setiap bagian bisa digenerate, dites, distabilkan, lalu lanjut.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_AUDIT_INSPECTION.md`.
3. Baca `01_AUDIT_INSPECTION_MASTER_BLUEPRINT.md`.
4. Baca `02_AUDIT_INSPECTION_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI AUDIT INSPECTION SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir yang Diinginkan

Setelah sequence 12 selesai:

```text
AUDIT INSPECTION STABILIZED: GO
```


---

# 00 — PROMPT AWAL AUDIT & INSPECTION UNTUK AI AGENT

Core Platform sudah stabil. Incident Management dan Risk Management / HIRADC / JSA sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Audit & Inspection**.

Baca seluruh file dalam folder `qhsse_audit_inspection_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core yang sudah ada:
   - Company / tenant
   - Site / department / location
   - Role & permission
   - Module ON/OFF
   - Master data
   - Workflow
   - Checklist builder
   - Form builder jika tersedia
   - Action tracking
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Dashboard
   - API/webhook
4. Semua data wajib tenant-safe.
5. Semua API wajib permission-guarded.
6. Semua action penting wajib audit log.
7. Semua finding harus bisa menghasilkan action.
8. Checklist execution harus menyimpan versi checklist yang digunakan.
9. Audit dan inspection harus bisa berjalan terpisah tetapi memakai engine finding/action yang sama.
10. Setelah sequence selesai, tulis:
   `SELESAI AUDIT INSPECTION SEQUENCE XX: <nama sequence>`
11. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT AUDIT & INSPECTION

## Tujuan Modul

Modul **Audit & Inspection** digunakan untuk merencanakan, menjadwalkan, menjalankan, mencatat, menilai, dan menutup kegiatan audit serta inspeksi QHSSE.

Modul ini harus mencakup:

```text
Audit Program
Audit Plan
Internal Audit
External Audit
ISO Audit
SMK3 Audit
Contractor Audit
Supplier Audit
Site Inspection
Equipment Inspection
Checklist Execution
Finding Management
Nonconformity
Observation
Opportunity for Improvement
Corrective Action
Verification
Report
Dashboard
```

## Prinsip Desain

1. Audit dan Inspection berada dalam satu modul besar, tetapi subtipe record berbeda.
2. Checklist execution harus memakai Checklist Builder dari Core Platform.
3. Finding harus reusable untuk audit dan inspection.
4. Finding harus bisa membuat Action Tracking.
5. Audit report dan inspection report harus bisa diexport.
6. Workflow harus bisa dikonfigurasi per audit type/inspection type.
7. Scoring harus fleksibel dan bisa per checklist.
8. Evidence harus bisa foto/video/dokumen.
9. Audit trail wajib aktif.
10. Data harus multi-tenant dan multi-site.

## Submodul Utama

```text
Audit Program
Audit Plan
Audit Schedule
Audit Execution
Inspection Schedule
Inspection Execution
Checklist Execution
Finding Management
Nonconformity Management
Observation & OFI
Corrective Action
Verification
Scoring & Rating
Report & Export
Dashboard & Analytics
Settings & Master Data
```

## Jenis Audit

```text
Internal QHSSE Audit
ISO 9001 Audit
ISO 14001 Audit
ISO 45001 Audit
SMK3 Audit
Legal Compliance Audit
Contractor Audit
Supplier Audit
Project Audit
Management System Audit
Process Audit
Site Audit
Emergency Preparedness Audit
Security Audit
Environmental Audit
Quality Audit
```

## Jenis Inspection

```text
Daily HSE Inspection
Weekly Site Inspection
Housekeeping Inspection
PPE Inspection
Fire Extinguisher Inspection
Fire Hydrant Inspection
Scaffolding Inspection
Lifting Gear Inspection
Vehicle Inspection
Heavy Equipment Inspection
Electrical Inspection
Workshop Inspection
Warehouse Inspection
Environmental Inspection
Waste Storage Inspection
Security Patrol
Emergency Equipment Inspection
First Aid Box Inspection
LOTO Inspection
Confined Space Inspection
Working at Height Inspection
```

## Workflow Audit Rekomendasi

```text
Draft Program
→ Program Approved
→ Audit Planned
→ Audit Scheduled
→ Opening Meeting
→ Field Audit
→ Checklist Completed
→ Findings Drafted
→ Finding Review
→ Report Draft
→ Report Approval
→ Action Assigned
→ Action Verification
→ Audit Closed
```

## Workflow Inspection Rekomendasi

```text
Inspection Scheduled
→ In Progress
→ Checklist Completed
→ Finding Created optional
→ Submitted
→ Reviewed
→ Action Assigned optional
→ Verification
→ Closed
```

## Finding Type

```text
Major Nonconformity
Minor Nonconformity
Observation
Opportunity for Improvement
Positive Finding
Unsafe Condition
Unsafe Act
Regulatory Gap
Procedure Gap
Housekeeping Finding
Equipment Defect
Environmental Finding
Security Finding
Quality Finding
```

## Output Utama

```text
Audit Program
Audit Plan
Audit Schedule
Inspection Schedule
Checklist Execution Result
Finding Register
Nonconformity Report
Observation Report
OFI Report
Corrective Action List
Verification Record
Audit Report PDF
Inspection Report PDF
Compliance Score
Inspection Score
Dashboard KPI
```

## Integrasi Core

```text
Checklist Builder: template checklist
Form Builder: form tambahan jika diperlukan
Workflow: approval audit/inspection/report
Action Tracking: finding action
Attachment: evidence
Notification: schedule/finding/action/overdue
Audit Log: all critical changes
Numbering: audit, inspection, finding, report
Dashboard: widget
API/Webhook: external integration
```

## Integrasi Modul Lain

```text
Risk Management:
- Audit/inspection memeriksa control effectiveness.
- Finding dapat memicu risk review.

Incident Management:
- Finding repeated atau unsafe condition bisa memicu incident/near miss jika perlu.
- Incident lessons learned bisa menjadi checklist inspection.

Permit to Work:
- Inspection dapat memeriksa active permit.
- Finding dapat suspend permit jika critical, optional.

Document Control:
- Audit finding bisa referensi SOP/WI/Policy.
- Finding bisa memicu document revision.

Training:
- Finding bisa memicu training need.

Legal Compliance:
- Audit compliance memakai legal requirement.
- Evidence compliance bisa linked ke audit.

Contractor:
- Contractor audit menghasilkan contractor performance score.

Asset & Equipment:
- Equipment inspection linked ke asset.
```


---

# 02 — AUDIT & INSPECTION GENERATING RULES

## Aturan Utama

1. Jangan hardcode checklist.
2. Gunakan checklist builder core untuk template dan execution.
3. Simpan versi checklist saat execution.
4. Audit dan inspection boleh berbagi finding engine.
5. Finding harus bisa membuat action.
6. Semua critical change harus masuk audit log.
7. Semua API wajib tenant-filter dan permission-guarded.
8. Semua file evidence harus memakai attachment core.
9. Workflow approval tidak boleh hardcoded.
10. Dashboard angka harus dihitung dari data nyata.

## Pattern Setiap Sequence

Setiap sequence harus menghasilkan:

```text
Database update
Backend API
Frontend UI
Permission
Audit log
Notification jika relevan
Test minimal
Acceptance criteria
```

## Standard Status

Audit status:

```text
draft
program_approved
planned
scheduled
in_progress
checklist_completed
finding_review
report_draft
report_approval
action_assigned
verification
closed
cancelled
```

Inspection status:

```text
scheduled
in_progress
submitted
reviewed
action_assigned
verification
closed
cancelled
```

Finding status:

```text
open
in_review
action_assigned
in_progress
pending_verification
verified
closed
rejected
cancelled
```

## Permission Standard

```text
audit_inspection.view
audit_inspection.view_all
audit_inspection.create
audit_inspection.update
audit_inspection.delete
audit_inspection.submit
audit_inspection.approve
audit_inspection.reject
audit_inspection.close
audit_inspection.export
audit_inspection.manage_settings

audit_program.view
audit_program.create
audit_program.update
audit_program.approve

inspection.view
inspection.create
inspection.update
inspection.submit
inspection.review
inspection.close

finding.view
finding.create
finding.update
finding.assign_action
finding.verify
finding.close
```

## Audit Log Wajib

Catat:

```text
audit.created
audit.updated
audit.submitted
audit.approved
audit.closed
inspection.created
inspection.submitted
inspection.reviewed
inspection.closed
finding.created
finding.updated
finding.action_assigned
finding.verified
finding.closed
report.exported
evidence.uploaded
score.changed
settings.changed
```

## Webhook Events

```text
audit.program_created
audit.scheduled
audit.started
audit.finding_created
audit.report_approved
audit.closed
inspection.scheduled
inspection.started
inspection.failed
inspection.finding_created
inspection.closed
finding.created
finding.high_severity
finding.overdue
finding.closed
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
audit_programs
audit_program_items
audit_plans
audit_schedules
audits
audit_team_members
audit_scope_items
audit_checklist_executions
inspection_plans
inspection_schedules
inspections
inspection_checklist_executions
checklist_execution_results
checklist_execution_items
findings
finding_root_causes
finding_actions
finding_verifications
audit_reports
inspection_reports
audit_inspection_scores
audit_inspection_settings
```

## Field Umum Wajib

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
department_id optional
location_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## audits

```text
id
company_id
audit_number
audit_type_id
audit_title
audit_objective
audit_scope
audit_criteria
site_id
department_id
lead_auditor_id
audit_start_date
audit_end_date
status
workflow_instance_id
checklist_template_id
checklist_version_id
score
rating
created_by
updated_by
created_at
updated_at
deleted_at
```

## inspections

```text
id
company_id
inspection_number
inspection_type_id
inspection_title
site_id
department_id
location_id
inspector_id
inspection_date
schedule_id
checklist_template_id
checklist_version_id
score
rating
status
workflow_instance_id
created_by
updated_by
created_at
updated_at
deleted_at
```

## findings

```text
id
company_id
finding_number
source_type
source_id
source_module
finding_type_id
finding_category_id
severity_id
site_id
department_id
location_id
title
description
requirement_reference
evidence_summary
root_cause_required
action_required
action_id optional
due_date
pic_id
verification_status
status
created_by
updated_by
closed_by
closed_at
created_at
updated_at
deleted_at
```

## checklist_execution_results

```text
id
company_id
source_type
source_id
checklist_template_id
checklist_version_id
executed_by
executed_at
total_score
max_score
percentage_score
rating
status
created_at
updated_at
```

## checklist_execution_items

```text
id
company_id
execution_result_id
section_id
item_id
question_text_snapshot
answer_type_snapshot
answer_value
score
max_score
is_critical
is_failed
comment
evidence_required
finding_created_id optional
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
department_id
status
source_type + source_id
finding_number
audit_number
inspection_number
created_at
due_date
severity_id
```

## Relasi Core

```text
attachments → source_type/source_id
comments → source_type/source_id
audit_logs → module/record_id
workflow_instances → source_type/source_id
actions → source_module/source_id
notifications → event/source_id
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Audit Program

```text
GET    /audit-programs
POST   /audit-programs
GET    /audit-programs/:id
PATCH  /audit-programs/:id
DELETE /audit-programs/:id
POST   /audit-programs/:id/submit
POST   /audit-programs/:id/approve
POST   /audit-programs/:id/reject
```

## Audit

```text
GET    /audits
POST   /audits
GET    /audits/:id
PATCH  /audits/:id
DELETE /audits/:id
POST   /audits/:id/submit
POST   /audits/:id/start
POST   /audits/:id/complete-checklist
POST   /audits/:id/submit-report
POST   /audits/:id/approve-report
POST   /audits/:id/close
GET    /audits/:id/report
GET    /audits/:id/export
```

## Inspection

```text
GET    /inspections
POST   /inspections
GET    /inspections/:id
PATCH  /inspections/:id
DELETE /inspections/:id
POST   /inspections/:id/start
POST   /inspections/:id/submit
POST   /inspections/:id/review
POST   /inspections/:id/close
GET    /inspections/:id/report
GET    /inspections/:id/export
```

## Checklist Execution

```text
POST   /checklist-executions
GET    /checklist-executions/:id
PATCH  /checklist-executions/:id/items/:itemId
POST   /checklist-executions/:id/submit
POST   /checklist-executions/:id/create-findings
GET    /checklist-executions/:id/results
```

## Finding

```text
GET    /findings
POST   /findings
GET    /findings/:id
PATCH  /findings/:id
DELETE /findings/:id
POST   /findings/:id/assign-action
POST   /findings/:id/submit-verification
POST   /findings/:id/verify
POST   /findings/:id/reject-verification
POST   /findings/:id/close
GET    /findings/:id/actions
GET    /findings/:id/attachments
GET    /findings/:id/audit-logs
```

## Dashboard

```text
GET /audit-inspection/dashboard
GET /audit-inspection/kpi
GET /audit-inspection/finding-trend
GET /audit-inspection/score-trend
GET /audit-inspection/overdue-actions
```

## Settings

```text
GET   /audit-inspection/settings
PATCH /audit-inspection/settings
GET   /audit-inspection/master-data
```

## Standard Query

```text
?page=1&pageSize=20&search=&siteId=&departmentId=&status=&dateFrom=&dateTo=&sort=createdAt:desc
```


---

# 05 — UI/UX GUIDE AUDIT & INSPECTION

## Sidebar

```text
Audit & Inspection
├── Overview
├── Audit Programs
├── Audits
├── Inspection Plans
├── Inspections
├── Findings
├── Corrective Actions
├── Schedules
├── Reports
└── Settings
```

## Halaman Utama

```text
Overview Dashboard
Audit Program List
Audit Program Detail
Create Audit Program
Audit List
Create Audit
Audit Detail
Inspection Schedule
Inspection List
Create Inspection
Inspection Detail
Checklist Execution Page
Finding List
Finding Detail
Report Export Page
Settings Page
```

## Audit Detail Tabs

```text
Overview
Scope & Criteria
Audit Team
Schedule
Checklist
Findings
Actions
Attachments
Comments
Workflow
Report
Audit Trail
```

## Inspection Detail Tabs

```text
Overview
Checklist
Findings
Actions
Attachments
Comments
Workflow
Report
Audit Trail
```

## Finding Detail Tabs

```text
Overview
Requirement Reference
Evidence
Root Cause
Action
Verification
Comments
Audit Trail
```

## Komponen Wajib

```text
AuditStatusBadge
InspectionStatusBadge
FindingSeverityBadge
ChecklistExecutionTable
FindingCard
FindingDrawer
ActionVerificationPanel
AuditReportPreview
InspectionReportPreview
ScoreCard
ComplianceRatingBadge
ScheduleCalendar
```

## UX Penting

- Checklist execution harus cepat dipakai di lapangan.
- Mobile view harus nyaman untuk inspection.
- Evidence upload harus bisa dari kamera.
- Finding bisa dibuat langsung dari checklist item.
- Critical failed item harus ditandai jelas.
- Report preview sebelum export PDF.
- User tidak boleh melihat tombol yang tidak punya permission.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Audit Program

```text
audit_program.view
audit_program.create
audit_program.update
audit_program.delete
audit_program.submit
audit_program.approve
audit_program.reject
audit_program.export
```

### Audit

```text
audit.view
audit.view_all
audit.create
audit.update
audit.delete
audit.submit
audit.start
audit.complete_checklist
audit.submit_report
audit.approve_report
audit.close
audit.export
```

### Inspection

```text
inspection.view
inspection.view_all
inspection.create
inspection.update
inspection.delete
inspection.start
inspection.submit
inspection.review
inspection.close
inspection.export
```

### Finding

```text
finding.view
finding.view_all
finding.create
finding.update
finding.delete
finding.assign_action
finding.verify
finding.close
finding.export
```

### Settings

```text
audit_inspection.manage_settings
```

## Scope

```text
Global
Company
Site
Department
Own
Assigned
Auditor
Auditee
Inspector
Finding PIC
```

## Security Rules

- Semua query wajib filter company_id.
- User Site A tidak boleh melihat audit/inspection Site B kecuali punya scope company/global.
- Auditor hanya bisa mengakses audit yang ditugaskan jika scope assigned.
- Inspector hanya bisa mengakses inspection yang ditugaskan jika scope assigned.
- Finding PIC hanya bisa update progress/action sesuai permission.
- Contractor hanya bisa melihat audit/inspection yang terkait dirinya jika diberikan akses.
- Evidence download harus permission-guarded.
- Export report harus dicatat audit log.
- Critical finding close harus butuh verification permission.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Audit Program Workflow
Audit Execution
Inspection Execution
Checklist Execution
Finding Management
Action Tracking Integration
Attachment Security
Notification
Audit Log
Dashboard Calculation
Report Export
Regression Test
```

## Release Gate

Audit & Inspection hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Checklist versioning PASS
Finding to action integration PASS
Attachment security PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
AUDIT INSPECTION STABILIZED: GO
```

Jika gagal:

```text
AUDIT INSPECTION STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Risk Management

Audit & Inspection harus bisa:

```text
- Link finding ke risk.
- Menilai control effectiveness.
- Membuat risk review dari failed critical control.
- Menggunakan high risk activity sebagai target inspection.
```

## Incident Management

```text
- Unsafe condition dapat menjadi near miss/incident jika diperlukan.
- Repeated finding dapat memicu incident review.
- Incident lessons learned dapat menjadi checklist item.
```

## Permit to Work

```text
- Inspection dapat memeriksa active permit.
- Critical permit finding dapat merekomendasikan permit suspend.
- Permit area dapat menjadi objek inspection.
```

## Document Control

```text
- Finding dapat referensi SOP/WI/Policy.
- Finding dapat membuat request document revision.
- Audit report dapat mencantumkan document evidence.
```

## Training & Competency

```text
- Finding dapat membuat training need.
- Audit dapat memeriksa training compliance.
```

## Legal & Compliance

```text
- Audit checklist dapat map ke legal obligation.
- Finding dapat menjadi compliance gap.
```

## Contractor

```text
- Contractor audit menghasilkan contractor score.
- Contractor inspection dapat memengaruhi performance.
```

## Asset & Equipment

```text
- Inspection linked ke asset/equipment.
- Equipment defect membuat finding/action.
- Certificate expired dapat menjadi finding.
```


---

# Audit & Inspection Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Audit Program & Audit Plan
03 Inspection Schedule & Inspection Plan
04 Checklist Template Integration
05 Audit Execution
06 Inspection Execution
07 Finding & Nonconformity Management
08 Corrective Action & Verification
09 Scoring, Rating & Compliance Result
10 Report, Evidence, Attachment & Approval
11 Dashboard, KPI & Analytics
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Audit & Inspection Sequence. Kerjakan sequence berikutnya sesuai sequence/00_AUDIT_INSPECTION_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
AUDIT INSPECTION STABILIZED: GO
```
