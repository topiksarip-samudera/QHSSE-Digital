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
