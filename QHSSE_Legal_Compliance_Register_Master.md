# START HERE — QHSSE Legal & Compliance Register Generating Pack

Paket ini untuk generate modul **Legal & Compliance Register** setelah Training & Competency.

## Rekomendasi Split

Sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 Regulation & Standard Register
03 Legal Requirement / Obligation Mapping
04 Applicability Matrix by Site / Department / Activity
05 Evidence Register & Document Link
06 Compliance Assessment
07 Gap Analysis & Corrective Action
08 Review Schedule & Regulatory Update Log
09 Integration with Audit, Document, Training, Permit & Risk
10 Dashboard, Compliance Score & Reporting
11 Notification, Escalation & Compliance Calendar
12 QA, Test, Permission & Stabilization
```

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_LEGAL_COMPLIANCE.md`.
3. Mulai dari `sequence/01_foundation_master_data.md`.
4. Kerjakan satu sequence saja.
5. Setelah selesai tulis `SELESAI LEGAL COMPLIANCE SEQUENCE XX`.
6. Jangan lanjut sequence berikutnya sebelum diminta.

Status akhir:

```text
LEGAL COMPLIANCE STABILIZED: GO
```


---

# PROMPT AWAL LEGAL & COMPLIANCE REGISTER

Core Platform sudah stabil. Incident Management, Risk Management, Audit & Inspection, Permit to Work, Document Control, dan Training & Competency sudah selesai atau siap integrasi.

Sekarang generate **Legal & Compliance Register** berdasarkan folder `qhsse_legal_compliance_register_generating_pack`.

Aturan wajib:
1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan Core Platform: tenant, site, department, role permission, module ON/OFF, master data, workflow, action tracking, attachment/evidence, audit log, notification, numbering, calendar, dashboard, API/webhook.
4. Modul ini tidak boleh hanya daftar regulasi.
5. Harus ada regulation register, requirement mapping, obligation mapping, applicability matrix, evidence register, compliance assessment, gap analysis, action plan, review schedule, regulatory update log, compliance calendar, dashboard, dan QA.
6. Semua data wajib tenant-safe dengan `company_id`.
7. Semua API wajib permission-guarded.
8. Semua compliance decision penting harus human-reviewed.
9. Setelah selesai tulis `SELESAI LEGAL COMPLIANCE SEQUENCE 01: Foundation & Master Data`.
10. Jangan lanjut sequence berikutnya sebelum saya minta continue.


---

# MASTER BLUEPRINT — Legal & Compliance Register

## Tujuan Modul

Legal & Compliance Register digunakan untuk mengelola regulasi, standar, persyaratan hukum, compliance obligation, applicability, evidence, assessment, gap analysis, action plan, review schedule, regulatory update, audit readiness, dan compliance score.

## Prinsip Desain

- Regulation memiliki version dan status.
- Regulation memiliki banyak legal requirements.
- Requirement memiliki banyak obligations.
- Obligation memiliki applicability by site/department/activity/process/asset/permit type.
- Evidence bisa berasal dari document, attachment, audit, training, permit, environment, asset, atau external source.
- Assessment menghasilkan compliance status, score, evidence review, dan gap.
- Gap harus bisa membuat action di Action Tracking Core.
- Review schedule dan regulatory update harus memiliki calendar dan notification.
- Final compliance decision harus human-reviewed.

## Submodul

```text
Regulation Register
Standard Register
Legal Requirement Register
Compliance Obligation Mapping
Applicability Matrix
Evidence Register
Compliance Assessment
Gap Analysis
Corrective Action
Review Schedule
Regulatory Update Log
Compliance Calendar
Compliance Dashboard
Compliance Reporting
Audit Readiness
Settings & Master Data
```

## Compliance Status

```text
Compliant
Partially Compliant
Non-Compliant
Not Applicable
Under Review
Evidence Missing
Assessment Due
Action In Progress
Closed
```

## Integrasi Utama

```text
Document Control → evidence, SOP, policy, legal document
Training & Competency → mandatory training and certificate evidence
Audit & Inspection → compliance audit and legal finding
Permit to Work → permit obligation and high-risk work evidence
Risk Management → compliance risk and legal control
Incident Management → incident reporting obligation
Environment Management → environmental permit, monitoring, waste manifest
Asset & Equipment → certificate, inspection, calibration requirement
```


---

# LEGAL & COMPLIANCE GENERATING RULES

## Aturan Utama

1. Jangan membuat modul sebagai tabel regulasi biasa.
2. Regulation harus punya version dan status.
3. Requirement/obligation harus bisa dimapping.
4. Applicability matrix wajib ada.
5. Evidence register wajib bisa link ke modul lain.
6. Assessment wajib menghasilkan status/score/evidence/gap.
7. Gap wajib bisa membuat action.
8. Calendar dan notification wajib untuk review due, assessment due, evidence due, dan gap overdue.
9. Semua critical changes wajib audit log.
10. Semua data wajib tenant-safe.
11. Semua API wajib permission guard.

## Permission Standard

```text
legal_compliance.view
legal_compliance.view_all
legal_compliance.create
legal_compliance.update
legal_compliance.delete
legal_compliance.review
legal_compliance.approve
legal_compliance.assess
legal_compliance.export
legal_compliance.manage_settings
regulation.view
regulation.create
regulation.update
regulation.archive
obligation.view
obligation.create
obligation.update
obligation.assess
compliance_evidence.view
compliance_evidence.create
compliance_evidence.verify
compliance_gap.view
compliance_gap.create
compliance_gap.assign_action
compliance_gap.verify
compliance_gap.close
```

## Audit Log Wajib

```text
regulation.created
regulation.updated
regulation.activated
regulation.superseded
requirement.created
obligation.created
applicability.changed
evidence.added
evidence.verified
assessment.created
assessment.approved
gap.created
gap.action_assigned
gap.closed
review.completed
regulatory_update.created
report.exported
settings.changed
```


---

# DATABASE MODEL GUIDE

## Tabel Minimal

```text
legal_compliance_settings
regulation_types
regulation_categories
regulations
regulation_versions
legal_requirements
compliance_obligations
obligation_applicability
compliance_evidence
compliance_assessments
compliance_assessment_items
compliance_gaps
compliance_gap_actions
compliance_reviews
regulatory_update_logs
compliance_calendar_events
compliance_links
compliance_scores
```

## Common Fields

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

## Main Fields

### regulations

```text
regulation_number
title
regulation_type_id
regulation_category_id
issuing_authority
jurisdiction
effective_date
source_url
summary
owner_id
current_version_id
status
```

### legal_requirements

```text
regulation_id
requirement_number
clause_reference
requirement_title
requirement_text
requirement_summary
requirement_category
risk_level
mandatory_evidence
review_frequency_months
status
```

### compliance_obligations

```text
requirement_id
obligation_number
obligation_title
obligation_description
obligation_type
responsible_department_id
responsible_person_id
evidence_required
assessment_frequency_months
next_assessment_date
status
```

### obligation_applicability

```text
obligation_id
site_id
department_id
activity_id optional
asset_type_id optional
permit_type_id optional
applicability_status
justification
reviewed_by
approved_by
approved_at
```

### compliance_evidence

```text
obligation_id
evidence_number
evidence_type
source_module
source_record_id
document_id
file_id
description
evidence_date
valid_until
verification_status
verified_by
verified_at
```

### compliance_gaps

```text
gap_number
obligation_id
assessment_id
gap_title
gap_description
severity
root_cause
action_required
action_id
due_date
pic_id
verification_status
status
```


---

# API CONTRACT GUIDE

Prefix: `/api/v1`

## Regulation

```text
GET    /regulations
POST   /regulations
GET    /regulations/:id
PATCH  /regulations/:id
DELETE /regulations/:id
POST   /regulations/:id/activate
POST   /regulations/:id/supersede
POST   /regulations/:id/archive
GET    /regulations/:id/versions
POST   /regulations/:id/versions
```

## Requirement & Obligation

```text
GET    /legal-requirements
POST   /legal-requirements
GET    /legal-requirements/:id
PATCH  /legal-requirements/:id
GET    /regulations/:id/requirements
POST   /regulations/:id/requirements
GET    /compliance-obligations
POST   /compliance-obligations
GET    /compliance-obligations/:id
PATCH  /compliance-obligations/:id
```

## Applicability & Evidence

```text
GET  /compliance-obligations/:id/applicability
POST /compliance-obligations/:id/applicability
PATCH /obligation-applicability/:id
POST /obligation-applicability/:id/approve
GET  /compliance-evidence
POST /compliance-evidence
GET  /compliance-evidence/:id
PATCH /compliance-evidence/:id
POST /compliance-evidence/:id/verify
POST /compliance-evidence/:id/reject
```

## Assessment & Gap

```text
GET  /compliance-assessments
POST /compliance-assessments
GET  /compliance-assessments/:id
PATCH /compliance-assessments/:id
POST /compliance-assessments/:id/submit
POST /compliance-assessments/:id/approve
POST /compliance-assessments/:id/generate-gaps
GET  /compliance-gaps
POST /compliance-gaps
GET  /compliance-gaps/:id
PATCH /compliance-gaps/:id
POST /compliance-gaps/:id/assign-action
POST /compliance-gaps/:id/verify
POST /compliance-gaps/:id/close
```

## Calendar, Dashboard, Report

```text
GET /legal-compliance/calendar
GET /legal-compliance/dashboard
GET /legal-compliance/kpi
GET /legal-compliance/compliance-score
GET /legal-compliance/audit-readiness
GET /legal-compliance/review-due
GET /legal-compliance/evidence-missing
GET /legal-compliance/export
```


---

# UI / UX GUIDE

## Sidebar

```text
Legal & Compliance
├── Overview
├── Regulation Register
├── Legal Requirements
├── Compliance Obligations
├── Applicability Matrix
├── Evidence Register
├── Compliance Assessment
├── Compliance Gaps
├── Regulatory Updates
├── Compliance Calendar
├── Reports
└── Settings
```

## Detail Tabs

```text
Overview
Requirements
Obligations
Applicability
Evidence
Assessments
Gaps
Actions
Linked Records
Attachments
Comments
Audit Trail
```

## Components

```text
ComplianceStatusBadge
ApplicabilityBadge
ObligationMatrix
EvidenceCard
AssessmentScoreCard
ComplianceGapCard
ComplianceCalendar
RegulatoryUpdateTimeline
AuditReadinessPanel
ComplianceHeatmap
EvidenceVerificationPanel
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
Owner Department
Responsible Person
Assessor
Reviewer
Approver
Evidence Owner
Gap PIC
```

## Security Rules

- Semua query wajib filter `company_id`.
- User site scope hanya boleh melihat obligation/evidence/gap yang applicable ke sitenya.
- Evidence restricted mengikuti permission document/file.
- Assessment approval butuh role khusus.
- Gap close butuh verification permission.
- Export evidence/register harus audit logged.
- Regulatory update deletion dibatasi; prefer archive.
- AI boleh membantu draft obligation/gap summary, final compliance decision tetap human-reviewed.


---

# QA & RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Regulation Register
Requirement Mapping
Obligation Mapping
Applicability Matrix
Evidence Register
Evidence Verification
Compliance Assessment
Gap Analysis
Action Tracking Integration
Review Schedule
Regulatory Update Log
Compliance Calendar
Dashboard Calculation
Report Export
Audit Log
Notification
Cross-Module Links
Regression Test
```

## Release Gate

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Regulation register PASS
Requirement mapping PASS
Obligation mapping PASS
Applicability matrix PASS
Evidence register PASS
Compliance assessment PASS
Gap to action integration PASS
Review schedule PASS
Compliance calendar PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Cross-module integration PASS
Lint/test/build PASS
```

Final status:

```text
LEGAL COMPLIANCE STABILIZED: GO
```


---

# CROSS-MODULE INTEGRATION GUIDE

## Document Control

```text
Legal evidence can link to document/revision.
Regulation file can be stored as controlled document.
Obligation can trigger SOP/policy revision.
```

## Training & Competency

```text
Obligation can create mandatory training.
Training certificate can be evidence.
Training compliance can affect obligation status.
```

## Audit & Inspection

```text
Obligation can become audit checklist item.
Audit finding can create compliance gap.
Compliance assessment can reuse audit evidence.
```

## Permit to Work

```text
Legal requirement can define mandatory permit type.
Permit record can become compliance evidence.
Missing permit for regulated activity can create gap.
```

## Risk, Incident, Environment, Asset

```text
Non-compliance can create compliance risk.
Incident report can be legal evidence.
Environment monitoring/manifest can be evidence.
Asset certificate/calibration can be evidence.
```


---

# Legal & Compliance Register Sequence

01. Foundation & Master Data
02. Regulation & Standard Register
03. Legal Requirement / Obligation Mapping
04. Applicability Matrix by Site / Department / Activity
05. Evidence Register & Document Link
06. Compliance Assessment
07. Gap Analysis & Corrective Action
08. Review Schedule & Regulatory Update Log
09. Integration with Audit, Document, Training, Permit & Risk
10. Dashboard, Compliance Score & Reporting
11. Notification, Escalation & Compliance Calendar
12. QA, Test, Permission & Stabilization

## Prompt Continue

```text
Continue Legal & Compliance Sequence. Kerjakan sequence berikutnya sesuai sequence/00_LEGAL_COMPLIANCE_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
LEGAL COMPLIANCE STABILIZED: GO
```
