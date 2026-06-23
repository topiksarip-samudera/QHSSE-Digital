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
