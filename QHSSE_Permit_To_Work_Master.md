# START HERE — QHSSE Permit to Work Generating Pack

Tanggal: 2026-06-21

Paket ini dibuat untuk menghasilkan modul **Permit to Work / PTW** pada WebApp QHSSE secara sequence, aman, dan tidak menjadi sekadar form izin kerja biasa.

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

Modul **Permit to Work** sebaiknya di-split menjadi **14 sequence**.

```text
01 Foundation & Master Data
02 Permit Type & Permit Configuration
03 Permit Request Core
04 Job Scope, Location & Work Party
05 JSA / Risk Assessment Integration
06 PPE, Tools, Equipment & Asset Requirement
07 Worker Competency & Certificate Validation
08 Gas Test, Confined Space & Hot Work Controls
09 LOTO, Isolation & Energy Control
10 SIMOPS, Area Conflict & Permit Clash Detection
11 Approval Workflow, Activation, Extension & Suspension
12 Close-Out, Handover, Evidence & Lessons Learned
13 Dashboard, QR Permit, Active Board & Reporting
14 QA, Test, Permission & Stabilization
```

## Kenapa 14 Sequence?

Permit to Work adalah salah satu modul QHSSE paling kompleks karena menyentuh:

```text
Risk / HIRADC / JSA
Training & Competency
Contractor Management
Asset & Equipment
Audit & Inspection
Document Control
Workflow Approval
Action Tracking
Attachment / Evidence
Notification
Audit Log
QR Code
Active Permit Board
SIMOPS
Gas Test
LOTO / Isolation
```

Jika digenerate sekaligus, biasanya PTW hanya menjadi CRUD form biasa. Dengan 14 sequence, PTW bisa menjadi sistem operasional yang benar.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_PERMIT_TO_WORK.md`.
3. Baca `01_PERMIT_TO_WORK_MASTER_BLUEPRINT.md`.
4. Baca `02_PERMIT_TO_WORK_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI PTW SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 14 selesai:

```text
PERMIT TO WORK STABILIZED: GO
```


---

# 00 — PROMPT AWAL PERMIT TO WORK UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management / HIRADC / JSA, dan Audit & Inspection sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Permit to Work / PTW**.

Baca seluruh file dalam folder `qhsse_permit_to_work_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core yang sudah ada:
   - Company / tenant
   - Site / project / department / location
   - Role & permission
   - Module ON/OFF
   - Master data
   - Workflow
   - Action tracking
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Dashboard
   - QR code engine jika sudah tersedia
   - API/webhook
4. Integrasikan dengan modul:
   - Risk Management / HIRADC / JSA
   - Training & Competency
   - Contractor Management
   - Asset & Equipment
   - Audit & Inspection
   - Document Control
5. Semua data wajib tenant-safe.
6. Semua API wajib permission-guarded.
7. Semua approval, activation, extension, suspension, dan close-out wajib masuk audit log.
8. PTW tidak boleh hanya menjadi form biasa. PTW harus punya lifecycle operasional.
9. Permit aktif harus bisa dilihat di Active Permit Board.
10. QR Permit harus bisa digunakan untuk verifikasi lapangan.
11. Setelah sequence selesai, tulis:
   `SELESAI PTW SEQUENCE XX: <nama sequence>`
12. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT PERMIT TO WORK

## Tujuan Modul

Modul **Permit to Work / PTW** digunakan untuk mengontrol pekerjaan berisiko tinggi melalui proses request, review risiko, validasi pekerja, validasi alat, approval, activation, monitoring, extension, suspension, dan close-out.

PTW harus menjadi sistem pengendalian pekerjaan, bukan hanya form digital.

## Prinsip Desain

1. Permit wajib tenant-safe.
2. Permit wajib punya lifecycle.
3. Permit type harus configurable.
4. Permit approval harus workflow-driven.
5. Permit harus bisa link ke JSA / Risk Assessment.
6. Permit harus bisa validasi worker competency.
7. Permit harus bisa link ke contractor.
8. Permit harus bisa link ke asset/equipment.
9. Permit harus punya active board.
10. Permit harus punya QR verification.
11. Permit harus punya suspend dan close-out.
12. Permit harus punya gas test dan LOTO jika permit type membutuhkan.
13. Permit harus mendukung SIMOPS / clash detection.
14. Semua status penting harus audit logged.

## Jenis Permit yang Harus Didukung

```text
Hot Work Permit
Cold Work Permit
Working at Height
Confined Space Entry
Electrical Work Permit
Lifting Operation Permit
Excavation Permit
LOTO Permit
Radiography Permit
Chemical Work Permit
Line Breaking Permit
Pressure Testing Permit
Night Work Permit
SIMOPS Permit
Crane Operation Permit
Vehicle Entry Permit
Energized Work Permit
Demolition Permit
Scaffolding Permit
Diving Permit optional
```

## Submodul Utama

```text
Permit Request
Permit Type Configuration
Permit Requirement Configuration
Job Scope
Work Location
Work Party / Worker List
JSA / Risk Link
PPE Requirement
Tools & Equipment Requirement
Asset Link
Worker Competency Validation
Contractor Validation
Gas Test
Hot Work Control
Confined Space Control
LOTO / Isolation
SIMOPS Check
Permit Clash Detection
Approval Workflow
Permit Activation
Permit Extension
Permit Suspension
Permit Close-Out
Handover
Lessons Learned
QR Permit
Active Permit Board
Permit Report
```

## Workflow Rekomendasi Umum

```text
Draft
→ Submitted
→ Area Owner Review
→ HSE Review
→ Permit Issuer Approval
→ Approved
→ Activated
→ Work In Progress
→ Extended optional
→ Suspended optional
→ Close-Out Submitted
→ Close-Out Verified
→ Closed
```

## Workflow Hot Work

```text
Draft
→ Submitted
→ JSA Review
→ Area Owner Review
→ HSE Review
→ Fire Watch Confirmed
→ Gas Test Confirmed if required
→ Permit Issuer Approval
→ Activated
→ Fire Watch Monitoring
→ Close-Out
→ Closed
```

## Workflow Confined Space

```text
Draft
→ Submitted
→ JSA Review
→ Rescue Plan Review
→ Gas Test Required
→ Standby Man Assigned
→ HSE Review
→ Permit Issuer Approval
→ Activated
→ Periodic Gas Test
→ Close-Out
→ Closed
```

## Workflow Electrical / LOTO

```text
Draft
→ Submitted
→ Electrical Supervisor Review
→ Isolation Plan Review
→ LOTO Applied
→ Verification
→ Permit Issuer Approval
→ Activated
→ Work Complete
→ LOTO Removal Approval
→ Close-Out
→ Closed
```

## Output Utama

```text
Permit Register
Permit Request
Permit Approval
Permit PDF
QR Permit
Active Permit Board
High Risk Work Register
Gas Test Record
LOTO Record
Isolation Register
SIMOPS Register
Permit Clash Alert
Worker Competency Validation
Equipment Requirement
Permit Extension Record
Permit Suspension Record
Permit Close-Out Report
Permit Dashboard
```

## Integrasi Core

```text
Workflow: approval, activation, extension, suspension, close-out
Action Tracking: action from permit requirement or finding
Attachment: JSA, photo, gas test, supporting docs
Notification: approval, expiry, suspension, overdue close-out
Audit Log: status and approval history
Numbering: permit number
Dashboard: active permit, expiring permit, high risk work
QR: field verification
API/Webhook: integration
```

## Integrasi Modul Lain

```text
Risk / HIRADC / JSA:
- Permit wajib link ke JSA untuk high-risk job.
- Permit bisa mengambil controls dari JSA.

Training & Competency:
- Permit memvalidasi worker certificate.
- Permit bisa block/warn jika sertifikat expired.

Contractor:
- Permit validasi contractor status.
- Worker contractor harus aktif dan approved.

Asset & Equipment:
- Equipment yang digunakan harus valid.
- Certificate equipment harus belum expired.

Audit & Inspection:
- Permit bisa diinspeksi.
- Finding critical bisa suspend permit.

Document Control:
- Permit dapat link ke SOP / WI / Method Statement.

Incident:
- Incident dapat dibuat dari permit jika terjadi kejadian.
- Permit history dapat dipakai untuk investigation.
```


---

# 02 — PERMIT TO WORK GENERATING RULES

## Aturan Utama

1. Jangan hardcode permit type.
2. Permit type dan requirement harus configurable.
3. Gunakan workflow engine, jangan hardcode approval.
4. Gunakan attachment core untuk evidence.
5. Gunakan action tracking core untuk follow-up.
6. Gunakan audit log untuk semua critical status changes.
7. Gunakan notification core untuk approval/expiry/suspend/close-out.
8. Permit aktif harus muncul di Active Permit Board.
9. Permit harus bisa QR verification.
10. Permit harus bisa extension, suspension, cancellation, dan close-out.
11. JSA/Risk link harus optional/mandatory tergantung permit type.
12. Worker competency validation harus configurable: block atau warning.
13. Equipment certificate validation harus configurable: block atau warning.
14. SIMOPS / clash detection minimal berdasarkan lokasi dan waktu.

## Status Permit

```text
draft
submitted
under_review
revision_required
approved
active
work_in_progress
extension_requested
extended
suspended
closeout_submitted
closed
expired
cancelled
archived
```

## Status Gas Test

```text
not_required
required
pending
passed
failed
expired
```

## Status LOTO

```text
not_required
planned
applied
verified
removed
cancelled
```

## Status SIMOPS

```text
not_checked
clear
conflict_detected
approved_with_control
rejected
```

## Permission Standard

```text
permit.view
permit.view_all
permit.create
permit.update
permit.delete
permit.submit
permit.review
permit.approve
permit.activate
permit.extend
permit.suspend
permit.close
permit.cancel
permit.export
permit.manage_settings

permit.gas_test.create
permit.gas_test.verify
permit.loto.create
permit.loto.verify
permit.simops.review
permit.qr.verify
```

## Audit Log Wajib

```text
permit.created
permit.updated
permit.submitted
permit.reviewed
permit.approved
permit.activated
permit.extended
permit.suspended
permit.closeout_submitted
permit.closed
permit.cancelled
permit.expired
gas_test.created
gas_test.verified
loto.applied
loto.verified
loto.removed
simops.conflict_detected
qr.verified
report.exported
```

## Webhook Events

```text
permit.created
permit.submitted
permit.approved
permit.activated
permit.expiring
permit.expired
permit.extended
permit.suspended
permit.closed
permit.cancelled
permit.gas_test_failed
permit.loto_applied
permit.simops_conflict
permit.qr_verified
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
permit_types
permit_type_requirements
permit_settings
permits
permit_work_locations
permit_work_parties
permit_workers
permit_contractors
permit_risk_links
permit_jsa_links
permit_ppe_requirements
permit_tool_requirements
permit_equipment_requirements
permit_asset_links
permit_competency_checks
permit_certificate_checks
permit_gas_tests
permit_hot_work_controls
permit_confined_space_controls
permit_loto_plans
permit_loto_points
permit_loto_locks
permit_isolation_points
permit_simops_checks
permit_clash_records
permit_extensions
permit_suspensions
permit_closeouts
permit_handover_records
permit_qr_verifications
permit_reports
permit_active_board_snapshots
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

## permits

```text
id
company_id
permit_number
permit_type_id
title
job_description
work_scope
site_id
project_id
department_id
location_id
area_id optional
contractor_id optional
requestor_id
area_owner_id optional
hse_reviewer_id optional
permit_issuer_id optional
start_datetime
end_datetime
actual_start_datetime optional
actual_end_datetime optional
risk_level
jsa_required
jsa_status
gas_test_required
loto_required
simops_required
competency_check_status
equipment_check_status
gas_test_status
loto_status
simops_status
workflow_instance_id
status
created_by
updated_by
created_at
updated_at
deleted_at
```

## permit_types

```text
id
company_id optional
code
name
description
default_validity_hours
jsa_required
gas_test_required
loto_required
simops_required
competency_required
equipment_certificate_required
fire_watch_required
standby_man_required
rescue_plan_required
is_active
created_at
updated_at
```

## permit_type_requirements

```text
id
company_id
permit_type_id
requirement_type
requirement_key
requirement_name
is_mandatory
validation_mode
display_order
config_json
created_at
updated_at
```

`validation_mode`:

```text
block
warning
info
```

## permit_workers

```text
id
company_id
permit_id
worker_id optional
contractor_worker_id optional
name_snapshot
company_snapshot
role_in_work
is_supervisor
competency_check_status
certificate_check_status
medical_check_status optional
created_at
updated_at
```

## permit_gas_tests

```text
id
company_id
permit_id
test_datetime
tested_by
oxygen_percent
lel_percent
h2s_ppm
co_ppm
other_gas_json
result
remarks
next_test_due
attachment_id optional
created_at
updated_at
```

## permit_loto_points

```text
id
company_id
permit_id
asset_id optional
isolation_point_code
energy_type
isolation_method
lock_number
tag_number
applied_by
verified_by
applied_at
removed_by optional
removed_at optional
status
created_at
updated_at
```

## permit_simops_checks

```text
id
company_id
permit_id
work_location_id
start_datetime
end_datetime
conflict_status
conflict_summary
control_measures
approved_by optional
created_at
updated_at
```

## permit_closeouts

```text
id
company_id
permit_id
work_completed
area_cleaned
tools_removed
loto_removed
waste_removed
fire_watch_completed optional
handover_to
closeout_notes
submitted_by
verified_by optional
submitted_at
verified_at optional
status
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
permit_number
permit_type_id
status
start_datetime
end_datetime
location_id
contractor_id
requestor_id
area_owner_id
permit_issuer_id
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Permit Types & Settings

```text
GET    /permit-types
POST   /permit-types
GET    /permit-types/:id
PATCH  /permit-types/:id
DELETE /permit-types/:id

GET    /permit-types/:id/requirements
POST   /permit-types/:id/requirements
PATCH  /permit-type-requirements/:id
DELETE /permit-type-requirements/:id

GET    /permit-settings
PATCH  /permit-settings
```

## Permit Core

```text
GET    /permits
POST   /permits
GET    /permits/:id
PATCH  /permits/:id
DELETE /permits/:id

POST   /permits/:id/submit
POST   /permits/:id/review
POST   /permits/:id/approve
POST   /permits/:id/reject
POST   /permits/:id/request-revision
POST   /permits/:id/activate
POST   /permits/:id/extend
POST   /permits/:id/suspend
POST   /permits/:id/resume
POST   /permits/:id/submit-closeout
POST   /permits/:id/verify-closeout
POST   /permits/:id/close
POST   /permits/:id/cancel
```

## Work Party & Requirement

```text
GET    /permits/:id/workers
POST   /permits/:id/workers
DELETE /permits/:id/workers/:workerId

GET    /permits/:id/ppe
POST   /permits/:id/ppe

GET    /permits/:id/tools
POST   /permits/:id/tools

GET    /permits/:id/equipment
POST   /permits/:id/equipment

POST   /permits/:id/validate-competency
POST   /permits/:id/validate-equipment
```

## Risk / JSA Link

```text
GET  /permits/:id/risk-links
POST /permits/:id/risk-links

GET  /permits/:id/jsa-links
POST /permits/:id/jsa-links

POST /permits/:id/validate-jsa
```

## Gas Test

```text
GET  /permits/:id/gas-tests
POST /permits/:id/gas-tests
POST /permit-gas-tests/:id/verify
```

## LOTO / Isolation

```text
GET  /permits/:id/loto
POST /permits/:id/loto
POST /permits/:id/loto/apply
POST /permits/:id/loto/verify
POST /permits/:id/loto/remove
```

## SIMOPS / Clash Detection

```text
POST /permits/:id/simops/check
GET  /permits/:id/simops
POST /permits/:id/simops/approve
POST /permits/:id/simops/reject
```

## QR & Active Board

```text
GET  /permits/:id/qr
POST /permits/qr/verify
GET  /permits/active-board
GET  /permits/active-board/map optional
```

## Reports & Dashboard

```text
GET /permits/:id/report
GET /permits/:id/export
GET /permit-to-work/dashboard
GET /permit-to-work/kpi
GET /permit-to-work/high-risk-work
GET /permit-to-work/expiring
```

## Standard Query

```text
?page=1&pageSize=20&search=&siteId=&permitTypeId=&status=&dateFrom=&dateTo=&locationId=&contractorId=&sort=startDatetime:desc
```


---

# 05 — UI/UX GUIDE PERMIT TO WORK

## Sidebar

```text
Permit to Work
├── Overview
├── Permit Register
├── Create Permit
├── Active Permit Board
├── High Risk Work
├── Gas Test
├── LOTO / Isolation
├── SIMOPS
├── Expiring Permits
├── Reports
└── Settings
```

## Halaman Utama

```text
Permit Overview Dashboard
Permit Register
Create Permit Wizard
Permit Detail
Permit Edit
Active Permit Board
QR Permit Verification
Gas Test Register
LOTO Register
SIMOPS Board
Permit Calendar
Permit Report Export
Permit Settings
```

## Create Permit Wizard

```text
Step 1: Permit Type
Step 2: Job Scope & Location
Step 3: Work Party / Contractor / Workers
Step 4: Risk / JSA Link
Step 5: PPE / Tools / Equipment
Step 6: Competency & Certificate Check
Step 7: Gas Test / LOTO / SIMOPS if required
Step 8: Attachment / Supporting Document
Step 9: Review & Submit
```

## Permit Detail Tabs

```text
Overview
Job Scope
Work Party
Risk / JSA
PPE / Tools / Equipment
Competency Check
Gas Test
LOTO / Isolation
SIMOPS
Workflow
Actions
Attachments
Comments
QR Permit
Report
Audit Trail
```

## Active Permit Board

Board harus menampilkan:

```text
Permit number
Permit type
Job title
Location
Contractor
Start/end time
Status
Time remaining
Risk level
Gas test status
LOTO status
SIMOPS status
Area owner
Permit issuer
QR verify button
```

## Komponen Wajib

```text
PermitStatusBadge
PermitTypeBadge
RiskLevelBadge
PermitWizard
WorkerValidationTable
EquipmentValidationTable
GasTestPanel
LotoIsolationPanel
SimopsConflictPanel
PermitTimeline
ActivePermitBoard
PermitQRCode
PermitReportPreview
PermitCloseoutPanel
```

## UX Penting

- Permit creation harus wizard, bukan satu form panjang.
- Field conditional berdasarkan permit type.
- Mobile-friendly untuk field verification.
- QR permit mudah discan security/HSE.
- Active board harus cepat dan filterable.
- Warning/block validation harus jelas.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Permit

```text
permit.view
permit.view_all
permit.create
permit.update
permit.delete
permit.submit
permit.review
permit.approve
permit.reject
permit.request_revision
permit.activate
permit.extend
permit.suspend
permit.resume
permit.close
permit.cancel
permit.export
permit.manage_settings
```

### Gas Test

```text
permit.gas_test.view
permit.gas_test.create
permit.gas_test.update
permit.gas_test.verify
```

### LOTO

```text
permit.loto.view
permit.loto.create
permit.loto.apply
permit.loto.verify
permit.loto.remove
```

### SIMOPS

```text
permit.simops.view
permit.simops.check
permit.simops.approve
permit.simops.reject
```

### QR

```text
permit.qr.generate
permit.qr.verify
```

## Scope

```text
Global
Company
Site
Project
Department
Location
Own
Assigned
Area Owner
Permit Issuer
HSE Reviewer
Contractor
Worker
Security Viewer
```

## Security Rules

- Semua query wajib filter company_id.
- User Site A tidak boleh melihat permit Site B kecuali punya scope company/global.
- Contractor hanya melihat permit yang terkait perusahaannya.
- Worker hanya melihat permit yang melibatkan dirinya jika diberikan akses.
- Security viewer hanya boleh scan/verify QR dan melihat ringkasan permit.
- QR verification tidak boleh membuka data sensitif.
- Gas test hanya boleh dibuat/verifikasi oleh role yang berwenang.
- LOTO remove harus butuh permission khusus.
- Suspend permit harus butuh permission khusus.
- Export permit report harus audit logged.
- Permit close-out harus memastikan critical requirement selesai.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Permit Type Configuration
Permit Request
Workflow Approval
JSA / Risk Integration
Worker Competency Validation
Contractor Validation
Equipment Validation
Gas Test
LOTO / Isolation
SIMOPS / Clash Detection
Activation / Extension / Suspension
Close-Out
QR Verification
Active Permit Board
Attachment Security
Notification
Audit Log
Dashboard Calculation
Report Export
Regression Test
```

## Release Gate

Permit to Work hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Permit workflow PASS
JSA/Risk integration PASS
Competency validation PASS
Gas test validation PASS
LOTO validation PASS
SIMOPS clash detection PASS
QR verification PASS
Active permit board PASS
Attachment security PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
PERMIT TO WORK STABILIZED: GO
```

Jika gagal:

```text
PERMIT TO WORK STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Risk Management / HIRADC / JSA

```text
- Permit can link to approved JSA.
- Permit can import controls from JSA.
- High risk permit requires risk review.
- Missing JSA can block submission depending on permit type.
```

## Training & Competency

```text
- Worker certificate validation.
- Expired certificate can block or warn.
- Required training based on permit type.
- Permit close-out can create training need if competency gap found.
```

## Contractor Management

```text
- Contractor must be active/approved.
- Contractor document compliance can block/warn.
- Contractor worker list used in permit.
- Contractor performance can include permit compliance.
```

## Asset & Equipment

```text
- Equipment certificate validation.
- Asset can be selected in permit.
- LOTO points linked to asset.
- Equipment defect can create action/finding.
```

## Audit & Inspection

```text
- Inspection can inspect active permit.
- Critical permit finding can suspend permit.
- Permit checklist can use audit/inspection checklist templates.
```

## Document Control

```text
- SOP/WI/Method Statement can be linked.
- Permit type can require specific documents.
- Document revision can be triggered by PTW lesson learned.
```

## Incident Management

```text
- Incident can be linked to active permit.
- Permit history can support investigation.
- High severity incident can auto-suspend related permit, optional.
```

## Emergency Response

```text
- Confined space permit can require rescue plan.
- Hot work can require fire/emergency equipment.
- Emergency drill lessons can become PTW control.
```


---

# Permit to Work Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Permit Type & Permit Configuration
03 Permit Request Core
04 Job Scope, Location & Work Party
05 JSA / Risk Assessment Integration
06 PPE, Tools, Equipment & Asset Requirement
07 Worker Competency & Certificate Validation
08 Gas Test, Confined Space & Hot Work Controls
09 LOTO, Isolation & Energy Control
10 SIMOPS, Area Conflict & Permit Clash Detection
11 Approval Workflow, Activation, Extension & Suspension
12 Close-Out, Handover, Evidence & Lessons Learned
13 Dashboard, QR Permit, Active Board & Reporting
14 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Permit to Work Sequence. Kerjakan sequence berikutnya sesuai sequence/00_PTW_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
PERMIT TO WORK STABILIZED: GO
```
