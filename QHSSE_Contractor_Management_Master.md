# START HERE — QHSSE Contractor Management Generating Pack

Tanggal: 2026-06-22

Paket ini dibuat untuk menghasilkan modul **Contractor Management** pada WebApp QHSSE secara sequence, aman, dan terintegrasi.

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

Modul **Contractor Management** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Contractor Register & Profile
03 Prequalification & Approval Workflow
04 Contractor Document Submission & Review
05 Contractor Worker Register
06 Worker Competency, Training & Certificate Validation
07 Contractor Equipment & Asset Register
08 Contractor Permit, Security Access & Gate Pass Integration
09 Contractor Audit, Inspection, Incident & Performance
10 Suspension, Watchlist, Blacklist & Corrective Action
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Contractor Management bukan hanya daftar vendor. Modul ini harus mengontrol:

```text
Legalitas contractor
Dokumen perusahaan
Prequalification
Worker competency
Training certificate
Equipment certificate
Permit eligibility
Security access
Audit score
Incident history
Performance score
Suspension / blacklist / watchlist
```

Jika digenerate sekaligus, hasilnya biasanya hanya menjadi master data vendor. Dengan 12 sequence, modul akan menjadi contractor control system yang terhubung ke PTW, Security, Training, Audit, Incident, Document, Asset, Legal, dan Risk.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_CONTRACTOR_MANAGEMENT.md`.
3. Baca `01_CONTRACTOR_MANAGEMENT_MASTER_BLUEPRINT.md`.
4. Baca `02_CONTRACTOR_MANAGEMENT_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI CONTRACTOR SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 12 selesai:

```text
CONTRACTOR MANAGEMENT STABILIZED: GO
```


---

# 00 — PROMPT AWAL CONTRACTOR MANAGEMENT UNTUK AI AGENT

Core Platform sudah stabil. Security Management, Permit to Work, Training & Competency, Document Control, Audit & Inspection, Incident Management, Risk Management, Legal & Compliance, dan Asset & Equipment sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Contractor Management**.

Baca seluruh file dalam folder `qhsse_contractor_management_generating_pack`.

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
   - API/webhook
4. Contractor Management tidak boleh hanya menjadi daftar vendor.
5. Harus ada prequalification.
6. Harus ada document submission dan review.
7. Harus ada worker register.
8. Harus ada worker competency dan certificate validation.
9. Harus ada equipment register dan certificate validation.
10. Harus ada integration ke Permit to Work dan Security Access.
11. Harus ada contractor audit, incident history, dan performance score.
12. Harus ada suspension, watchlist, blacklist, dan reactivation workflow.
13. Semua data wajib tenant-safe.
14. Semua API wajib permission-guarded.
15. Semua approval, rejection, suspension, blacklist, document verification, dan export harus audit logged.
16. Setelah sequence selesai, tulis:
   `SELESAI CONTRACTOR SEQUENCE XX: <nama sequence>`
17. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT CONTRACTOR MANAGEMENT

## Tujuan Modul

Modul **Contractor Management** digunakan untuk mengelola contractor dari registrasi, prequalification, document compliance, worker competency, equipment validation, permit eligibility, security access, audit, incident history, performance score, sampai suspension/blacklist.

Modul ini harus menjadi pusat kontrol contractor dalam WebApp QHSSE.

## Prinsip Desain

1. Contractor Management bukan master vendor biasa.
2. Contractor harus punya status lifecycle.
3. Contractor harus melewati prequalification.
4. Dokumen contractor harus bisa disubmit, direview, diverifikasi, dan dimonitor expiry.
5. Worker contractor harus punya competency/certificate validation.
6. Equipment contractor harus punya certificate/inspection/calibration validation.
7. Contractor harus terhubung ke Permit to Work.
8. Contractor harus terhubung ke Security Management untuk gate pass, visitor, vehicle access, dan badge.
9. Contractor audit, finding, incident, dan action harus memengaruhi performance score.
10. Contractor bermasalah harus bisa masuk watchlist, suspension, atau blacklist.
11. Semua critical decision harus workflow-driven dan audit logged.
12. Semua data wajib tenant-safe.

## Submodul Utama

```text
Contractor Register
Contractor Profile
Prequalification
Document Requirement
Document Submission
Document Review
Contractor Worker Register
Worker Competency
Worker Certificate
Worker Training Validation
Contractor Equipment Register
Equipment Certificate
Permit Eligibility
Security Access
Gate Pass Integration
Contractor Audit
Contractor Inspection
Contractor Incident History
Contractor Performance Score
Suspension
Watchlist
Blacklist
Corrective Action
Dashboard & Reporting
```

## Status Contractor

```text
draft
registered
prequalification_submitted
under_review
revision_required
approved
active
conditionally_approved
suspended
watchlisted
blacklisted
expired
inactive
archived
```

## Status Dokumen Contractor

```text
not_submitted
submitted
under_review
approved
rejected
expired
expiring_soon
waived
```

## Status Worker Contractor

```text
draft
active
inactive
blocked
certificate_expired
training_incomplete
medical_expired
site_access_approved
site_access_suspended
```

## Status Equipment Contractor

```text
draft
active
out_of_service
certificate_expired
inspection_overdue
calibration_overdue
blocked
```

## Output Utama

```text
Contractor Register
Contractor Profile
Prequalification Report
Document Compliance Report
Worker Register
Worker Competency Matrix
Certificate Expiry List
Equipment Register
Equipment Certificate Register
Permit Eligibility Result
Security Access Register
Contractor Audit Report
Contractor Incident History
Performance Scorecard
Watchlist / Blacklist Register
Corrective Action List
Contractor Dashboard
```

## Integrasi Core

```text
Workflow: prequalification approval, document verification, suspension/blacklist
Action Tracking: corrective action from audit/finding/performance issue
Attachment: document submission, evidence
Notification: document expiry, certificate expiry, review due, suspension
Audit Log: critical status changes
Numbering: contractor number, worker number, equipment number, prequalification number
Dashboard: compliance and performance KPIs
API/Webhook: contractor status and eligibility events
```

## Integrasi Modul Lain

```text
Security Management:
- contractor visitor, gate pass, vehicle access, badge
- access blocked if contractor suspended/blacklisted

Permit to Work:
- contractor eligibility before permit activation
- worker competency and equipment certificate validation

Training & Competency:
- worker training/certificate validation
- training gap and expiry

Document Control:
- contractor documents, HSE plan, insurance, licenses
- controlled document acknowledgement

Audit & Inspection:
- contractor audit and finding
- inspection finding affects performance score

Incident Management:
- contractor incident history
- severe incident may trigger suspension/watchlist

Risk Management:
- contractor risk category and risk profile
- high risk contractor requires additional approval

Asset & Equipment:
- contractor equipment and certificate validation

Legal & Compliance:
- legal document compliance and evidence
```


---

# 02 — CONTRACTOR MANAGEMENT GENERATING RULES

## Aturan Utama

1. Jangan membuat Contractor Management sebagai master vendor biasa.
2. Contractor harus punya status lifecycle.
3. Prequalification harus workflow-driven.
4. Document requirement harus configurable by contractor type/risk category/scope.
5. Document expiry harus punya notification dan compliance status.
6. Worker contractor harus dapat divalidasi training/certificate/medical optional.
7. Equipment contractor harus dapat divalidasi certificate/inspection/calibration.
8. Contractor eligibility harus bisa dipakai oleh PTW dan Security.
9. Performance score harus dihitung dari audit, incident, finding, action, document, certificate, permit, dan compliance.
10. Suspension, watchlist, blacklist harus approval-driven.
11. Semua critical decision wajib audit log.
12. Semua data wajib tenant-safe.
13. Semua API wajib permission-guarded.

## Permission Standard

```text
contractor.view
contractor.view_all
contractor.create
contractor.update
contractor.delete
contractor.submit_prequalification
contractor.review
contractor.approve
contractor.reject
contractor.suspend
contractor.reactivate
contractor.blacklist
contractor.export
contractor.manage_settings

contractor_document.view
contractor_document.submit
contractor_document.review
contractor_document.approve
contractor_document.reject
contractor_document.waive

contractor_worker.view
contractor_worker.create
contractor_worker.update
contractor_worker.validate_competency
contractor_worker.block

contractor_equipment.view
contractor_equipment.create
contractor_equipment.update
contractor_equipment.validate_certificate
contractor_equipment.block

contractor_performance.view
contractor_performance.recalculate
```

## Audit Log Wajib

```text
contractor.created
contractor.updated
contractor.submitted
contractor.approved
contractor.rejected
contractor.suspended
contractor.reactivated
contractor.watchlisted
contractor.blacklisted
document.submitted
document.approved
document.rejected
document.waived
worker.created
worker.updated
worker.blocked
worker.validated
equipment.created
equipment.updated
equipment.blocked
equipment.validated
performance.recalculated
report.exported
settings.changed
```

## Webhook Events

```text
contractor.created
contractor.approved
contractor.suspended
contractor.blacklisted
contractor.document_expiring
contractor.document_expired
contractor.worker_certificate_expiring
contractor.worker_certificate_expired
contractor.equipment_certificate_expired
contractor.performance_low
contractor.eligibility_blocked
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
contractor_settings
contractor_types
contractor_categories
contractor_risk_categories
contractors
contractor_profiles
contractor_contacts
contractor_prequalifications
contractor_prequalification_items
contractor_document_requirements
contractor_documents
contractor_document_reviews
contractor_workers
contractor_worker_certificates
contractor_worker_trainings
contractor_worker_competency_checks
contractor_equipment
contractor_equipment_certificates
contractor_equipment_inspections
contractor_permit_eligibility_checks
contractor_security_access_links
contractor_audits
contractor_incident_links
contractor_performance_scores
contractor_status_histories
contractor_suspensions
contractor_watchlists
contractor_blacklists
contractor_links
```

## Field Umum Wajib

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
department_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## contractors

```text
id
company_id
contractor_number
company_name
legal_name
contractor_type_id
contractor_category_id
risk_category_id
tax_number optional
business_license_number optional
address
city
country
contact_email
contact_phone
primary_contact_name
contract_start_date optional
contract_end_date optional
scope_of_work
status
prequalification_status
document_compliance_status
worker_compliance_status
equipment_compliance_status
performance_score
workflow_instance_id optional
created_by
updated_by
created_at
updated_at
deleted_at
```

## contractor_documents

```text
id
company_id
contractor_id
requirement_id
document_type
document_name
file_id
document_number optional
issue_date optional
expiry_date optional
submitted_by
submitted_at
reviewed_by optional
reviewed_at optional
review_comment optional
verification_status
status
created_at
updated_at
```

## contractor_workers

```text
id
company_id
contractor_id
worker_number
full_name
identity_number optional
position
role
phone optional
email optional
site_id optional
medical_expiry_date optional
site_access_status
competency_status
certificate_status
training_status
status
created_by
updated_by
created_at
updated_at
deleted_at
```

## contractor_worker_certificates

```text
id
company_id
contractor_worker_id
certificate_type
certificate_name
certificate_number
issued_by
issue_date
expiry_date
file_id optional
verification_status
status
created_at
updated_at
```

## contractor_equipment

```text
id
company_id
contractor_id
equipment_number
equipment_type
equipment_name
serial_number optional
asset_tag optional
manufacturer optional
model optional
certificate_status
inspection_status
calibration_status optional
permit_eligibility_status
status
created_by
updated_by
created_at
updated_at
deleted_at
```

## contractor_performance_scores

```text
id
company_id
contractor_id
period
document_score
training_score
safety_score
quality_score
audit_score
incident_score
action_closure_score
permit_compliance_score
overall_score
rating
calculated_at
created_at
updated_at
```

## Index Wajib

```text
company_id
contractor_number
contractor_id
status
prequalification_status
document_compliance_status
worker_compliance_status
equipment_compliance_status
performance_score
expiry_date
created_at
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Contractor Core

```text
GET    /contractors
POST   /contractors
GET    /contractors/:id
PATCH  /contractors/:id
DELETE /contractors/:id
POST   /contractors/:id/submit-prequalification
POST   /contractors/:id/review
POST   /contractors/:id/approve
POST   /contractors/:id/reject
POST   /contractors/:id/suspend
POST   /contractors/:id/reactivate
POST   /contractors/:id/watchlist
POST   /contractors/:id/blacklist
```

## Documents

```text
GET  /contractors/:id/document-requirements
POST /contractors/:id/document-requirements
GET  /contractors/:id/documents
POST /contractors/:id/documents
GET  /contractor-documents/:documentId
PATCH /contractor-documents/:documentId
POST /contractor-documents/:documentId/review
POST /contractor-documents/:documentId/approve
POST /contractor-documents/:documentId/reject
POST /contractor-documents/:documentId/waive
```

## Workers

```text
GET    /contractors/:id/workers
POST   /contractors/:id/workers
GET    /contractor-workers/:workerId
PATCH  /contractor-workers/:workerId
DELETE /contractor-workers/:workerId
GET    /contractor-workers/:workerId/certificates
POST   /contractor-workers/:workerId/certificates
POST   /contractor-workers/:workerId/validate-competency
POST   /contractor-workers/:workerId/block
POST   /contractor-workers/:workerId/approve-site-access
```

## Equipment

```text
GET    /contractors/:id/equipment
POST   /contractors/:id/equipment
GET    /contractor-equipment/:equipmentId
PATCH  /contractor-equipment/:equipmentId
DELETE /contractor-equipment/:equipmentId
GET    /contractor-equipment/:equipmentId/certificates
POST   /contractor-equipment/:equipmentId/certificates
POST   /contractor-equipment/:equipmentId/validate-certificate
POST   /contractor-equipment/:equipmentId/block
```

## Eligibility

```text
POST /contractors/:id/check-permit-eligibility
POST /contractor-workers/:workerId/check-permit-eligibility
POST /contractor-equipment/:equipmentId/check-permit-eligibility
POST /contractors/:id/check-security-access-eligibility
```

## Audit, Incident, Performance

```text
GET  /contractors/:id/audits
GET  /contractors/:id/incidents
GET  /contractors/:id/findings
GET  /contractors/:id/actions
GET  /contractors/:id/performance
POST /contractors/:id/performance/recalculate
```

## Dashboard & Reports

```text
GET /contractor-management/dashboard
GET /contractor-management/kpi
GET /contractor-management/expiring-documents
GET /contractor-management/expiring-certificates
GET /contractor-management/low-performance
GET /contractors/export
GET /contractors/:id/report
```

## Settings

```text
GET   /contractor-management/settings
PATCH /contractor-management/settings
GET   /contractor-management/master-data
```


---

# 05 — UI/UX GUIDE CONTRACTOR MANAGEMENT

## Sidebar

```text
Contractor Management
├── Overview
├── Contractor Register
├── Prequalification
├── Document Review
├── Worker Register
├── Worker Certificates
├── Equipment Register
├── Equipment Certificates
├── Permit Eligibility
├── Security Access
├── Contractor Audit
├── Performance
├── Watchlist / Blacklist
├── Reports
└── Settings
```

## Contractor Detail Tabs

```text
Overview
Profile
Prequalification
Documents
Workers
Worker Certificates
Equipment
Equipment Certificates
Permit Eligibility
Security Access
Audits & Inspections
Incidents
Actions
Performance
Status History
Attachments
Comments
Audit Trail
```

## Create Contractor Wizard

```text
Step 1: Company Profile
Step 2: Scope of Work
Step 3: Risk Category
Step 4: Document Requirements
Step 5: Contacts
Step 6: Review & Submit
```

## Komponen Wajib

```text
ContractorStatusBadge
ContractorRiskBadge
DocumentComplianceBadge
WorkerComplianceBadge
EquipmentComplianceBadge
PerformanceScoreCard
PrequalificationChecklist
DocumentReviewPanel
WorkerCertificateTable
EquipmentCertificateTable
EligibilityResultPanel
WatchlistBlacklistPanel
ContractorTimeline
```

## UX Penting

- Status contractor harus jelas.
- Expired/expiring document harus mudah terlihat.
- Worker certificate gap harus mudah difilter.
- Equipment certificate gap harus mudah difilter.
- Permit eligibility harus menunjukkan alasan block/warning.
- Security access harus menunjukkan apakah contractor boleh masuk site.
- Performance score harus transparan dan bisa drill down.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

```text
contractor.view
contractor.view_all
contractor.create
contractor.update
contractor.delete
contractor.review
contractor.approve
contractor.reject
contractor.suspend
contractor.reactivate
contractor.watchlist
contractor.blacklist
contractor.export
contractor.manage_settings

contractor_document.view
contractor_document.submit
contractor_document.review
contractor_document.approve
contractor_document.reject
contractor_document.waive

contractor_worker.view
contractor_worker.create
contractor_worker.update
contractor_worker.validate_competency
contractor_worker.approve_site_access
contractor_worker.block

contractor_equipment.view
contractor_equipment.create
contractor_equipment.update
contractor_equipment.validate_certificate
contractor_equipment.block

contractor_performance.view
contractor_performance.recalculate
```

## Scope

```text
Global
Company
Site
Project
Department
Contractor Owner
Contractor Contact
Reviewer
Approver
HSE Reviewer
Security Reviewer
Permit Issuer
```

## Security Rules

- Semua query wajib filter company_id.
- Contractor contact hanya dapat melihat contractor miliknya jika external portal diaktifkan.
- User site scope hanya dapat melihat contractor yang aktif di sitenya.
- Document download harus permission-guarded.
- Worker personal data harus minim dan permission-aware.
- Blacklist/suspension wajib approval permission.
- Contractor eligibility result tidak boleh dimanipulasi dari frontend.
- Export contractor data wajib audit log.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Contractor Register
Prequalification Workflow
Document Submission & Review
Document Expiry
Worker Register
Worker Competency Validation
Equipment Register
Equipment Certificate Validation
Permit Eligibility
Security Access Eligibility
Audit/Incident/Performance Integration
Suspension / Watchlist / Blacklist
Dashboard Calculation
Report Export
Audit Log
Notification
Regression Test
```

## Release Gate

Contractor Management hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Contractor register PASS
Prequalification workflow PASS
Document review PASS
Worker validation PASS
Equipment validation PASS
Permit eligibility PASS
Security access eligibility PASS
Performance scoring PASS
Suspension/blacklist workflow PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Cross-module integration PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
CONTRACTOR MANAGEMENT STABILIZED: GO
```

Jika gagal:

```text
CONTRACTOR MANAGEMENT STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Security Management

```text
- Contractor visitor, gate pass, vehicle access, and badge.
- Security access blocked if contractor suspended or blacklisted.
- Contractor worker site access approval.
```

## Permit to Work

```text
- Contractor must be active/approved before permit activation.
- Contractor worker certificate validation.
- Contractor equipment certificate validation.
- Contractor permit history affects performance.
```

## Training & Competency

```text
- Worker training/certificate validation.
- Training gap affects permit eligibility.
- Expired certificate notification.
```

## Document Control

```text
- Contractor documents, HSE plan, insurance, licenses.
- Contractor acknowledgement of site SOP/policy.
- Document expiry affects compliance.
```

## Audit & Inspection

```text
- Contractor audit and finding.
- Audit score affects performance score.
- Finding can create corrective action.
```

## Incident Management

```text
- Contractor incident history.
- Severe contractor incident can trigger suspension/watchlist.
- Incident count affects performance score.
```

## Risk Management

```text
- Contractor risk category.
- High risk contractor needs additional approval.
- Contractor risk review from repeated incident/finding.
```

## Asset & Equipment

```text
- Contractor equipment register.
- Equipment certificate/inspection/calibration validation.
```

## Legal & Compliance

```text
- Contractor legal document compliance.
- Legal obligations related to contractors can become document requirements.
```


---

# Contractor Management Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Contractor Register & Profile
03 Prequalification & Approval Workflow
04 Contractor Document Submission & Review
05 Contractor Worker Register
06 Worker Competency, Training & Certificate Validation
07 Contractor Equipment & Asset Register
08 Contractor Permit, Security Access & Gate Pass Integration
09 Contractor Audit, Inspection, Incident & Performance
10 Suspension, Watchlist, Blacklist & Corrective Action
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Contractor Management Sequence. Kerjakan sequence berikutnya sesuai sequence/00_CONTRACTOR_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
CONTRACTOR MANAGEMENT STABILIZED: GO
```
