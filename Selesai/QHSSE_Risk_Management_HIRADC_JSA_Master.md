# START HERE — Risk Management / HIRADC / JSA Generating Pack

Paket ini digunakan setelah **Core Platform + Stabilization & QA + Incident Management**.

## Rekomendasi Split

Risk Management / HIRADC / JSA sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 Risk Register Core
03 Hazard Identification & Consequence Library
04 Risk Matrix & Risk Calculation Engine
05 HIRADC / HIRARC Builder
06 JSA / JHA Builder
07 Control Management & Hierarchy of Control
08 Residual Risk, Action Plan & Control Effectiveness
09 Risk Review, Approval Workflow & Change History
10 Cross-Module Integration
11 Dashboard, Heatmap, KPI & Reporting
12 QA, Test, Permission & Stabilization
```

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_RISK_MANAGEMENT.md`.
3. Baca `01_RISK_MANAGEMENT_MASTER_BLUEPRINT.md`.
4. Baca `02_RISK_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Kerjakan satu sequence sampai selesai.
7. Setelah selesai tulis `SELESAI RISK SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.
9. Setelah sequence 12 lulus, tulis `RISK MANAGEMENT STABILIZED: GO`.


---

# PROMPT AWAL RISK MANAGEMENT / HIRADC / JSA

Core Platform sudah stabil dan Incident Management sudah selesai atau siap diintegrasikan.

Sekarang generate module **Risk Management / HIRADC / JSA**.

Baca seluruh folder `qhsse_risk_management_hiradc_jsa_generating_pack`.

Aturan wajib:
1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan Core Platform: tenant, site, department, role permission, module ON/OFF, master data, workflow, action tracking, attachment, notification, audit log, numbering, dashboard, comments.
4. Risk matrix harus dynamic/configurable, bukan hardcode.
5. Severity, likelihood, risk level, hazard, consequence, control type, hierarchy of control harus master data/configurable.
6. HIRADC harus berbasis aktivitas dan hazard row.
7. JSA harus berbasis job step.
8. Semua data wajib tenant-safe dengan `company_id`.
9. Semua API wajib permission guard.
10. Semua perubahan risk rating, matrix, control, approval harus audit log.

Kerjakan sequence pertama saja. Setelah selesai tulis:

```text
SELESAI RISK SEQUENCE 01: Foundation & Master Data
```

Jangan lanjut sequence berikutnya sebelum saya minta continue.


---

# MASTER BLUEPRINT — Risk Management / HIRADC / JSA

## Visi Modul

Modul ini adalah pusat pengelolaan hazard, risiko, kontrol, residual risk, approval, review, dan action plan. Modul ini menjadi fondasi untuk Permit to Work, Audit & Inspection, Training, Document Control, Incident Management, Legal Compliance, Environment, Contractor, dan Asset.

## Tujuan Utama

- Mengelola risk register.
- Mengelola hazard dan consequence library.
- Membuat risk matrix configurable.
- Menghitung initial risk dan residual risk.
- Membuat HIRADC/HIRARC berbasis aktivitas.
- Membuat JSA/JHA berbasis job steps.
- Mengelola hierarchy of control.
- Mengelola critical controls.
- Membuat action plan untuk high/extreme risk.
- Menjalankan risk review dan approval workflow.
- Menyediakan risk heatmap, KPI, dan report.

## Submodul

```text
Risk Register
Hazard Register
Consequence Library
Risk Matrix Engine
HIRADC / HIRARC
JSA / JHA
Control Register
Critical Control Register
Control Effectiveness
Residual Risk
Risk Action Plan
Risk Review
High Risk Activity Register
Risk Dashboard
Risk Reporting
```

## Jenis Risk Assessment

```text
Activity Based Risk Assessment
Area Based Risk Assessment
Job Safety Analysis
Project Risk Assessment
Process Risk Assessment
Environmental Aspect Impact
Security Risk Assessment
Quality Risk Assessment
Emergency Risk Assessment
Contractor Risk Assessment
Asset / Equipment Risk Assessment
```

## Status Record

```text
Draft
Submitted
In Review
Revision Required
Approved
Active
Review Due
Under Review
Revised
Archived
Cancelled
```

## Risk Levels Default

```text
Low
Medium
High
Extreme
```

## Hierarchy of Control Default

```text
Elimination
Substitution
Engineering Control
Administrative Control
PPE
Recovery / Emergency Control
```

## Definition of Done

Modul selesai jika:

- Risk register berjalan.
- Hazard/consequence library berjalan.
- Risk matrix configurable.
- Risk calculation backend berjalan.
- HIRADC bisa dibuat, dihitung, disubmit, dan disetujui.
- JSA bisa dibuat berbasis job steps dan disetujui.
- Controls dan critical controls berjalan.
- High/extreme risk menghasilkan action/approval sesuai setting.
- Risk review due berjalan.
- Cross-module link berjalan.
- Dashboard dan heatmap muncul.
- Export PDF/Excel berjalan.
- Permission dan tenant isolation aman.
- Audit log lengkap.
- QA menghasilkan `RISK MANAGEMENT STABILIZED: GO`.


---

# RISK GENERATING RULES

## Aturan Global

1. Jangan membuat risk module sebagai CRUD sederhana.
2. Risk matrix harus dynamic/configurable.
3. Severity, likelihood, risk level, hazard, consequence, control harus configurable.
4. HIRADC dan JSA harus punya model data sendiri.
5. JSA harus berbasis job steps, bukan textarea panjang.
6. Semua risk record wajib tenant-safe.
7. Semua API wajib permission guard.
8. Semua critical changes wajib audit log.
9. High/extreme risk wajib action plan atau approval tambahan sesuai setting.
10. Jangan lanjut sequence berikutnya sebelum sequence sekarang selesai.

## Urutan Kerja Setiap Sequence

```text
1. Baca file sequence.
2. Update database schema.
3. Buat migration.
4. Buat seed data.
5. Buat backend DTO/validation.
6. Buat service.
7. Buat controller/API.
8. Tambahkan permission guard.
9. Tambahkan tenant guard.
10. Tambahkan audit log.
11. Tambahkan notification/action jika relevan.
12. Buat frontend page/component.
13. Tambahkan loading/empty/error state.
14. Tambahkan test.
15. Jalankan lint/test/build.
16. Cocokkan acceptance criteria.
17. Tulis status selesai.
```

## Permission Minimal

```text
risk.view
risk.view_all
risk.create
risk.update
risk.delete
risk.submit
risk.approve
risk.reject
risk.archive
risk.export
risk.import
risk.manage_settings
hiradc.view
hiradc.create
hiradc.update
hiradc.submit
hiradc.approve
hiradc.export
jsa.view
jsa.create
jsa.update
jsa.submit
jsa.approve
jsa.export
risk_matrix.manage
risk_control.manage
```

## Audit Log Wajib

```text
risk.create
risk.update
risk.submit
risk.approve
risk.reject
risk.rating_changed
risk.control_added
risk.control_removed
risk.action_created
risk.review_completed
hiradc.created
hiradc.updated
jsa.created
jsa.updated
risk_matrix.changed
risk.exported
```


---

# DATABASE MODEL GUIDE

## Core Tables

```text
risk_settings
risk_matrix_definitions
risk_matrix_cells
risk_matrix_versions
risk_severity_levels
risk_likelihood_levels
risk_levels
hazard_categories
hazards
consequence_categories
consequences
hazard_consequence_mappings
risks
risk_assessments
risk_controls
risk_control_effectiveness
risk_actions
risk_reviews
risk_links
hiradc_records
hiradc_activities
hiradc_hazards
hiradc_controls
jsa_records
jsa_steps
jsa_step_hazards
jsa_step_controls
critical_controls
critical_control_verifications
```

## Common Fields

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
project_id optional
department_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
```

## Important Main Fields

### risks

```text
risk_number
risk_title
risk_description
risk_type
risk_category
hazard_id
consequence_id
risk_owner_id
assessment_type
initial_severity_id
initial_likelihood_id
initial_risk_level_id
residual_severity_id
residual_likelihood_id
residual_risk_level_id
control_summary
status
workflow_status
review_frequency
last_review_date
next_review_date
```

### hiradc_records

```text
hiradc_number
title
activity_scope
assessment_date
assessor_id
reviewer_id
approver_id
status
workflow_status
linked_document_id
next_review_date
```

### hiradc_hazards

```text
hiradc_activity_id
hazard_id
hazard_description
consequence_description
existing_control
initial_severity_id
initial_likelihood_id
initial_risk_level_id
additional_control
residual_severity_id
residual_likelihood_id
residual_risk_level_id
pic_id
due_date
status
```

### jsa_records

```text
jsa_number
job_title
job_description
job_location
required_permit
required_ppe
required_tools
assessor_id
reviewer_id
approver_id
status
workflow_status
linked_hiradc_id
next_review_date
```

### jsa_steps

```text
jsa_id
step_number
step_description
sequence_order
```

## Index Wajib

```text
company_id
site_id
department_id
risk_number
hiradc_number
jsa_number
status
workflow_status
initial_risk_level_id
residual_risk_level_id
next_review_date
created_at
```


---

# API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## Risk Register API

```text
GET    /api/v1/risks
POST   /api/v1/risks
GET    /api/v1/risks/:id
PATCH  /api/v1/risks/:id
DELETE /api/v1/risks/:id
POST   /api/v1/risks/:id/submit
POST   /api/v1/risks/:id/approve
POST   /api/v1/risks/:id/reject
POST   /api/v1/risks/:id/archive
POST   /api/v1/risks/:id/review
POST   /api/v1/risks/:id/recalculate
GET    /api/v1/risks/:id/controls
POST   /api/v1/risks/:id/controls
GET    /api/v1/risks/:id/actions
POST   /api/v1/risks/:id/actions
GET    /api/v1/risks/:id/links
POST   /api/v1/risks/:id/links
GET    /api/v1/risks/dashboard
GET    /api/v1/risks/export
```

## Risk Matrix API

```text
GET    /api/v1/risk-matrix
POST   /api/v1/risk-matrix
PATCH  /api/v1/risk-matrix/:id
POST   /api/v1/risk-matrix/:id/publish
POST   /api/v1/risk-matrix/calculate
```

## HIRADC API

```text
GET    /api/v1/hiradc
POST   /api/v1/hiradc
GET    /api/v1/hiradc/:id
PATCH  /api/v1/hiradc/:id
DELETE /api/v1/hiradc/:id
POST   /api/v1/hiradc/:id/submit
POST   /api/v1/hiradc/:id/approve
POST   /api/v1/hiradc/:id/reject
POST   /api/v1/hiradc/:id/recalculate
GET    /api/v1/hiradc/:id/activities
POST   /api/v1/hiradc/:id/activities
GET    /api/v1/hiradc/:id/export
```

## JSA API

```text
GET    /api/v1/jsa
POST   /api/v1/jsa
GET    /api/v1/jsa/:id
PATCH  /api/v1/jsa/:id
DELETE /api/v1/jsa/:id
POST   /api/v1/jsa/:id/submit
POST   /api/v1/jsa/:id/approve
POST   /api/v1/jsa/:id/reject
POST   /api/v1/jsa/:id/recalculate
GET    /api/v1/jsa/:id/steps
POST   /api/v1/jsa/:id/steps
GET    /api/v1/jsa/:id/export
```

## Webhook Events

```text
risk.created
risk.high_created
risk.extreme_created
risk.rating_changed
risk.approved
risk.review_due
risk.action_created
hiradc.created
hiradc.approved
jsa.created
jsa.approved
risk.control_failed
```


---

# UI / UX GUIDE

## Sidebar

```text
Risk Management
├── Overview
├── Risk Register
├── HIRADC / HIRARC
├── JSA / JHA
├── Hazard Library
├── Control Register
├── Critical Controls
├── Risk Matrix
├── Risk Reviews
├── Risk Actions
├── Reports
└── Settings
```

## Detail Page Tabs

```text
Overview
Assessment
Controls
Actions
Review
Linked Records
Attachments
Comments
Workflow
Audit Trail
```

## HIRADC Table

```text
Activity
Hazard
Consequence
Existing Control
Initial S
Initial L
Initial Risk
Additional Control
Residual S
Residual L
Residual Risk
PIC
Due Date
Status
```

## JSA Step Builder

```text
Step Number
Job Step
Hazard
Consequence
Control
Required PPE
Required Tools
Required Permit
Residual Risk
Responsible Person
```

## Components

```text
RiskBadge
RiskMatrix
RiskHeatmap
RiskTrendChart
ControlEffectivenessBadge
HierarchyOfControlBadge
ReviewDueBadge
CriticalControlBadge
WorkflowTimeline
ActionPanel
LinkedRecordsPanel
```


---

# PERMISSION & SECURITY GUIDE

## Scope

```text
Global
Company
Site
Project
Department
Own Data
Assigned Data
```

## Security Rule

- User tanpa permission view tidak bisa lihat list/detail.
- User tanpa create tidak bisa create.
- User tanpa update tidak bisa update.
- User tanpa approve tidak bisa approve.
- User hanya bisa melihat data sesuai company/scope.
- Direct API cross-company harus 403/404.
- Risk matrix setting hanya untuk role tertentu.
- Export harus sesuai permission dan scope.
- Semua risk rating changes harus audit log.
- Attachment evidence mengikuti file security core.

## Backend Guard Wajib

```text
AuthGuard
TenantGuard
PermissionGuard
ModuleEnabledGuard
RiskScopeGuard
```


---

# QA & RELEASE GATE

## QA Area

```text
Tenant isolation
Permission backend
Risk matrix calculation
HIRADC calculation
JSA calculation
Workflow
Action integration
Attachment security
Audit log
Notification
Dashboard calculation
Export PDF/Excel
Cross-module links
```

## P0 Critical

```text
Cross-company data leak
Permission backend bypass
Wrong risk calculation
Risk matrix change corrupts old assessments
File access public
Approved risk can be edited without revision control
```

## Release Gate

Risk Management boleh GO jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Risk calculation PASS
HIRADC calculation PASS
JSA calculation PASS
Workflow PASS
Audit log PASS
Dashboard PASS
Export PASS
Regression PASS
```

Final status:

```text
RISK MANAGEMENT STABILIZED: GO
```


---

# CROSS-MODULE INTEGRATION GUIDE

## Incident Management

```text
Incident high severity → create risk review
Repeated incident → create new risk
Incident RCA → add new control
Lessons learned → update risk control
```

## Permit to Work

```text
Permit high risk work → requires JSA
Permit cannot approve if linked JSA not approved
Permit can show linked hazards and controls
```

## Audit & Inspection

```text
Inspection finding → create risk action
Audit can verify critical control
Failed critical control → increase risk review priority
```

## Document Control

```text
SOP can be linked as control
Obsolete SOP → risk control review due
Document revision → risk review trigger
```

## Training & Competency

```text
Control can require training
Training gap can create risk action
Expired certificate can increase work risk warning
```

## Asset & Contractor

```text
Equipment certificate expired → risk review
Contractor risk category affects permit approval
Contractor incident history affects risk profile
```


---

# RISK MANAGEMENT / HIRADC / JSA — 12 SEQUENCE

1. `01_foundation_master_data.md` — Foundation & Master Data
2. `02_risk_register_core.md` — Risk Register Core
3. `03_hazard_identification_consequence_library.md` — Hazard Identification & Consequence Library
4. `04_risk_matrix_calculation_engine.md` — Risk Matrix & Risk Calculation Engine
5. `05_hiradc_hirarc_builder.md` — HIRADC / HIRARC Builder
6. `06_jsa_jha_builder.md` — JSA / JHA Builder
7. `07_control_management_hierarchy.md` — Control Management & Hierarchy of Control
8. `08_residual_risk_action_plan_effectiveness.md` — Residual Risk, Action Plan & Control Effectiveness
9. `09_risk_review_approval_workflow_history.md` — Risk Review, Approval Workflow & Change History
10. `10_cross_module_integration.md` — Cross-Module Integration
11. `11_dashboard_heatmap_kpi_reporting.md` — Dashboard, Heatmap, KPI & Reporting
12. `12_qa_test_permission_stabilization.md` — QA, Test, Permission & Stabilization

## Prompt Continue

```text
Continue Risk Management Sequence. Kerjakan sequence berikutnya sesuai sequence/00_RISK_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
RISK MANAGEMENT STABILIZED: GO
```


---

# QHSSE Risk Management / HIRADC / JSA — Master

## Rekomendasi Split

Sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 Risk Register Core
03 Hazard Identification & Consequence Library
04 Risk Matrix & Risk Calculation Engine
05 HIRADC / HIRARC Builder
06 JSA / JHA Builder
07 Control Management & Hierarchy of Control
08 Residual Risk, Action Plan & Control Effectiveness
09 Risk Review, Approval Workflow & Change History
10 Cross-Module Integration
11 Dashboard, Heatmap, KPI & Reporting
12 QA, Test, Permission & Stabilization
```

## Prompt Awal Singkat

```text
Core Platform sudah stabil dan Incident Management sudah selesai atau siap integrasi.
Sekarang generate Risk Management / HIRADC / JSA berdasarkan qhsse_risk_management_hiradc_jsa_generating_pack.
Mulai dari sequence/01_foundation_master_data.md.
Kerjakan sequence pertama saja.
Setelah selesai tulis SELESAI RISK SEQUENCE 01.
Jangan lanjut sequence berikutnya sebelum saya minta continue.
```
