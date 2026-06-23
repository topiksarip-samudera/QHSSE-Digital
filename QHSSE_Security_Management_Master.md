# START HERE — QHSSE Security Management Generating Pack

Tanggal: 2026-06-22

Paket ini dibuat untuk menghasilkan modul **Security Management** pada WebApp QHSSE secara sequence, aman, lengkap, dan terintegrasi.

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
→ Legal & Compliance Register
→ Environment Management
→ Quality Management
→ Security Management
→ Contractor Management
→ Emergency Response
→ Asset & Equipment
```

## Rekomendasi Split

Modul **Security Management** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Security Incident Core
03 Visitor Management
04 Gate Pass & Vehicle Access
05 ID Badge, Access Card & Access Control
06 Security Patrol & Checkpoint
07 Lost Item, Theft & Unauthorized Access
08 Security Investigation & Evidence
09 Security Action, Verification & Close-Out
10 Integration with Contractor, Incident, Audit, Document & Notification
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Security Management bukan hanya pencatatan tamu atau insiden. Modul ini harus mengelola:

```text
Security Incident
Visitor Management
Gate Pass
Vehicle Access
ID Badge
Access Card
Patrol
Checkpoint
Lost Item
Theft
Unauthorized Access
Investigation
Evidence
Security Action
Security Dashboard
```

Jika digenerate sekaligus, biasanya security hanya menjadi CRUD sederhana. Dengan 12 sequence, modul bisa menjadi sistem security operational control yang terhubung dengan contractor, incident, audit, document, training, notification, dan action tracking.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_SECURITY_MANAGEMENT.md`.
3. Baca `01_SECURITY_MANAGEMENT_MASTER_BLUEPRINT.md`.
4. Baca `02_SECURITY_MANAGEMENT_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI SECURITY SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 12 selesai:

```text
SECURITY MANAGEMENT STABILIZED: GO
```


---

# 00 — PROMPT AWAL SECURITY MANAGEMENT UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management, Audit & Inspection, Permit to Work, Document Control, Training & Competency, Legal & Compliance, Environment, dan Quality Management sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Security Management**.

Baca seluruh file dalam folder `qhsse_security_management_generating_pack`.

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
   - Action tracking
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - QR code engine jika tersedia
   - Dashboard
   - API/webhook
4. Security Management tidak boleh hanya menjadi visitor log.
5. Harus ada security incident lifecycle.
6. Harus ada visitor, gate pass, vehicle access, badge/access card.
7. Harus ada patrol dan checkpoint.
8. Harus ada lost item, theft, unauthorized access, dan investigation.
9. Harus ada evidence dan security action.
10. Semua data wajib tenant-safe.
11. Semua API wajib permission-guarded.
12. Semua check-in/check-out, access approval, incident update, investigation, evidence, close-out, dan export harus audit logged.
13. Setelah sequence selesai, tulis:
   `SELESAI SECURITY SEQUENCE XX: <nama sequence>`
14. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT SECURITY MANAGEMENT

## Tujuan Modul

Modul **Security Management** digunakan untuk mengelola aspek keamanan perusahaan/site/project: security incident, visitor, gate pass, vehicle access, badge/access card, patrol, checkpoint, lost item, theft, unauthorized access, investigation, evidence, action, dan reporting.

Modul ini harus membantu security team mengontrol akses, memonitor aktivitas, menangani insiden, dan menyediakan evidence untuk audit serta investigation.

## Prinsip Desain

1. Security Management harus multi-tenant dan multi-site.
2. Visitor, gate pass, vehicle, badge, patrol, dan incident harus terpisah tetapi saling terhubung.
3. Security incident harus punya lifecycle dari report sampai closed.
4. Visitor check-in/check-out harus audit logged.
5. Vehicle access harus bisa linked ke contractor/vendor/visitor.
6. ID badge/access card harus punya status active/lost/revoked/expired.
7. Patrol harus berbasis route dan checkpoint.
8. Checkpoint dapat menggunakan QR atau manual confirmation.
9. Lost item, theft, unauthorized access harus bisa masuk investigation.
10. Investigation harus punya evidence, interview, chronology, conclusion, action.
11. Finding/action harus terhubung dengan Action Tracking.
12. Critical security incident harus trigger notification/escalation.
13. Data sensitif harus permission-aware.

## Submodul Utama

```text
Security Incident
Visitor Management
Gate Pass
Vehicle Access
ID Badge / Access Card
Security Patrol
Checkpoint Patrol
Lost Item
Theft / Loss Report
Unauthorized Access
Conflict / Violence Report
Security Investigation
Security Action
Security Dashboard
Security Reports
Settings & Master Data
```

## Jenis Security Incident

```text
Theft
Lost Item
Unauthorized Access
Trespassing
Violence / Conflict
Threat / Intimidation
Suspicious Activity
Security Breach
Vehicle Violation
Access Card Misuse
Visitor Violation
Contractor Violation
Property Damage
Sabotage optional
Community Disturbance
Cyber/Physical Security Event optional
```

## Visitor Status

```text
pre_registered
pending_approval
approved
rejected
checked_in
checked_out
overstay
cancelled
blacklisted
```

## Gate Pass Status

```text
draft
submitted
approved
active
used
expired
cancelled
revoked
```

## Security Incident Workflow

```text
Draft / Reported
→ Security Review
→ Classification
→ Investigation Required optional
→ Investigation In Progress
→ Action Assigned
→ Verification
→ Management Review optional
→ Closed
```

## Visitor Workflow

```text
Pre-Registration
→ Host Approval
→ Security Verification
→ Check-In
→ Badge Issued
→ Site Visit
→ Check-Out
→ Closed
```

## Patrol Workflow

```text
Patrol Scheduled
→ Patrol Started
→ Checkpoint Scanned / Confirmed
→ Finding Created optional
→ Patrol Submitted
→ Reviewed
→ Closed
```

## Output Utama

```text
Security Incident Register
Visitor Log
Gate Pass Register
Vehicle Access Log
Badge / Access Card Register
Patrol Schedule
Patrol Result
Checkpoint Log
Lost Item Register
Theft Report
Unauthorized Access Report
Security Investigation Report
Security Action List
Security KPI Dashboard
Security Report Export
```

## Integrasi Core

```text
Workflow: visitor approval, incident review, investigation close-out
Action Tracking: security action and corrective action
Attachment: evidence photo/video/document
Notification: critical incident, visitor approval, overstay, patrol overdue
Audit Log: check-in/out, access approval, investigation update
Numbering: incident, visitor, gate pass, patrol, investigation
QR: visitor badge, gate pass, checkpoint patrol
Dashboard: KPI and widgets
API/Webhook: integration
```

## Integrasi Modul Lain

```text
Incident Management:
- Security incident can become QHSSE incident.
- High severity incident can trigger Incident Management record.

Contractor Management:
- Contractor visitors/workers/vehicles validated.
- Contractor access and violation feed contractor performance.

Audit & Inspection:
- Security patrol finding can become audit/inspection finding.
- Audit can verify security controls.

Document Control:
- Security policy/procedure/visitor rules linked.

Training & Competency:
- Security induction and visitor briefing.

Permit to Work:
- Vehicle entry and restricted area access link to permits.

Action Tracking:
- Follow-up from security finding/incident.
```


---

# 02 — SECURITY MANAGEMENT GENERATING RULES

## Aturan Utama

1. Jangan membuat Security Management hanya sebagai visitor log.
2. Security incident harus punya lifecycle.
3. Visitor, gate pass, vehicle access, badge/access card, patrol, investigation harus terpisah tetapi bisa linked.
4. Visitor check-in/check-out harus audit logged.
5. Vehicle access harus bisa linked ke visitor/contractor/vendor.
6. Patrol checkpoint harus bisa manual dan QR-ready.
7. Lost item, theft, unauthorized access harus bisa masuk investigation.
8. Critical security incident harus trigger notification.
9. Security action harus terhubung dengan Action Tracking.
10. Evidence harus menggunakan attachment core.
11. Semua data wajib tenant-safe.
12. Semua API wajib permission-guarded.
13. Data sensitif security harus memiliki access control.
14. Export report harus audit logged.

## Status Security Incident

```text
draft
reported
under_review
classified
investigation_required
investigation_in_progress
action_assigned
pending_verification
management_review
closed
cancelled
archived
```

## Status Visitor

```text
pre_registered
pending_approval
approved
rejected
checked_in
checked_out
overstay
cancelled
blacklisted
```

## Status Patrol

```text
scheduled
started
in_progress
missed_checkpoint
submitted
reviewed
closed
cancelled
```

## Permission Standard

```text
security.view
security.view_all
security.create
security.update
security.delete
security.submit
security.review
security.approve
security.close
security.export
security.manage_settings

security_incident.view
security_incident.create
security_incident.update
security_incident.classify
security_incident.investigate
security_incident.close

visitor.view
visitor.create
visitor.approve
visitor.check_in
visitor.check_out
visitor.blacklist

gate_pass.view
gate_pass.create
gate_pass.approve
gate_pass.revoke

vehicle_access.view
vehicle_access.create
vehicle_access.approve
vehicle_access.check_in
vehicle_access.check_out

patrol.view
patrol.create
patrol.execute
patrol.review

badge_access.manage
security_investigation.manage
```

## Audit Log Wajib

```text
security_incident.created
security_incident.updated
security_incident.classified
security_incident.investigation_started
security_incident.closed
visitor.created
visitor.approved
visitor.checked_in
visitor.checked_out
visitor.blacklisted
gate_pass.created
gate_pass.approved
gate_pass.revoked
vehicle_access.created
vehicle_access.checked_in
vehicle_access.checked_out
badge.issued
badge.revoked
patrol.started
checkpoint.scanned
patrol.submitted
finding.created
action.assigned
report.exported
settings.changed
```

## Webhook Events

```text
security.incident_created
security.critical_incident
visitor.checked_in
visitor.overstay
gate_pass.approved
vehicle.checked_in
badge.revoked
patrol.missed_checkpoint
security.finding_created
security.action_overdue
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
security_settings
security_incident_types
security_incident_categories
security_severity_levels
security_incidents
security_incident_people
security_incident_assets
security_investigations
security_investigation_interviews
security_investigation_findings
security_actions
visitors
visitor_pre_registrations
visitor_approvals
visitor_checkins
visitor_badges
gate_passes
vehicle_access_records
vehicle_checkins
access_cards
access_card_assignments
security_patrol_routes
security_patrol_checkpoints
security_patrol_schedules
security_patrol_runs
security_checkpoint_logs
lost_item_reports
theft_reports
unauthorized_access_reports
security_evidence
security_reports
security_links
```

## Field Umum Wajib

Semua tabel tenant-specific wajib punya:

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

## security_incidents

```text
id
company_id
incident_number
incident_type_id
category_id
severity_id
title
description
incident_datetime
reported_datetime
reported_by
site_id
location_id optional
department_id optional
involved_person_type optional
contractor_id optional
visitor_id optional
vehicle_id optional
immediate_action
potential_impact
actual_loss
investigation_required
investigation_id optional
action_required
status
workflow_instance_id optional
created_by
updated_by
closed_by optional
closed_at optional
created_at
updated_at
deleted_at
```

## visitors

```text
id
company_id
visitor_number
full_name
identity_type
identity_number optional
company_name optional
phone optional
email optional
host_user_id
purpose
site_id
visit_date
expected_checkin_time
expected_checkout_time
actual_checkin_time optional
actual_checkout_time optional
badge_number optional
vehicle_number optional
approval_status
visit_status
blacklist_flag
created_by
updated_by
created_at
updated_at
```

## gate_passes

```text
id
company_id
gate_pass_number
pass_type
requestor_id
visitor_id optional
contractor_id optional
vehicle_number optional
driver_name optional
material_description optional
valid_from
valid_until
approved_by optional
used_at optional
status
created_by
updated_by
created_at
updated_at
```

## vehicle_access_records

```text
id
company_id
vehicle_access_number
vehicle_number
vehicle_type
driver_name
company_name
visitor_id optional
contractor_id optional
gate_pass_id optional
site_id
purpose
checkin_time optional
checkout_time optional
security_user_id optional
status
created_at
updated_at
```

## security_patrol_routes

```text
id
company_id
route_code
route_name
site_id
description
is_active
created_by
created_at
updated_at
```

## security_patrol_checkpoints

```text
id
company_id
route_id
checkpoint_code
checkpoint_name
location_id optional
qr_code optional
sequence_order
is_mandatory
created_at
updated_at
```

## security_patrol_runs

```text
id
company_id
patrol_number
route_id
scheduled_start
scheduled_end
actual_start optional
actual_end optional
patrol_user_id
status
summary
created_at
updated_at
```

## security_checkpoint_logs

```text
id
company_id
patrol_run_id
checkpoint_id
checked_at
checked_by
result
remarks
finding_id optional
photo_file_id optional
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
incident_number
visitor_number
gate_pass_number
vehicle_access_number
patrol_number
status
severity_id
incident_datetime
visit_date
scheduled_start
created_at
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Security Incident

```text
GET    /security-incidents
POST   /security-incidents
GET    /security-incidents/:id
PATCH  /security-incidents/:id
DELETE /security-incidents/:id
POST   /security-incidents/:id/submit
POST   /security-incidents/:id/classify
POST   /security-incidents/:id/start-investigation
POST   /security-incidents/:id/assign-action
POST   /security-incidents/:id/verify
POST   /security-incidents/:id/close
GET    /security-incidents/:id/report
GET    /security-incidents/:id/export
```

## Visitor Management

```text
GET    /visitors
POST   /visitors
GET    /visitors/:id
PATCH  /visitors/:id
POST   /visitors/:id/approve
POST   /visitors/:id/reject
POST   /visitors/:id/check-in
POST   /visitors/:id/check-out
POST   /visitors/:id/blacklist
GET    /visitors/:id/badge
```

## Gate Pass

```text
GET    /gate-passes
POST   /gate-passes
GET    /gate-passes/:id
PATCH  /gate-passes/:id
POST   /gate-passes/:id/approve
POST   /gate-passes/:id/revoke
POST   /gate-passes/:id/use
```

## Vehicle Access

```text
GET    /vehicle-access
POST   /vehicle-access
GET    /vehicle-access/:id
PATCH  /vehicle-access/:id
POST   /vehicle-access/:id/check-in
POST   /vehicle-access/:id/check-out
POST   /vehicle-access/:id/approve
```

## Badge / Access Card

```text
GET    /access-cards
POST   /access-cards
GET    /access-cards/:id
PATCH  /access-cards/:id
POST   /access-cards/:id/assign
POST   /access-cards/:id/revoke
POST   /access-cards/:id/report-lost
```

## Patrol

```text
GET    /security-patrol-routes
POST   /security-patrol-routes
GET    /security-patrol-routes/:id
PATCH  /security-patrol-routes/:id

GET    /security-patrol-schedules
POST   /security-patrol-schedules

GET    /security-patrol-runs
POST   /security-patrol-runs
GET    /security-patrol-runs/:id
POST   /security-patrol-runs/:id/start
POST   /security-patrol-runs/:id/checkpoint
POST   /security-patrol-runs/:id/submit
POST   /security-patrol-runs/:id/review
POST   /security-patrol-runs/:id/close
```

## Reports & Dashboard

```text
GET /security/dashboard
GET /security/kpi
GET /security/active-visitors
GET /security/vehicle-inside
GET /security/patrol-status
GET /security/export
```

## Settings

```text
GET   /security/settings
PATCH /security/settings
GET   /security/master-data
```

## Standard Query

```text
?page=1&pageSize=20&search=&siteId=&status=&dateFrom=&dateTo=&severityId=&locationId=&sort=createdAt:desc
```


---

# 05 — UI/UX GUIDE SECURITY MANAGEMENT

## Sidebar

```text
Security Management
├── Overview
├── Security Incidents
├── Visitors
├── Gate Pass
├── Vehicle Access
├── ID Badge / Access Card
├── Patrol Routes
├── Patrol Schedule
├── Patrol Runs
├── Lost Item / Theft
├── Unauthorized Access
├── Investigations
├── Reports
└── Settings
```

## Halaman Utama

```text
Security Overview Dashboard
Security Incident Register
Create Security Incident
Visitor Register
Visitor Pre-Registration
Visitor Check-In/Check-Out
Gate Pass Register
Vehicle Access Register
Badge / Access Card Register
Patrol Route Builder
Patrol Schedule
Patrol Execution
Checkpoint Log
Lost Item Register
Theft Report
Unauthorized Access Register
Investigation Detail
Security Report Export
Settings
```

## Security Incident Detail Tabs

```text
Overview
Classification
People / Visitor / Contractor
Vehicle / Asset
Investigation
Evidence
Actions
Workflow
Linked Records
Comments
Audit Trail
```

## Visitor Detail Tabs

```text
Overview
Host Approval
Check-In / Check-Out
Badge
Vehicle
Visit History
Attachments
Audit Trail
```

## Patrol Detail Tabs

```text
Overview
Route
Checkpoints
Checkpoint Logs
Findings
Evidence
Review
Audit Trail
```

## Komponen Wajib

```text
SecurityIncidentStatusBadge
VisitorStatusBadge
GatePassStatusBadge
VehicleInsideBadge
AccessCardStatusBadge
PatrolStatusBadge
CheckpointCard
VisitorCheckInPanel
VehicleAccessPanel
SecurityEvidencePanel
SecurityActionPanel
SecurityDashboardCards
```

## UX Penting

- Visitor check-in/check-out harus cepat.
- Security guard UI harus mobile/tablet friendly.
- QR untuk visitor badge dan checkpoint patrol harus mudah dipakai.
- Critical incident harus jelas dan cepat di-escalate.
- Data security investigation harus dibatasi permission.
- Active visitors dan vehicles inside harus tampil real-time atau near-real-time.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Security General

```text
security.view
security.view_all
security.create
security.update
security.delete
security.export
security.manage_settings
```

### Security Incident

```text
security_incident.view
security_incident.create
security_incident.update
security_incident.classify
security_incident.investigate
security_incident.assign_action
security_incident.verify
security_incident.close
security_incident.export
```

### Visitor

```text
visitor.view
visitor.create
visitor.update
visitor.approve
visitor.reject
visitor.check_in
visitor.check_out
visitor.blacklist
visitor.export
```

### Gate Pass & Vehicle

```text
gate_pass.view
gate_pass.create
gate_pass.approve
gate_pass.revoke
vehicle_access.view
vehicle_access.create
vehicle_access.approve
vehicle_access.check_in
vehicle_access.check_out
```

### Badge / Patrol

```text
badge_access.view
badge_access.manage
patrol.view
patrol.create
patrol.execute
patrol.review
patrol.close
```

## Scope

```text
Global
Company
Site
Project
Department
Location
Own
Assigned
Host
Security Guard
Security Supervisor
Investigator
Contractor
Visitor Limited
```

## Security Rules

- Semua query wajib filter company_id.
- Site scope hanya bisa melihat data site-nya.
- Visitor limited access hanya untuk pre-registration/status sendiri jika portal visitor tersedia.
- Security guard dapat check-in/out tetapi tidak boleh melihat investigation restricted tanpa permission.
- Investigator hanya melihat case yang assigned jika scope assigned.
- Blacklist visitor butuh permission khusus.
- Access card revoke butuh permission khusus.
- Critical incident report/export harus permission-restricted.
- Evidence download harus permission-guarded.
- Export harus audit logged.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Security Incident Lifecycle
Visitor Check-In/Out
Gate Pass Approval
Vehicle Access
Badge / Access Card
Patrol Route & Checkpoint
Lost Item / Theft / Unauthorized Access
Investigation & Evidence
Security Action Integration
Notification & Escalation
Dashboard Calculation
Report Export
Audit Log
Cross-Module Links
Regression Test
```

## Release Gate

Security Management hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Security incident lifecycle PASS
Visitor check-in/out PASS
Gate pass PASS
Vehicle access PASS
Badge/access card PASS
Patrol/checkpoint PASS
Investigation/evidence PASS
Action integration PASS
Notification/escalation PASS
Dashboard calculation PASS
Report export PASS
Audit log PASS
Cross-module integration PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
SECURITY MANAGEMENT STABILIZED: GO
```

Jika gagal:

```text
SECURITY MANAGEMENT STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Incident Management

```text
- Security incident can create/link to QHSSE incident.
- High severity security incident can trigger incident notification.
- Investigation evidence can be shared with incident investigation if allowed.
```

## Contractor Management

```text
- Contractor visitor and vehicle validation.
- Contractor access violation affects contractor performance.
- Contractor blacklist/watchlist can affect visitor approval.
```

## Audit & Inspection

```text
- Security patrol finding can create audit/inspection finding.
- Audit can verify security control effectiveness.
- Security inspection checklist can be reused.
```

## Document Control

```text
- Security policy, visitor rules, access procedure linked.
- Investigation can trigger document revision.
```

## Training & Competency

```text
- Security induction and visitor briefing.
- Security officer competency/training evidence.
```

## Permit to Work

```text
- Vehicle entry gate pass can link to permit.
- Restricted area access can require permit.
- Active permit can be viewed by security gate if scoped.
```

## Action Tracking

```text
- Security finding/incident creates corrective action.
- Action overdue triggers escalation.
```

## Notification

```text
- Unauthorized access alert.
- Visitor overstay alert.
- Patrol missed checkpoint alert.
- Critical incident escalation.
```


---

# Security Management Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Security Incident Core
03 Visitor Management
04 Gate Pass & Vehicle Access
05 ID Badge, Access Card & Access Control
06 Security Patrol & Checkpoint
07 Lost Item, Theft & Unauthorized Access
08 Security Investigation & Evidence
09 Security Action, Verification & Close-Out
10 Integration with Contractor, Incident, Audit, Document & Notification
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Security Management Sequence. Kerjakan sequence berikutnya sesuai sequence/00_SECURITY_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
SECURITY MANAGEMENT STABILIZED: GO
```
