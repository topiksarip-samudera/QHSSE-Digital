# 01 — MASTER BLUEPRINT PERMIT TO WORK

## Tujuan Modul

Modul **Permit to Work / PTW** digunakan untuk mengontrol pekerjaan berisiko tinggi melalui proses request, review risiko, validasi pekerja, validasi alat, approval, activation, monitoring, extension, suspension, dan close-out.

PTW harus menjadi sistem pengendalian pekerjaan, bukan hanya form digital.

## Prinsip Desain

1. Permit wajib tenant-safe.
2. Permit wajib punya lifecycle.
3. Permit type harus configurable.
4. Permit approval harus workflow-driven.
5. Permit harus bisa link ke JSA / Risk Assessment.
6. Permit harus bisa validasi worker competency.
7. Permit harus bisa link ke contractor.
8. Permit harus bisa link ke asset/equipment.
9. Permit harus punya active board.
10. Permit harus punya QR verification.
11. Permit harus punya suspend dan close-out.
12. Permit harus punya gas test dan LOTO jika permit type membutuhkan.
13. Permit harus mendukung SIMOPS / clash detection.
14. Semua status penting harus audit logged.

## Jenis Permit yang Harus Didukung

```text
Hot Work Permit
Cold Work Permit
Working at Height
Confined Space Entry
Electrical Work Permit
Lifting Operation Permit
Excavation Permit
LOTO Permit
Radiography Permit
Chemical Work Permit
Line Breaking Permit
Pressure Testing Permit
Night Work Permit
SIMOPS Permit
Crane Operation Permit
Vehicle Entry Permit
Energized Work Permit
Demolition Permit
Scaffolding Permit
Diving Permit optional
```

## Submodul Utama

```text
Permit Request
Permit Type Configuration
Permit Requirement Configuration
Job Scope
Work Location
Work Party / Worker List
JSA / Risk Link
PPE Requirement
Tools & Equipment Requirement
Asset Link
Worker Competency Validation
Contractor Validation
Gas Test
Hot Work Control
Confined Space Control
LOTO / Isolation
SIMOPS Check
Permit Clash Detection
Approval Workflow
Permit Activation
Permit Extension
Permit Suspension
Permit Close-Out
Handover
Lessons Learned
QR Permit
Active Permit Board
Permit Report
```

## Workflow Rekomendasi Umum

```text
Draft
→ Submitted
→ Area Owner Review
→ HSE Review
→ Permit Issuer Approval
→ Approved
→ Activated
→ Work In Progress
→ Extended optional
→ Suspended optional
→ Close-Out Submitted
→ Close-Out Verified
→ Closed
```

## Workflow Hot Work

```text
Draft
→ Submitted
→ JSA Review
→ Area Owner Review
→ HSE Review
→ Fire Watch Confirmed
→ Gas Test Confirmed if required
→ Permit Issuer Approval
→ Activated
→ Fire Watch Monitoring
→ Close-Out
→ Closed
```

## Workflow Confined Space

```text
Draft
→ Submitted
→ JSA Review
→ Rescue Plan Review
→ Gas Test Required
→ Standby Man Assigned
→ HSE Review
→ Permit Issuer Approval
→ Activated
→ Periodic Gas Test
→ Close-Out
→ Closed
```

## Workflow Electrical / LOTO

```text
Draft
→ Submitted
→ Electrical Supervisor Review
→ Isolation Plan Review
→ LOTO Applied
→ Verification
→ Permit Issuer Approval
→ Activated
→ Work Complete
→ LOTO Removal Approval
→ Close-Out
→ Closed
```

## Output Utama

```text
Permit Register
Permit Request
Permit Approval
Permit PDF
QR Permit
Active Permit Board
High Risk Work Register
Gas Test Record
LOTO Record
Isolation Register
SIMOPS Register
Permit Clash Alert
Worker Competency Validation
Equipment Requirement
Permit Extension Record
Permit Suspension Record
Permit Close-Out Report
Permit Dashboard
```

## Integrasi Core

```text
Workflow: approval, activation, extension, suspension, close-out
Action Tracking: action from permit requirement or finding
Attachment: JSA, photo, gas test, supporting docs
Notification: approval, expiry, suspension, overdue close-out
Audit Log: status and approval history
Numbering: permit number
Dashboard: active permit, expiring permit, high risk work
QR: field verification
API/Webhook: integration
```

## Integrasi Modul Lain

```text
Risk / HIRADC / JSA:
- Permit wajib link ke JSA untuk high-risk job.
- Permit bisa mengambil controls dari JSA.

Training & Competency:
- Permit memvalidasi worker certificate.
- Permit bisa block/warn jika sertifikat expired.

Contractor:
- Permit validasi contractor status.
- Worker contractor harus aktif dan approved.

Asset & Equipment:
- Equipment yang digunakan harus valid.
- Certificate equipment harus belum expired.

Audit & Inspection:
- Permit bisa diinspeksi.
- Finding critical bisa suspend permit.

Document Control:
- Permit dapat link ke SOP / WI / Method Statement.

Incident:
- Incident dapat dibuat dari permit jika terjadi kejadian.
- Permit history dapat dipakai untuk investigation.
```
