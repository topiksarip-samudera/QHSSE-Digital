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
