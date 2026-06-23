# START HERE — QHSSE Audit & Inspection Generating Pack

Tanggal: 2026-06-21

Paket ini dibuat untuk menghasilkan modul **Audit & Inspection** pada WebApp QHSSE secara sequence, aman, dan tidak bercampur.

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

Modul Audit & Inspection sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 Audit Program & Audit Plan
03 Inspection Schedule & Inspection Plan
04 Checklist Template Integration
05 Audit Execution
06 Inspection Execution
07 Finding & Nonconformity Management
08 Corrective Action & Verification
09 Scoring, Rating & Compliance Result
10 Report, Evidence, Attachment & Approval
11 Dashboard, KPI & Analytics
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Audit & Inspection menyentuh banyak core:

```text
Checklist Builder
Form Builder
Workflow
Action Tracking
Attachment
Notification
Audit Log
Schedule
Dashboard
Report Export
Permission
Tenant Isolation
```

Jika digenerate sekaligus, biasanya hasilnya bercampur antara audit, inspection, checklist, finding, action, dan report. Dengan 12 sequence, setiap bagian bisa digenerate, dites, distabilkan, lalu lanjut.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_AUDIT_INSPECTION.md`.
3. Baca `01_AUDIT_INSPECTION_MASTER_BLUEPRINT.md`.
4. Baca `02_AUDIT_INSPECTION_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI AUDIT INSPECTION SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir yang Diinginkan

Setelah sequence 12 selesai:

```text
AUDIT INSPECTION STABILIZED: GO
```
