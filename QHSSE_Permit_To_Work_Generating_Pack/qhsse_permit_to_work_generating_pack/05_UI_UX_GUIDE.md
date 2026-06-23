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
