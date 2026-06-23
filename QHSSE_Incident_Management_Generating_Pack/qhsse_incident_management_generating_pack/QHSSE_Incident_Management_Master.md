# FILE: README_START_HERE.md

# START HERE — QHSSE Incident Management Generating Pack

Paket ini digunakan setelah:

```text
Core Platform
→ Stabilization & QA
→ CORE PLATFORM STABILIZED: GO
```

Baru setelah itu mulai generate modul:

```text
QHSSE Operational Modules
→ 01 Incident Management
```

## Tujuan Paket

Membantu AI Agent membangun modul **Incident Management** secara sequence, tidak langsung sekaligus.

Modul Incident Management harus memanfaatkan Core Platform yang sudah tersedia:

```text
Tenant / Company
Site / Department / Location
User / Role / Permission / Scope
Module ON/OFF
Master Data
Workflow Engine
Action Tracking
Attachment / Evidence
Comment Thread
Audit Log
Notification
Numbering
Dashboard
Form Builder optional
Checklist Builder optional
API Key / Webhook
```

## Kenapa Harus Split

Incident Management terlalu besar untuk digenerate satu kali. Modul ini mencakup:

```text
Incident Report
Classification
Severity
People/Injury/Witness/Asset
Workflow Review
Investigation
Root Cause Analysis
CAPA
Evidence
Notification
Lessons Learned
Dashboard
KPI
Report
QA
```

Jika digenerate sekaligus, hasil biasanya:

- Workflow bercampur dengan report.
- RCA dan CAPA tidak terintegrasi.
- Attachment tidak aman.
- Permission backend sering terlewat.
- Audit log tidak konsisten.
- Dashboard angka tidak akurat.
- Tenant isolation rawan bocor.

## Split Terbaik

Gunakan 12 sequence:

```text
01 Foundation & Master Data
02 Incident Report Core
03 Classification & Severity
04 People, Injury, Witness & Asset Involved
05 Initial Review & Workflow
06 Investigation
07 Root Cause Analysis
08 CAPA
09 Evidence, Attachment, Comment & Timeline
10 Notification, Escalation & Lessons Learned
11 Dashboard, KPI & Reporting
12 QA, Test, Permission & Stabilization
```

## Cara Pakai

1. Baca `00_PROMPT_AWAL_INCIDENT_MANAGEMENT.md`
2. Baca `01_INCIDENT_MANAGEMENT_MASTER_BLUEPRINT.md`
3. Baca `02_INCIDENT_GENERATING_RULES.md`
4. Mulai dari `sequence/00_INCIDENT_SEQUENCE.md`
5. Kerjakan sequence 01 saja.
6. Setelah selesai, AI Agent harus tulis `SELESAI INCIDENT SEQUENCE 01`.
7. Jangan lanjut sequence berikutnya sebelum user meminta `Continue Incident Management Sequence`.
8. Setelah sequence 12 lulus, tulis `INCIDENT MANAGEMENT STABILIZED: GO`.

## Output Akhir

Modul Incident Management harus siap digunakan dengan:

```text
Incident report
Incident classification
Investigation
RCA
CAPA
Evidence
Workflow approval
Notification
Audit log
Dashboard KPI
PDF/Excel export
Permission & tenant isolation
QA release gate
```


---

# FILE: 00_PROMPT_AWAL_INCIDENT_MANAGEMENT.md

# 00 — PROMPT AWAL INCIDENT MANAGEMENT UNTUK AI AGENT

Core Platform sudah selesai dan Stabilization & QA sudah GO.

Sekarang mulai generate QHSSE Operational Module pertama: **Incident Management**.

Baca seluruh file dalam folder `qhsse_incident_management_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Selesaikan satu sequence sampai database, backend, frontend, permission, audit log, test, dan acceptance criteria terpenuhi.
4. Setelah sequence selesai, tulis `SELESAI INCIDENT SEQUENCE <nomor>`.
5. Jangan lanjut sequence berikutnya sebelum diminta.
6. Gunakan Core Platform yang sudah tersedia:
   - tenant/company
   - site/department/location
   - role & permission
   - module ON/OFF
   - master data
   - workflow
   - action tracking
   - attachment/evidence
   - audit log
   - notification
   - numbering
   - dashboard
   - comments
7. Jangan hardcode master data, workflow, severity matrix, numbering, atau permission.
8. Semua API harus dicek permission dan tenant isolation.
9. Semua critical action harus masuk audit log.
10. Semua file evidence harus aman dan tidak public tanpa permission.
11. Semua status perubahan penting harus memicu workflow/audit log/notification jika relevan.
12. Setelah sequence 12 selesai dan QA lulus, tulis `INCIDENT MANAGEMENT STABILIZED: GO`.

Mulai sekarang hanya kerjakan sequence pertama: Foundation & Master Data.


---

# FILE: 01_INCIDENT_MANAGEMENT_MASTER_BLUEPRINT.md

# 01 — INCIDENT MANAGEMENT MASTER BLUEPRINT

## Tujuan Modul

Incident Management adalah modul untuk mengelola semua kejadian QHSSE dari pelaporan awal, review, klasifikasi, investigasi, root cause analysis, CAPA, lessons learned, hingga close-out.

## Jenis Incident

```text
Near Miss
Unsafe Act
Unsafe Condition
First Aid Case
Medical Treatment Case
Restricted Work Case
Lost Time Injury
Fatality
Property Damage
Vehicle Incident
Fire Incident
Explosion Incident
Environmental Incident
Spill Incident
Security Incident
Quality Incident
Equipment Failure
Process Safety Event
Community Complaint
```

## Modul Harus Mendukung

```text
Create incident
Edit incident
List incident
Detail incident
Archive incident
Submit incident
Initial review
Classification
Investigator assignment
Investigation
Witness statement
People involved
Injury detail
Asset/equipment involved
Vehicle involved
Environmental impact
Property damage
Root cause analysis
5 Why
Fishbone
CAPA
Lessons learned
Workflow approval
Evidence
Comment
Timeline
Audit trail
Notification
Dashboard
KPI
Report export
```

## Workflow Utama

```text
Draft
→ Submitted
→ Initial Review
→ Classification
→ Investigation Required / No Investigation Required
→ Investigator Assigned
→ Investigation In Progress
→ RCA Review
→ CAPA Assigned
→ CAPA Verification
→ Lessons Learned
→ Management Approval
→ Closed
```

## Workflow Sederhana untuk Minor Incident

```text
Draft
→ Submitted
→ Initial Review
→ Corrective Action Assigned
→ Verified
→ Closed
```

## Escalation Workflow untuk High Severity

```text
High Severity / Major / Fatal
→ Auto alert Site Manager
→ Auto alert Corporate QHSSE
→ Mandatory investigation team
→ Mandatory RCA
→ Mandatory CAPA
→ Mandatory lessons learned
→ Management approval required
```

## Status Incident

```text
draft
submitted
in_review
revision_required
investigation_required
investigator_assigned
investigation_in_progress
rca_in_progress
capa_assigned
pending_verification
pending_management_approval
closed
cancelled
archived
```

## Severity Model

Minimal:

```text
Low
Medium
High
Major
Critical / Fatal
```

Atau configurable via master data.

## Consequence Model

```text
People
Environment
Asset / Property
Production / Operation
Reputation
Security
Quality
Legal / Compliance
```

## Core Integration

### Workflow

Incident harus memakai workflow engine, bukan hardcode approval.

### Action Tracking

CAPA harus dibuat sebagai action yang linked ke incident.

### Attachment

Evidence harus memakai attachment core.

### Audit Log

Semua perubahan penting harus tercatat.

### Notification

High severity, assignment, approval, overdue CAPA, close-out harus mengirim notification.

### Numbering

Incident number harus memakai numbering core:

```text
INC-{SITE}-{YYYY}-{0001}
```

### Permission

Gunakan permission:

```text
incident.view
incident.view_all
incident.create
incident.update
incident.delete
incident.submit
incident.review
incident.classify
incident.assign_investigator
incident.investigate
incident.rca
incident.capa
incident.verify
incident.approve_close
incident.close
incident.export
incident.manage_settings
```

## Standard Page Structure

```text
Incident Dashboard
Incident List
Create Incident
Incident Detail
Edit Incident
Classification Tab
People/Injury Tab
Investigation Tab
RCA Tab
CAPA Tab
Evidence Tab
Timeline Tab
Comments Tab
Audit Trail Tab
Reports
Settings
```

## Standard Detail Tabs

```text
Overview
Classification
People / Injury / Witness
Investigation
Root Cause Analysis
CAPA
Evidence
Timeline
Comments
Workflow
Audit Trail
Reports
```

## Webhook Events

```text
incident.created
incident.submitted
incident.high_severity
incident.reviewed
incident.investigator_assigned
incident.investigation_started
incident.rca_completed
incident.capa_created
incident.capa_overdue
incident.lessons_learned_published
incident.closed
```

## AI Assistant Optional

AI boleh membantu:

```text
Generate incident summary
Suggest classification
Suggest RCA draft
Generate 5 Why draft
Suggest CAPA
Generate lessons learned
Generate investigation report draft
```

AI tidak boleh:

```text
Approve incident
Close incident
Change severity final without human approval
Delete incident
Submit external report automatically
```


---

# FILE: 02_INCIDENT_GENERATING_RULES.md

# 02 — INCIDENT MANAGEMENT GENERATING RULES

## Aturan Wajib

1. Jangan membuat modul Incident berdiri sendiri tanpa Core Platform.
2. Semua record Incident harus punya `company_id`.
3. Semua API harus memakai tenant guard.
4. Semua API harus memakai permission guard.
5. Semua perubahan status harus masuk audit log.
6. Semua attachment harus memakai attachment service core.
7. Semua CAPA harus memakai action tracking core.
8. Semua approval harus memakai workflow engine core.
9. Semua notification harus memakai notification core.
10. Semua numbering harus memakai numbering core.
11. Semua master data harus configurable.
12. Jangan hardcode severity, type, category, atau root cause.
13. Jangan lanjut sequence berikutnya sebelum sequence sekarang lulus acceptance criteria.

## Definition of Done per Sequence

Setiap sequence dianggap selesai jika:

```text
Database/migration selesai
Backend API selesai
DTO validation selesai
Permission guard selesai
Tenant isolation selesai
Audit log selesai
Frontend page/component selesai
Test minimal selesai
Acceptance criteria terpenuhi
```

## Backend Minimal per Sequence

```text
DTO
Service
Controller
Policy/Permission
Tenant filter
Audit log integration
Validation
Error handling
Test
```

## Frontend Minimal per Sequence

```text
List/detail/form jika relevan
Tab jika relevan
Loading state
Empty state
Error state
Permission-aware UI
Responsive layout
```

## Testing Minimal

```text
Create/read/update
Permission denied
Tenant isolation
Validation error
Audit log created
Workflow status if relevant
Notification if relevant
```

## Status Akhir per Sequence

AI Agent wajib menutup dengan format:

```text
SELESAI INCIDENT SEQUENCE XX: <nama sequence>

Yang dibuat:
- Database:
- Backend:
- Frontend:
- Permission:
- Audit log:
- Test:
- Catatan:

Jangan lanjut sequence berikutnya sebelum diminta.
```


---

# FILE: sequence/00_INCIDENT_SEQUENCE.md

# 00 — INCIDENT MANAGEMENT SEQUENCE

Kerjakan berurutan:

1. `01_foundation_master_data.md`
2. `02_incident_report_core.md`
3. `03_classification_severity.md`
4. `04_people_injury_witness_asset.md`
5. `05_initial_review_workflow.md`
6. `06_investigation.md`
7. `07_root_cause_analysis.md`
8. `08_capa_corrective_preventive_action.md`
9. `09_evidence_attachment_comment_timeline.md`
10. `10_notification_escalation_lessons_learned.md`
11. `11_dashboard_kpi_reporting.md`
12. `12_qa_test_permission_stabilization.md`

## Prompt Continue

```text
Continue Incident Management Sequence. Kerjakan sequence berikutnya sesuai 00_INCIDENT_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Syarat Lanjut ke Risk Management

Hanya lanjut jika sequence 12 menghasilkan:

```text
INCIDENT MANAGEMENT STABILIZED: GO
```
