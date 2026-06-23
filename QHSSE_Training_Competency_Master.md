# START HERE — QHSSE Training & Competency Generating Pack

Tanggal: 2026-06-22

Paket ini dibuat untuk menghasilkan modul **Training & Competency** pada WebApp QHSSE secara sequence, aman, dan tidak menjadi sekadar jadwal training biasa.

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

Modul **Training & Competency** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Training Matrix Core
03 Competency Matrix Core
04 Training Need Analysis
05 Training Plan & Schedule
06 Training Session, Attendance & Evidence
07 Induction & Toolbox Meeting
08 Certificate Register & Expiry Management
09 Competency Assessment & Gap Analysis
10 Integration with Document, Permit, Contractor & Risk
11 Dashboard, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Training & Competency bukan hanya jadwal training. Modul ini harus menjadi **competency control system** yang mengontrol:

```text
Required training by role
Required training by position
Required training by permit type
Required training by risk control
Certificate expiry
Competency gap
Contractor worker competency
Training compliance
Document acknowledgement
Permit blocking/warning
Training evidence
Training effectiveness
```

Jika digenerate sekaligus, biasanya hasilnya hanya menjadi training schedule biasa. Dengan 12 sequence, sistem akan lengkap dan siap diintegrasikan dengan Permit to Work, Contractor, Document Control, Risk, Incident, Audit, dan Legal Compliance.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_TRAINING_COMPETENCY.md`.
3. Baca `01_TRAINING_COMPETENCY_MASTER_BLUEPRINT.md`.
4. Baca `02_TRAINING_COMPETENCY_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI TRAINING COMPETENCY SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 12 selesai:

```text
TRAINING COMPETENCY STABILIZED: GO
```


---

# 00 — PROMPT AWAL TRAINING & COMPETENCY UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management / HIRADC / JSA, Audit & Inspection, Permit to Work, dan Document Control sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Training & Competency**.

Baca seluruh file dalam folder `qhsse_training_competency_generating_pack`.

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
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Schedule/calendar engine
   - Dashboard
   - Report export
   - API/webhook
4. Training & Competency tidak boleh hanya menjadi jadwal training.
5. Harus ada training matrix.
6. Harus ada competency matrix.
7. Harus ada training need analysis.
8. Harus ada certificate register dan expiry management.
9. Harus ada competency assessment dan gap analysis.
10. Harus terintegrasi dengan Document Control, Permit to Work, Contractor, Risk, Incident, Audit, dan Legal.
11. Semua data wajib tenant-safe.
12. Semua API wajib permission-guarded.
13. Semua attendance, certificate issue, certificate expiry, competency result, dan export penting wajib audit logged.
14. Setelah sequence selesai, tulis:
   `SELESAI TRAINING COMPETENCY SEQUENCE XX: <nama sequence>`
15. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT TRAINING & COMPETENCY

## Tujuan Modul

Modul **Training & Competency** digunakan untuk memastikan pekerja, karyawan, dan contractor worker memiliki training, kompetensi, sertifikat, induction, toolbox meeting, dan assessment yang sesuai dengan risiko pekerjaan, role, permit type, dokumen, legal requirement, dan persyaratan perusahaan.

Modul ini harus menjadi **competency control system**, bukan hanya daftar jadwal training.

## Prinsip Desain

1. Training matrix harus configurable per role, position, department, site, permit type, risk, dan legal requirement.
2. Competency matrix harus bisa mengukur skill/competency level.
3. Training need harus bisa muncul dari gap analysis, incident, audit finding, risk control, document revision, dan legal requirement.
4. Certificate expiry harus bisa memicu notification dan blocking/warning di Permit to Work.
5. Contractor worker harus bisa divalidasi kompetensinya.
6. Training material harus bisa link ke Document Control.
7. Attendance dan certificate harus punya evidence.
8. Assessment/quiz optional harus bisa dipakai untuk mengukur pemahaman.
9. Semua data harus tenant-safe.
10. Semua perubahan critical harus audit logged.

## Submodul Utama

```text
Training Matrix
Competency Matrix
Training Need Analysis
Training Plan
Training Schedule
Training Session
Attendance
Evidence
Induction
Toolbox Meeting
Certificate Register
Certificate Expiry
Competency Assessment
Quiz / Test optional
Training Evaluation
Training Material
Training Compliance Dashboard
Gap Analysis
Training Report
```

## Jenis Training

```text
General HSE Induction
Site Induction
Project Induction
Job Specific Training
Working at Height
Confined Space Entry
Hot Work
LOTO
First Aid
Fire Fighting
Defensive Driving
Lifting & Rigging
Scaffolding
Chemical Handling
Environmental Awareness
Waste Management
Quality Awareness
Security Awareness
Emergency Response
ISO 9001 Awareness
ISO 14001 Awareness
ISO 45001 Awareness
SMK3 Awareness
Permit to Work Training
Risk Assessment / HIRADC / JSA
Incident Investigation
Audit Training
```

## Lifecycle Training

```text
Training Need Identified
→ Training Planned
→ Training Scheduled
→ Participants Assigned
→ Conducted
→ Attendance Confirmed
→ Assessment optional
→ Evaluation optional
→ Certificate Issued optional
→ Competency Updated
→ Closed
```

## Certificate Lifecycle

```text
Draft
→ Issued
→ Active
→ Expiring Soon
→ Expired
→ Renewed
→ Revoked
→ Archived
```

## Competency Status

```text
Not Required
Required
Not Started
In Progress
Competent
Competent with Supervision
Not Yet Competent
Expired
Suspended
```

## Output Utama

```text
Training Matrix
Competency Matrix
Training Need Register
Training Plan
Training Schedule
Attendance Report
Induction Record
Toolbox Meeting Record
Certificate Register
Expiring Certificate List
Expired Certificate List
Competency Gap Report
Training Compliance Report
Training Effectiveness Report
Permit Blocking/Warn Validation
Contractor Competency Report
```

## Integrasi Core

```text
Schedule: training calendar
Workflow: training approval/certificate approval if needed
Attachment: attendance sheet, certificate, material, evidence
Notification: schedule, invitation, reminder, expiry, overdue
Audit Log: attendance, certificate, assessment, export
Numbering: training number, certificate number
Dashboard: KPI and compliance
API/Webhook: integration
```

## Integrasi Modul Lain

```text
Document Control:
- Training material link to SOP/WI/Policy.
- New document revision can trigger acknowledgement or retraining.

Permit to Work:
- Permit validates worker certificate/competency.
- Expired certificate can block or warn permit approval.

Contractor Management:
- Contractor worker training and certificate validation.
- Contractor compliance score uses training data.

Risk Management:
- Training can be risk control.
- High risk activity can require specific competency.

Incident Management:
- Incident RCA can create training need.
- Lessons learned can become training material.

Audit & Inspection:
- Audit finding can create training action.
- Training evidence supports audit.

Legal & Compliance:
- Mandatory training can be mapped to legal obligations.
```


---

# 02 — TRAINING & COMPETENCY GENERATING RULES

## Aturan Utama

1. Jangan membuat Training & Competency sebagai calendar CRUD biasa.
2. Training matrix dan competency matrix harus configurable.
3. Required training harus bisa berdasarkan role, position, department, site, permit type, risk, asset, contractor, dan legal obligation.
4. Certificate expiry harus punya notification dan validation logic.
5. Permit integration harus bisa block/warning sesuai setting.
6. Contractor worker competency harus supported.
7. Training material harus bisa link ke Document Control.
8. Attendance harus punya evidence dan audit log.
9. Assessment/quiz optional harus expandable.
10. Dashboard angka harus dihitung dari data nyata.
11. Semua data wajib tenant-safe.
12. Semua API wajib permission-guarded.

## Status Training Need

```text
open
planned
scheduled
in_progress
completed
cancelled
waived
```

## Status Training Session

```text
draft
scheduled
invited
in_progress
conducted
attendance_confirmed
assessment_completed
certificate_issued
closed
cancelled
```

## Status Certificate

```text
draft
issued
active
expiring_soon
expired
renewed
revoked
archived
```

## Permission Standard

```text
training.view
training.view_all
training.create
training.update
training.delete
training.schedule
training.conduct
training.attendance.manage
training.assessment.manage
training.certificate.issue
training.certificate.revoke
training.export
training.manage_settings

competency.view
competency.manage
competency.assess
competency.approve

training_matrix.view
training_matrix.manage
certificate.view
certificate.manage
```

## Audit Log Wajib

```text
training.created
training.scheduled
training.participant_added
training.attendance_confirmed
training.assessment_submitted
training.certificate_issued
training.certificate_renewed
training.certificate_revoked
training.need_created
competency.assessed
competency.status_changed
matrix.updated
report.exported
settings.changed
```

## Webhook Events

```text
training.need_created
training.scheduled
training.reminder_due
training.completed
certificate.issued
certificate.expiring
certificate.expired
competency.gap_detected
competency.updated
permit.training_validation_failed
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
training_types
training_categories
training_settings
training_matrices
training_matrix_requirements
competency_matrices
competency_items
competency_levels
training_needs
training_plans
training_schedules
training_sessions
training_participants
training_attendances
training_materials
training_assessments
training_assessment_questions
training_assessment_answers
training_evaluations
certificates
certificate_types
certificate_requirements
certificate_renewals
inductions
toolbox_meetings
toolbox_attendances
competency_assessments
competency_gap_records
training_integrations
training_reports
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

## training_matrices

```text
id
company_id
name
description
matrix_scope
site_id optional
department_id optional
role_id optional
position_id optional
permit_type_id optional
risk_level optional
is_active
created_by
updated_by
created_at
updated_at
```

## training_matrix_requirements

```text
id
company_id
training_matrix_id
training_type_id
is_mandatory
validity_months optional
renewal_required
required_for_permit
required_for_role
required_for_contractor
validation_mode
created_at
updated_at
```

`validation_mode`:

```text
block
warning
info
```

## training_sessions

```text
id
company_id
training_number
training_type_id
title
description
trainer_id optional
external_trainer_name optional
site_id
location
start_datetime
end_datetime
max_participants optional
material_document_id optional
status
workflow_instance_id optional
created_by
updated_by
created_at
updated_at
```

## training_participants

```text
id
company_id
training_session_id
user_id optional
worker_id optional
contractor_worker_id optional
name_snapshot
company_snapshot
role_snapshot
attendance_status
assessment_status
certificate_status
created_at
updated_at
```

## training_attendances

```text
id
company_id
training_session_id
participant_id
attendance_status
check_in_time optional
check_out_time optional
attendance_evidence_id optional
confirmed_by
confirmed_at
remarks
created_at
updated_at
```

## certificates

```text
id
company_id
certificate_number
certificate_type_id
holder_type
user_id optional
worker_id optional
contractor_worker_id optional
training_session_id optional
issued_date
expiry_date optional
issued_by
file_id optional
status
renewed_from_certificate_id optional
created_at
updated_at
```

## competency_assessments

```text
id
company_id
assessed_user_id optional
assessed_worker_id optional
contractor_worker_id optional
competency_item_id
assessor_id
assessment_date
result_status
competency_level_id optional
score optional
remarks
evidence_id optional
next_assessment_date optional
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
department_id
training_number
training_type_id
status
start_datetime
end_datetime
certificate_number
expiry_date
holder_type
user_id
contractor_worker_id
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Training Types & Settings

```text
GET    /training-types
POST   /training-types
GET    /training-types/:id
PATCH  /training-types/:id
DELETE /training-types/:id

GET    /training-settings
PATCH  /training-settings
```

## Training Matrix

```text
GET    /training-matrices
POST   /training-matrices
GET    /training-matrices/:id
PATCH  /training-matrices/:id
DELETE /training-matrices/:id
GET    /training-matrices/:id/requirements
POST   /training-matrices/:id/requirements
PATCH  /training-matrix-requirements/:id
DELETE /training-matrix-requirements/:id
POST   /training-matrices/evaluate
```

## Competency Matrix

```text
GET    /competency-matrices
POST   /competency-matrices
GET    /competency-matrices/:id
PATCH  /competency-matrices/:id
GET    /competency-items
POST   /competency-items
GET    /competency-assessments
POST   /competency-assessments
POST   /competency-assessments/:id/approve
GET    /competency-gaps
```

## Training Need

```text
GET    /training-needs
POST   /training-needs
GET    /training-needs/:id
PATCH  /training-needs/:id
POST   /training-needs/:id/plan
POST   /training-needs/:id/waive
POST   /training-needs/generate-from-gap
```

## Training Plan, Schedule & Session

```text
GET    /training-plans
POST   /training-plans
GET    /training-schedules
POST   /training-schedules
GET    /training-sessions
POST   /training-sessions
GET    /training-sessions/:id
PATCH  /training-sessions/:id
POST   /training-sessions/:id/invite
POST   /training-sessions/:id/start
POST   /training-sessions/:id/complete
POST   /training-sessions/:id/close
```

## Attendance & Evidence

```text
GET    /training-sessions/:id/participants
POST   /training-sessions/:id/participants
DELETE /training-sessions/:id/participants/:participantId
GET    /training-sessions/:id/attendance
POST   /training-sessions/:id/attendance
POST   /training-sessions/:id/attendance/confirm
POST   /training-sessions/:id/upload-evidence
```

## Certificate

```text
GET    /certificates
POST   /certificates
GET    /certificates/:id
PATCH  /certificates/:id
POST   /certificates/:id/renew
POST   /certificates/:id/revoke
GET    /certificates/expiring
GET    /certificates/expired
GET    /certificates/:id/download
```

## Induction & Toolbox

```text
GET    /inductions
POST   /inductions
GET    /toolbox-meetings
POST   /toolbox-meetings
GET    /toolbox-meetings/:id
POST   /toolbox-meetings/:id/attendance
POST   /toolbox-meetings/:id/close
```

## Validation & Integration

```text
POST /training-competency/validate-worker
POST /training-competency/validate-permit-workers
POST /training-competency/validate-contractor-worker
POST /training-competency/generate-gap-analysis
```

## Dashboard & Report

```text
GET /training-competency/dashboard
GET /training-competency/kpi
GET /training-competency/compliance
GET /training-competency/gap-report
GET /training-competency/export
```


---

# 05 — UI/UX GUIDE TRAINING & COMPETENCY

## Sidebar

```text
Training & Competency
├── Overview
├── Training Matrix
├── Competency Matrix
├── Training Needs
├── Training Plan
├── Training Schedule
├── Training Sessions
├── Attendance
├── Induction
├── Toolbox Meeting
├── Certificates
├── Competency Assessment
├── Gap Analysis
├── Reports
└── Settings
```

## Halaman Utama

```text
Training Dashboard
Training Matrix List
Training Matrix Detail
Competency Matrix List
Competency Matrix Detail
Training Need Register
Training Plan
Training Calendar
Training Session Detail
Attendance Page
Induction Register
Toolbox Meeting Register
Certificate Register
Expiring Certificate Page
Competency Assessment Page
Gap Analysis Page
Report Export
Settings
```

## Training Session Detail Tabs

```text
Overview
Participants
Attendance
Material
Assessment
Certificate
Evidence
Evaluation
Comments
Audit Trail
```

## Certificate Detail Tabs

```text
Overview
Holder
Training Source
File
Renewal History
Validation Usage
Audit Trail
```

## Komponen Wajib

```text
TrainingStatusBadge
CertificateStatusBadge
CompetencyStatusBadge
TrainingMatrixTable
CompetencyMatrixTable
TrainingCalendar
AttendanceTable
CertificateExpiryBadge
GapAnalysisPanel
WorkerValidationPanel
TrainingComplianceCard
TrainingEvidenceUpload
```

## UX Penting

- Training calendar harus mudah difilter site/department/training type.
- Attendance harus cepat dipakai saat training.
- Certificate expiry harus terlihat jelas.
- Gap analysis harus menjelaskan requirement yang belum terpenuhi.
- Permit validation result harus jelas: pass/warning/block.
- Contractor worker harus bisa terlihat berbeda dari internal employee.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Training

```text
training.view
training.view_all
training.create
training.update
training.delete
training.schedule
training.conduct
training.close
training.export
training.manage_settings
```

### Attendance

```text
training_attendance.view
training_attendance.manage
training_attendance.confirm
```

### Certificate

```text
certificate.view
certificate.view_all
certificate.create
certificate.issue
certificate.update
certificate.renew
certificate.revoke
certificate.download
certificate.export
```

### Competency

```text
competency.view
competency.view_all
competency.manage
competency.assess
competency.approve
competency.export
```

### Matrix

```text
training_matrix.view
training_matrix.manage
competency_matrix.view
competency_matrix.manage
```

## Scope

```text
Global
Company
Site
Project
Department
Own
Assigned
Trainer
Assessor
Participant
Contractor
```

## Security Rules

- Semua query wajib filter company_id.
- User hanya bisa melihat training sesuai scope.
- Participant hanya bisa melihat training/certificate miliknya jika diberikan akses.
- Contractor hanya bisa melihat worker/certificate contractor-nya.
- Certificate file download harus permission-guarded.
- Competency assessment hanya boleh dibuat oleh assessor berwenang.
- Certificate revoke harus butuh permission khusus.
- Export report wajib audit log.
- Validation endpoint untuk permit hanya boleh mengembalikan data yang diperlukan, bukan data sensitif penuh.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Training Matrix
Competency Matrix
Training Need Analysis
Training Schedule
Attendance
Evidence Upload
Induction
Toolbox Meeting
Certificate Register
Certificate Expiry
Competency Assessment
Gap Analysis
Document Integration
Permit Validation
Contractor Worker Validation
Dashboard Calculation
Report Export
Audit Log
Notification
Regression Test
```

## Release Gate

Training & Competency hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Training matrix PASS
Competency matrix PASS
Training need generation PASS
Attendance PASS
Certificate expiry PASS
Gap analysis PASS
Permit validation PASS
Contractor validation PASS
Document integration PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
TRAINING COMPETENCY STABILIZED: GO
```

Jika gagal:

```text
TRAINING COMPETENCY STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Document Control

```text
- Training material can link to SOP/WI/Policy.
- New document revision can trigger re-acknowledgement or retraining.
- Document acknowledgement can feed training compliance.
```

## Permit to Work

```text
- Permit validates worker certificate and competency.
- Expired certificate can block or warn permit approval.
- Permit type can define required training.
```

## Contractor Management

```text
- Contractor worker training and certificates are validated.
- Contractor compliance score can use training compliance.
- Expired contractor worker certificate creates warning/block.
```

## Risk Management

```text
- Risk control can require training.
- High-risk activity can require specific competency.
- Risk review can create training need.
```

## Incident Management

```text
- Incident RCA can create training need.
- Lessons learned can become toolbox/training material.
- Repeat incident can trigger mandatory retraining.
```

## Audit & Inspection

```text
- Audit finding can create training action.
- Training evidence supports audit finding close-out.
- Inspection can verify training compliance.
```

## Legal & Compliance

```text
- Legal obligations can define mandatory training.
- Compliance evidence can include attendance/certificates.
```


---

# Training & Competency Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Training Matrix Core
03 Competency Matrix Core
04 Training Need Analysis
05 Training Plan & Schedule
06 Training Session, Attendance & Evidence
07 Induction & Toolbox Meeting
08 Certificate Register & Expiry Management
09 Competency Assessment & Gap Analysis
10 Integration with Document, Permit, Contractor & Risk
11 Dashboard, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Training & Competency Sequence. Kerjakan sequence berikutnya sesuai sequence/00_TRAINING_COMPETENCY_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
TRAINING COMPETENCY STABILIZED: GO
```
