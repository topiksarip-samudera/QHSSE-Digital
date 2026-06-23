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
