# START HERE — QHSSE Quality Management Generating Pack

Tanggal: 2026-06-22

Paket ini dibuat untuk menghasilkan modul **Quality Management** pada WebApp QHSSE secara sequence, lengkap, dan tidak menjadi CRUD NCR biasa.

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
→ Legal & Compliance Register
→ Environment Management
→ Quality Management
→ Security Management
→ Contractor Management
→ Emergency Response
→ Asset & Equipment
```

## Rekomendasi Split

Quality Management sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 NCR / Nonconformance Core
03 Customer Complaint & Internal Quality Issue
04 Supplier Quality Issue & Material Receiving Inspection
05 In-Process, Final Inspection & ITP
06 Punch List & Defect Management
07 Root Cause Analysis & Disposition
08 CAPA, Verification & Effectiveness Review
09 Calibration & Measurement Equipment Control
10 Integration with Audit, Document, Training, Contractor & Asset
11 Dashboard, KPI, Cost of Quality, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Quality Management harus mengontrol:

```text
NCR
Customer complaint
Supplier quality issue
Material receiving inspection
In-process inspection
Final inspection
ITP
Punch list
Defect management
RCA
Disposition
CAPA
Calibration
Cost of quality
Quality KPI
```

Jika digenerate sekaligus, biasanya modul hanya menjadi form NCR biasa. Dengan 12 sequence, hasilnya menjadi quality control system yang lengkap.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_QUALITY_MANAGEMENT.md`.
3. Baca `01_QUALITY_MANAGEMENT_MASTER_BLUEPRINT.md`.
4. Baca `02_QUALITY_MANAGEMENT_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI QUALITY SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

```text
QUALITY MANAGEMENT STABILIZED: GO
```


---

# 00 — PROMPT AWAL QUALITY MANAGEMENT UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management, Audit & Inspection, Permit to Work, Document Control, Training & Competency, Legal & Compliance, dan Environment Management sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Quality Management**.

Baca seluruh file dalam folder `qhsse_quality_management_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core yang sudah ada: tenant, site/project/department/location, permission, module ON/OFF, master data, workflow, action tracking, attachment, audit log, notification, numbering, dashboard, API/webhook.
4. Quality Management tidak boleh hanya menjadi NCR CRUD.
5. Harus ada NCR, complaint, supplier issue, inspection, ITP, punch list, RCA, disposition, CAPA, calibration, KPI, dan report.
6. Semua data wajib tenant-safe.
7. Semua API wajib permission-guarded.
8. Semua quality decision, status change, disposition, CAPA verification, calibration status, dan export harus audit logged.
9. Setelah sequence selesai, tulis: `SELESAI QUALITY SEQUENCE XX: <nama sequence>`.
10. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT QUALITY MANAGEMENT

## Tujuan Modul

Modul **Quality Management** digunakan untuk mengelola nonconformance, complaint, supplier quality issue, inspection result, defect, punch list, RCA, disposition, CAPA, calibration, cost of quality, quality KPI, dan reporting.

Modul ini harus menjadi pusat pengendalian mutu operasional dan compliance ISO 9001.

## Prinsip Desain

1. Quality Management bukan hanya NCR register.
2. NCR harus bisa berasal dari audit, inspection, supplier, customer, internal process, material inspection, final inspection, atau project punch list.
3. Setiap nonconformance harus bisa memiliki severity, category, affected item, evidence, disposition, RCA, dan CAPA.
4. Disposition harus jelas: use as is, rework, repair, reject, scrap, return to vendor, concession.
5. CAPA harus bisa diverifikasi dan diuji efektivitasnya.
6. Calibration harus mengontrol alat ukur, certificate, due date, out-of-tolerance, dan status alat.
7. Quality dashboard harus menampilkan trend, overdue CAPA, defect, complaint, supplier issue, calibration due, dan cost of quality.
8. Semua critical decision harus human-reviewed dan audit logged.

## Submodul Utama

```text
NCR / Nonconformance Report
Customer Complaint
Internal Quality Issue
Supplier Quality Issue
Material Receiving Inspection
In-Process Inspection
Final Inspection
Inspection Test Plan / ITP
Punch List
Defect Management
Root Cause Analysis
Disposition
CAPA
Effectiveness Review
Calibration Management
Measurement Equipment Control
Cost of Poor Quality
Quality Dashboard
Quality Reporting
```

## NCR Source

```text
Audit Finding
Inspection Finding
Customer Complaint
Supplier Issue
Internal Process Issue
Material Receiving Inspection
In-Process Inspection
Final Inspection
Punch List
Calibration Failure
Incident / Quality Incident
External Claim
```

## Disposition

```text
Use As Is
Rework
Repair
Reject
Scrap
Return To Vendor
Concession
Regrade
Hold
```

## Status Standard

```text
draft
submitted
under_review
disposition_required
rca_required
action_assigned
in_progress
pending_verification
verified
effectiveness_review
closed
cancelled
archived
```

## Output Utama

```text
NCR Register
Complaint Register
Supplier Quality Issue Register
Inspection Result Register
ITP Register
Punch List Register
Defect Register
RCA Report
Disposition Record
CAPA Register
Calibration Register
Calibration Due List
Quality KPI Dashboard
Cost of Quality Report
NCR PDF/Excel Export
```

## Integrasi Modul Lain

```text
Audit & Inspection: finding can create NCR.
Document Control: SOP, ITP, drawing, specification link.
Training & Competency: quality training and inspector competency.
Contractor Management: supplier/contractor quality issue and score.
Asset & Equipment: calibration and measuring equipment.
Risk Management: quality risk and process control.
Action Tracking: CAPA from NCR/complaint/defect.
Legal & Compliance: ISO 9001/client requirement evidence.
Incident Management: quality incident link.
```


---

# 02 — QUALITY MANAGEMENT GENERATING RULES

## Aturan Utama

1. Jangan membuat modul ini sebagai NCR CRUD sederhana.
2. NCR, complaint, supplier issue, inspection, punch list, CAPA, dan calibration harus punya model jelas.
3. Disposition, RCA, CAPA, dan verification harus workflow-aware.
4. CAPA harus menggunakan Action Tracking Core jika sudah ada.
5. Evidence harus memakai attachment core.
6. Calibration due/overdue harus masuk notification/calendar.
7. Semua critical status change harus audit logged.
8. Semua API wajib tenant-filter dan permission-guarded.
9. Export harus permission-aware dan audit logged.
10. Dashboard harus dihitung dari data nyata.

## Permission Standard

```text
quality.view
quality.view_all
quality.create
quality.update
quality.delete
quality.submit
quality.review
quality.approve
quality.close
quality.export
quality.manage_settings

ncr.view
ncr.create
ncr.update
ncr.review
ncr.assign_disposition
ncr.assign_action
ncr.verify
ncr.close

quality_complaint.view
quality_complaint.create
quality_complaint.respond
quality_complaint.close

quality_inspection.view
quality_inspection.create
quality_inspection.review
quality_inspection.close

calibration.view
calibration.create
calibration.update
calibration.verify
calibration.close
```

## Audit Log Wajib

```text
ncr.created
ncr.updated
ncr.submitted
ncr.reviewed
ncr.disposition_set
ncr.rca_added
ncr.action_assigned
ncr.verified
ncr.closed
complaint.created
complaint.responded
supplier_issue.created
inspection.result_submitted
punch_item.created
calibration.created
calibration.completed
calibration.out_of_tolerance
report.exported
settings.changed
```

## Webhook Events

```text
quality.ncr_created
quality.ncr_high_severity
quality.ncr_closed
quality.capa_overdue
quality.complaint_created
quality.supplier_issue_created
quality.defect_created
quality.calibration_due
quality.calibration_overdue
quality.out_of_tolerance
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
quality_settings
quality_categories
quality_severities
ncr_records
ncr_affected_items
ncr_dispositions
ncr_root_causes
quality_capa_links
customer_complaints
supplier_quality_issues
material_receiving_inspections
quality_inspection_plans
quality_inspection_results
quality_inspection_items
itp_records
itp_stages
itp_points
punch_lists
punch_items
defect_records
calibration_equipment
calibration_schedules
calibration_records
calibration_certificates
quality_cost_records
quality_links
```

## Field Umum Wajib

```text
id
company_id
site_id optional
project_id optional
department_id optional
location_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## ncr_records

```text
id
company_id
ncr_number
source_module optional
source_record_id optional
ncr_source
ncr_type
category_id
severity_id
title
description
site_id
project_id optional
department_id optional
location_id optional
customer_id optional
supplier_id optional
contractor_id optional
affected_product optional
affected_process optional
affected_quantity optional
requirement_reference
immediate_correction
disposition_status
rca_required
action_required
verification_status
effectiveness_status
workflow_instance_id optional
status
created_by
updated_by
closed_by optional
closed_at optional
created_at
updated_at
```

## ncr_dispositions

```text
id
company_id
ncr_id
disposition_type
disposition_description
approved_by optional
approved_at optional
concession_required
concession_reference optional
cost_impact optional
status
created_at
updated_at
```

## customer_complaints

```text
id
company_id
complaint_number
customer_name
contact_person optional
complaint_date
product_service
project_id optional
severity_id
description
response_due_date
response_summary optional
linked_ncr_id optional
status
created_by
updated_by
created_at
updated_at
```

## supplier_quality_issues

```text
id
company_id
issue_number
supplier_id
po_number optional
material_id optional
receiving_inspection_id optional
issue_description
quantity_affected
severity_id
supplier_response_required
response_due_date
linked_ncr_id optional
status
created_at
updated_at
```

## calibration_equipment

```text
id
company_id
equipment_number
name
serial_number
manufacturer optional
model optional
location_id optional
owner_department_id optional
calibration_frequency_months
last_calibration_date optional
next_calibration_date
calibration_status
certificate_id optional
is_critical
status
created_at
updated_at
```

## calibration_records

```text
id
company_id
equipment_id
calibration_date
calibrated_by
certificate_number
result
out_of_tolerance
adjustment_required
next_due_date
file_id optional
remarks
status
created_at
updated_at
```

## Index Wajib

```text
company_id
ncr_number
complaint_number
issue_number
equipment_number
status
severity_id
site_id
project_id
supplier_id
customer_id
next_calibration_date
created_at
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## NCR

```text
GET    /quality/ncr
POST   /quality/ncr
GET    /quality/ncr/:id
PATCH  /quality/ncr/:id
DELETE /quality/ncr/:id
POST   /quality/ncr/:id/submit
POST   /quality/ncr/:id/review
POST   /quality/ncr/:id/set-disposition
POST   /quality/ncr/:id/add-rca
POST   /quality/ncr/:id/assign-capa
POST   /quality/ncr/:id/verify
POST   /quality/ncr/:id/close
GET    /quality/ncr/:id/export
```

## Complaint

```text
GET  /quality/complaints
POST /quality/complaints
GET  /quality/complaints/:id
PATCH /quality/complaints/:id
POST /quality/complaints/:id/respond
POST /quality/complaints/:id/create-ncr
POST /quality/complaints/:id/close
```

## Supplier Quality & Receiving Inspection

```text
GET  /quality/supplier-issues
POST /quality/supplier-issues
GET  /quality/material-receiving-inspections
POST /quality/material-receiving-inspections
POST /quality/supplier-issues/:id/create-ncr
POST /quality/supplier-issues/:id/request-response
POST /quality/supplier-issues/:id/close
```

## Inspection / ITP

```text
GET  /quality/itp
POST /quality/itp
GET  /quality/inspections
POST /quality/inspections
GET  /quality/inspections/:id
PATCH /quality/inspections/:id
POST /quality/inspections/:id/submit-result
POST /quality/inspections/:id/create-ncr
```

## Punch List / Defect

```text
GET  /quality/punch-lists
POST /quality/punch-lists
GET  /quality/defects
POST /quality/defects
POST /quality/defects/:id/create-ncr
POST /quality/punch-items/:id/close
```

## Calibration

```text
GET  /quality/calibration-equipment
POST /quality/calibration-equipment
GET  /quality/calibration-equipment/:id
PATCH /quality/calibration-equipment/:id
GET  /quality/calibration-due
POST /quality/calibration-records
POST /quality/calibration-records/:id/verify
```

## Dashboard & Reports

```text
GET /quality/dashboard
GET /quality/kpi
GET /quality/cost-of-quality
GET /quality/reports/:type
GET /quality/export
```

## Settings

```text
GET   /quality/settings
PATCH /quality/settings
GET   /quality/master-data
```


---

# 05 — UI/UX GUIDE QUALITY MANAGEMENT

## Sidebar

```text
Quality Management
├── Overview
├── NCR Register
├── Customer Complaints
├── Supplier Quality Issues
├── Material Receiving Inspection
├── In-Process Inspection
├── Final Inspection
├── ITP
├── Punch List
├── Defect Register
├── CAPA
├── Calibration
├── Reports
└── Settings
```

## NCR Detail Tabs

```text
Overview
Affected Item
Evidence
Disposition
Root Cause Analysis
CAPA
Verification
Effectiveness Review
Linked Records
Attachments
Comments
Workflow
Audit Trail
```

## Components

```text
NcrStatusBadge
QualitySeverityBadge
DispositionBadge
RcaPanel
CapaPanel
EffectivenessReviewPanel
ComplaintResponsePanel
SupplierResponsePanel
InspectionResultTable
PunchListBoard
CalibrationDueCard
CostOfQualityCard
QualityTrendChart
```

## UX Penting

- NCR creation harus cepat dari audit/inspection/complaint/supplier/inspection result.
- Disposition harus jelas dan tidak bisa dilewati jika wajib.
- CAPA dan verification harus terlihat di detail.
- Calibration due/overdue harus jelas.
- Dashboard harus menampilkan tren dan overdue action.


---

# 06 — PERMISSION & SECURITY GUIDE

## Scope

```text
Global
Company
Site
Project
Department
Owner
Assigned PIC
Reviewer
Verifier
Supplier/Contractor limited access optional
```

## Security Rules

- Semua query wajib filter company_id.
- User hanya melihat NCR/complaint/inspection sesuai scope.
- Supplier/contractor hanya boleh melihat issue yang ditugaskan jika portal tersedia.
- Verification membutuhkan permission khusus.
- Disposition approval membutuhkan permission khusus.
- Calibration certificate download harus permission-guarded.
- Report export harus audit logged.
- Closed NCR tidak boleh diedit kecuali reopen permission.
- CAPA close-out harus melalui verification.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
NCR Lifecycle
Complaint Handling
Supplier Quality Issue
Inspection / ITP
Punch List
RCA
Disposition
CAPA Integration
Verification
Calibration Due/Overdue
Dashboard Calculation
Report Export
Audit Log
Notification
Cross-Module Links
Regression Test
```

## Release Gate

Quality Management hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
NCR lifecycle PASS
Complaint flow PASS
Supplier issue flow PASS
Inspection/ITP PASS
RCA/disposition PASS
CAPA verification PASS
Calibration PASS
Dashboard calculation PASS
Report export PASS
Audit log PASS
Cross-module integration PASS
Lint/test/build PASS
```

## Status Akhir

```text
QUALITY MANAGEMENT STABILIZED: GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Audit & Inspection

```text
- Audit finding can create NCR.
- Inspection finding can create NCR or defect.
- Repeated finding can trigger CAPA effectiveness review.
```

## Document Control

```text
- NCR can link to SOP, ITP, drawing, specification.
- NCR can trigger document revision request.
- Obsolete specification can trigger quality review.
```

## Training & Competency

```text
- NCR root cause can create training need.
- Inspector competency can be validated.
- Training evidence can support CAPA effectiveness.
```

## Contractor / Supplier

```text
- Supplier issue affects supplier performance.
- Contractor defect affects contractor score.
- Supplier response can be tracked.
```

## Asset & Equipment

```text
- Calibration equipment linked to asset.
- Out-of-tolerance can create NCR.
- Equipment defect can create quality issue.
```

## Risk & Legal Compliance

```text
- Quality risk can be linked to risk register.
- ISO 9001 requirement can be compliance evidence.
- Client requirement can become obligation.
```


---

# Quality Management Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 NCR / Nonconformance Core
03 Customer Complaint & Internal Quality Issue
04 Supplier Quality Issue & Material Receiving Inspection
05 In-Process, Final Inspection & ITP
06 Punch List & Defect Management
07 Root Cause Analysis & Disposition
08 CAPA, Verification & Effectiveness Review
09 Calibration & Measurement Equipment Control
10 Integration with Audit, Document, Training, Contractor & Asset
11 Dashboard, KPI, Cost of Quality, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Quality Management Sequence. Kerjakan sequence berikutnya sesuai sequence/00_QUALITY_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
QUALITY MANAGEMENT STABILIZED: GO
```
