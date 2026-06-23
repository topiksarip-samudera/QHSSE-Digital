# START HERE — QHSSE Emergency Response Generating Pack

Tanggal: 2026-06-22

Paket ini dibuat untuk menghasilkan modul **Emergency Response** pada WebApp QHSSE secara sequence, aman, dan terintegrasi.

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

Modul **Emergency Response** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Emergency Plan & Scenario
03 Emergency Contact, Team & Role
04 Muster Point, Evacuation Route & Site Map
05 Emergency Equipment & Fire Equipment Register
06 Drill Plan & Schedule
07 Drill Execution, Attendance & Evidence
08 Drill Evaluation, Finding & Corrective Action
09 Crisis Notification & Escalation
10 Integration with Incident, Training, Asset, Contractor & Document
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Emergency Response bukan hanya daftar kontak darurat. Modul ini harus mengontrol:

```text
Emergency plan
Emergency scenario
Emergency contact
Emergency team / ICS role
Muster point
Evacuation route
Emergency equipment
Fire equipment
Drill schedule
Drill execution
Drill evaluation
Emergency finding
Corrective action
Crisis notification
Emergency readiness score
```

Jika digenerate sekaligus, hasilnya biasanya hanya menjadi daftar plan dan kontak. Dengan 12 sequence, modul akan menjadi emergency readiness control system yang terhubung ke Incident, Training, Asset, Contractor, Document, Audit, PTW, Security, Environment, dan Action Tracking.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_EMERGENCY_RESPONSE.md`.
3. Baca `01_EMERGENCY_RESPONSE_MASTER_BLUEPRINT.md`.
4. Baca `02_EMERGENCY_RESPONSE_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI EMERGENCY SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 12 selesai:

```text
EMERGENCY RESPONSE STABILIZED: GO
```


---

# 00 — PROMPT AWAL EMERGENCY RESPONSE UNTUK AI AGENT

Core Platform sudah stabil. Contractor Management, Incident Management, Training & Competency, Asset & Equipment, Document Control, Audit & Inspection, Permit to Work, Security Management, Environment Management, dan Action Tracking sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Emergency Response**.

Baca seluruh file dalam folder `qhsse_emergency_response_generating_pack`.

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
   - Calendar/schedule
   - Numbering
   - Dashboard
   - API/webhook
4. Emergency Response tidak boleh hanya menjadi daftar kontak.
5. Harus ada emergency plan dan scenario.
6. Harus ada emergency team, role, contact, escalation.
7. Harus ada muster point dan evacuation route.
8. Harus ada emergency/fire equipment register dan readiness.
9. Harus ada drill schedule, execution, attendance, evaluation, finding, action.
10. Harus ada crisis notification dan acknowledgement.
11. Semua data wajib tenant-safe.
12. Semua API wajib permission-guarded.
13. Semua drill report, emergency event, notification, finding, equipment readiness, dan export harus audit logged.
14. Setelah sequence selesai, tulis:
   `SELESAI EMERGENCY SEQUENCE XX: <nama sequence>`
15. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT EMERGENCY RESPONSE

## Tujuan Modul

Modul **Emergency Response** digunakan untuk memastikan kesiapan organisasi dalam menghadapi keadaan darurat melalui emergency plan, emergency scenario, emergency team, contacts, muster point, evacuation route, emergency equipment, drill, evaluation, findings, corrective action, crisis notification, dan readiness dashboard.

Modul ini harus menjadi pusat kesiapan tanggap darurat QHSSE.

## Prinsip Desain

1. Emergency Response bukan hanya daftar kontak.
2. Setiap site harus bisa memiliki emergency plan.
3. Emergency plan harus punya scenario dan applicability.
4. Emergency team harus memiliki role, responsibility, contact, dan backup.
5. Muster point dan evacuation route harus terstruktur.
6. Emergency equipment harus punya inspection/readiness status.
7. Drill harus punya planning, execution, attendance, evaluation, finding, action, dan report.
8. Crisis notification harus bisa broadcast, escalate, dan track acknowledgement.
9. Emergency readiness harus bisa dihitung.
10. Semua critical event harus audit logged.
11. Semua data wajib tenant-safe.

## Submodul Utama

```text
Emergency Plan
Emergency Scenario
Emergency Contact
Emergency Response Team
ICS / Emergency Role
Muster Point
Evacuation Route
Site Emergency Map
Emergency Equipment Register
Fire Equipment Register
Drill Plan
Drill Schedule
Drill Execution
Drill Attendance
Drill Evaluation
Emergency Finding
Corrective Action
Crisis Notification
Emergency Readiness Dashboard
Emergency Report
```

## Jenis Emergency

```text
Fire
Explosion
Chemical Spill
Hazardous Waste Spill
Medical Emergency
Mass Casualty
Confined Space Rescue
Working at Height Rescue
Electrical Emergency
Environmental Emergency
Natural Disaster
Flood
Earthquake
Security Threat
Evacuation
Community Disturbance
Vehicle Accident
Gas Leak
Process Safety Event
```

## Status Emergency Plan

```text
draft
submitted
under_review
approved
active
review_due
revised
obsolete
archived
```

## Status Drill

```text
planned
scheduled
in_progress
conducted
evaluation_in_progress
finding_action_assigned
report_draft
report_approved
closed
cancelled
```

## Status Emergency Equipment

```text
available
ready
not_ready
under_maintenance
expired
inspection_due
inspection_overdue
out_of_service
```

## Output Utama

```text
Emergency Plan Register
Emergency Scenario Register
Emergency Contact List
Emergency Team Register
Muster Point Register
Evacuation Route Register
Emergency Equipment Register
Fire Equipment Register
Drill Schedule
Drill Attendance Report
Drill Evaluation Report
Emergency Finding Register
Corrective Action List
Crisis Notification Log
Emergency Readiness Score
Emergency Dashboard
Emergency Report Export
```

## Integrasi Modul Lain

```text
Incident Management:
- Emergency event can create incident.
- Severe incident can trigger emergency response.

Training & Competency:
- Emergency team competency.
- First aid, fire fighting, spill response, rescue training.

Asset & Equipment:
- Emergency equipment, fire extinguisher, hydrant, alarm, AED.
- Equipment inspection and maintenance status.

Contractor Management:
- Contractor emergency contact.
- Contractor worker drill participation.

Document Control:
- Emergency procedure, evacuation plan, drill report, rescue plan.

Audit & Inspection:
- Emergency equipment inspection.
- Drill finding and action.

Permit to Work:
- Confined space rescue plan.
- Hot work fire watch.
- High-risk job emergency readiness.

Security Management:
- Emergency gate access.
- Evacuation control and security response.

Environment Management:
- Spill response and chemical emergency.
```


---

# 02 — EMERGENCY RESPONSE GENERATING RULES

## Aturan Utama

1. Jangan membuat Emergency Response sebagai daftar kontak saja.
2. Emergency plan harus punya scenario, site applicability, review, dan approval.
3. Emergency team harus punya role/responsibility/contact/backup.
4. Muster point dan evacuation route harus bisa dikelola per site/location.
5. Emergency equipment harus punya readiness/inspection/expiry status.
6. Drill harus punya plan, schedule, execution, attendance, evaluation, finding, action, dan report.
7. Crisis notification harus bisa broadcast, escalate, dan track acknowledgement.
8. Emergency readiness score harus dihitung dari plan, team, equipment, drill, training, dan actions.
9. Semua critical change wajib audit log.
10. Semua data wajib tenant-safe.
11. Semua API wajib permission-guarded.

## Permission Standard

```text
emergency.view
emergency.view_all
emergency.create
emergency.update
emergency.delete
emergency.submit
emergency.review
emergency.approve
emergency.activate
emergency.close
emergency.export
emergency.manage_settings

emergency_plan.view
emergency_plan.create
emergency_plan.update
emergency_plan.approve
emergency_plan.publish

emergency_team.view
emergency_team.manage

emergency_equipment.view
emergency_equipment.create
emergency_equipment.update
emergency_equipment.inspect

emergency_drill.view
emergency_drill.create
emergency_drill.execute
emergency_drill.evaluate
emergency_drill.approve_report

crisis_notification.create
crisis_notification.broadcast
crisis_notification.acknowledge
```

## Audit Log Wajib

```text
emergency_plan.created
emergency_plan.updated
emergency_plan.approved
emergency_plan.activated
emergency_team.updated
muster_point.created
evacuation_route.updated
equipment.created
equipment.inspected
equipment.status_changed
drill.created
drill.scheduled
drill.executed
drill.evaluated
drill.finding_created
drill.report_approved
crisis_notification.sent
crisis_notification.acknowledged
report.exported
settings.changed
```

## Webhook Events

```text
emergency.plan_approved
emergency.plan_review_due
emergency.equipment_not_ready
emergency.equipment_inspection_due
emergency.drill_scheduled
emergency.drill_completed
emergency.finding_created
emergency.action_overdue
emergency.crisis_notification_sent
emergency.readiness_low
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
emergency_settings
emergency_types
emergency_scenarios
emergency_plans
emergency_plan_scenarios
emergency_contacts
emergency_teams
emergency_team_members
emergency_roles
muster_points
evacuation_routes
emergency_site_maps
emergency_equipment
fire_equipment
emergency_equipment_inspections
drill_plans
drill_schedules
drill_executions
drill_attendance
drill_evaluations
emergency_findings
emergency_actions
crisis_notifications
crisis_notification_recipients
emergency_readiness_scores
emergency_links
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

## emergency_plans

```text
id
company_id
site_id
plan_number
title
description
emergency_type_id
scope
owner_department_id
plan_owner_id
effective_date
review_frequency_months
next_review_date
document_id optional
document_revision_id optional
workflow_instance_id optional
status
created_by
updated_by
created_at
updated_at
deleted_at
```

## emergency_contacts

```text
id
company_id
site_id
contact_type
name
role
organization
phone_primary
phone_secondary optional
email optional
priority_order
is_external
is_active
created_at
updated_at
```

## emergency_team_members

```text
id
company_id
team_id
user_id optional
contractor_worker_id optional
name_snapshot
role_id
primary_contact
backup_contact
shift optional
competency_status
training_status
is_active
created_at
updated_at
```

## muster_points

```text
id
company_id
site_id
location_id optional
muster_point_code
name
description
capacity
gps_lat optional
gps_lng optional
map_reference optional
status
created_at
updated_at
```

## evacuation_routes

```text
id
company_id
site_id
route_code
name
from_location_id
to_muster_point_id
route_description
estimated_time_minutes
map_file_id optional
status
created_at
updated_at
```

## emergency_equipment

```text
id
company_id
site_id
location_id
equipment_number
equipment_type
equipment_name
serial_number optional
capacity optional
inspection_frequency
last_inspection_date optional
next_inspection_date optional
expiry_date optional
readiness_status
status
created_by
updated_by
created_at
updated_at
```

## drill_executions

```text
id
company_id
drill_schedule_id
drill_number
scenario_id
site_id
conducted_date
start_time
end_time
evacuation_time_minutes optional
participants_count
observer_id optional
evaluator_id optional
summary
status
created_by
updated_by
created_at
updated_at
```

## crisis_notifications

```text
id
company_id
notification_number
emergency_type_id
site_id
location_id optional
message
severity
broadcast_channel
sent_by
sent_at
status
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
status
plan_number
equipment_number
drill_number
notification_number
next_review_date
next_inspection_date
conducted_date
created_at
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Emergency Plan

```text
GET    /emergency-plans
POST   /emergency-plans
GET    /emergency-plans/:id
PATCH  /emergency-plans/:id
DELETE /emergency-plans/:id
POST   /emergency-plans/:id/submit
POST   /emergency-plans/:id/review
POST   /emergency-plans/:id/approve
POST   /emergency-plans/:id/activate
POST   /emergency-plans/:id/archive
```

## Contacts, Team, Role

```text
GET  /emergency-contacts
POST /emergency-contacts
PATCH /emergency-contacts/:id
GET  /emergency-teams
POST /emergency-teams
GET  /emergency-teams/:id/members
POST /emergency-teams/:id/members
PATCH /emergency-team-members/:id
GET  /emergency-roles
POST /emergency-roles
```

## Muster Point & Evacuation

```text
GET  /muster-points
POST /muster-points
PATCH /muster-points/:id
GET  /evacuation-routes
POST /evacuation-routes
PATCH /evacuation-routes/:id
GET  /emergency-site-maps
POST /emergency-site-maps
```

## Equipment

```text
GET  /emergency-equipment
POST /emergency-equipment
GET  /emergency-equipment/:id
PATCH /emergency-equipment/:id
POST /emergency-equipment/:id/inspect
POST /emergency-equipment/:id/mark-out-of-service
POST /emergency-equipment/:id/restore
```

## Drill

```text
GET  /drill-plans
POST /drill-plans
GET  /drill-schedules
POST /drill-schedules
GET  /drill-executions
POST /drill-executions
GET  /drill-executions/:id
PATCH /drill-executions/:id
POST /drill-executions/:id/attendance
POST /drill-executions/:id/evaluate
POST /drill-executions/:id/create-finding
POST /drill-executions/:id/approve-report
```

## Crisis Notification

```text
GET  /crisis-notifications
POST /crisis-notifications
GET  /crisis-notifications/:id
POST /crisis-notifications/:id/broadcast
POST /crisis-notifications/:id/acknowledge
GET  /crisis-notifications/:id/recipients
```

## Dashboard & Reports

```text
GET /emergency-response/dashboard
GET /emergency-response/kpi
GET /emergency-response/readiness-score
GET /emergency-response/drill-completion
GET /emergency-response/equipment-readiness
GET /emergency-response/export
GET /emergency-response/reports/:type
```

## Settings

```text
GET   /emergency-response/settings
PATCH /emergency-response/settings
GET   /emergency-response/master-data
```


---

# 05 — UI/UX GUIDE EMERGENCY RESPONSE

## Sidebar

```text
Emergency Response
├── Overview
├── Emergency Plans
├── Emergency Scenarios
├── Emergency Contacts
├── Emergency Team
├── Muster Points
├── Evacuation Routes
├── Emergency Equipment
├── Fire Equipment
├── Drill Schedule
├── Drill Execution
├── Crisis Notification
├── Reports
└── Settings
```

## Detail Tabs

Emergency Plan:

```text
Overview
Scenarios
Team & Roles
Contacts
Muster Points
Evacuation Routes
Equipment
Linked Documents
Workflow
Review History
Audit Trail
```

Drill Execution:

```text
Overview
Scenario
Participants
Attendance
Evidence
Evaluation
Findings
Actions
Report
Audit Trail
```

Emergency Equipment:

```text
Overview
Inspection History
Readiness
Location
Attachments
Actions
Audit Trail
```

## Komponen Wajib

```text
EmergencyPlanStatusBadge
EmergencyTypeBadge
ReadinessScoreCard
EmergencyContactList
EmergencyTeamMatrix
MusterPointMap
EvacuationRoutePanel
EquipmentReadinessBadge
DrillScheduleCalendar
DrillAttendanceTable
DrillEvaluationPanel
CrisisNotificationPanel
AcknowledgementTracker
```

## UX Penting

- Emergency contact harus cepat diakses.
- Crisis notification harus sederhana dan cepat.
- Drill attendance harus mobile-friendly.
- Equipment not ready harus terlihat jelas.
- Readiness score harus bisa drill down ke penyebabnya.
- Report drill harus mudah diexport.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

```text
emergency.view
emergency.view_all
emergency.create
emergency.update
emergency.delete
emergency.submit
emergency.review
emergency.approve
emergency.activate
emergency.close
emergency.export
emergency.manage_settings

emergency_plan.view
emergency_plan.create
emergency_plan.update
emergency_plan.approve
emergency_plan.publish

emergency_team.view
emergency_team.manage

emergency_equipment.view
emergency_equipment.create
emergency_equipment.update
emergency_equipment.inspect

emergency_drill.view
emergency_drill.create
emergency_drill.execute
emergency_drill.evaluate
emergency_drill.approve_report

crisis_notification.view
crisis_notification.create
crisis_notification.broadcast
crisis_notification.acknowledge
```

## Scope

```text
Global
Company
Site
Project
Department
Emergency Team Member
Drill Participant
Observer
Evaluator
Approver
Security
HSE
Management
```

## Security Rules

- Semua query wajib filter company_id.
- Emergency contact detail dapat dibatasi sesuai role/scope.
- Crisis notification broadcast hanya untuk role berwenang.
- Drill attendance dapat diinput oleh assigned organizer.
- Equipment inspection hanya oleh role berwenang.
- Export report wajib audit log.
- Crisis event data sensitif harus permission-aware.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Emergency Plan Workflow
Emergency Contact Access
Emergency Team Role
Muster Point & Evacuation Route
Equipment Register
Equipment Readiness
Drill Schedule
Drill Execution
Drill Attendance
Drill Evaluation
Finding to Action
Crisis Notification
Acknowledgement Tracking
Dashboard Calculation
Report Export
Audit Log
Notification
Cross-Module Integration
Regression Test
```

## Release Gate

Emergency Response hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Emergency plan workflow PASS
Emergency contact/team PASS
Muster point/evacuation route PASS
Equipment readiness PASS
Drill schedule/execution PASS
Drill finding to action PASS
Crisis notification PASS
Acknowledgement tracking PASS
Dashboard calculation PASS
Report export PASS
Audit log PASS
Cross-module integration PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
EMERGENCY RESPONSE STABILIZED: GO
```

Jika gagal:

```text
EMERGENCY RESPONSE STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Incident Management

```text
- Emergency event can create incident.
- Severe incident can trigger crisis notification.
- Incident investigation can link emergency response timeline.
```

## Training & Competency

```text
- Emergency team competency validation.
- First aid, fire fighting, rescue, spill response training.
- Drill attendance can become training evidence.
```

## Asset & Equipment

```text
- Emergency equipment can link to asset register.
- Fire extinguisher, hydrant, alarm, AED inspection.
- Equipment not ready affects readiness score.
```

## Contractor Management

```text
- Contractor emergency contact.
- Contractor worker participation in drill.
- Contractor emergency readiness requirement.
```

## Document Control

```text
- Emergency procedure and evacuation plan.
- Drill report and emergency plan document.
- Obsolete emergency procedure triggers plan review.
```

## Audit & Inspection

```text
- Emergency equipment inspection.
- Drill finding creates action.
- Audit can verify emergency readiness.
```

## Permit to Work

```text
- Confined space rescue plan.
- Hot work fire watch readiness.
- High-risk work emergency readiness.
```

## Security Management

```text
- Emergency gate access.
- Evacuation control.
- Crisis security response.
```

## Environment Management

```text
- Spill response and chemical emergency.
- Environmental emergency can create incident/action.
```


---

# Emergency Response Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Emergency Plan & Scenario
03 Emergency Contact, Team & Role
04 Muster Point, Evacuation Route & Site Map
05 Emergency Equipment & Fire Equipment Register
06 Drill Plan & Schedule
07 Drill Execution, Attendance & Evidence
08 Drill Evaluation, Finding & Corrective Action
09 Crisis Notification & Escalation
10 Integration with Incident, Training, Asset, Contractor & Document
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Emergency Response Sequence. Kerjakan sequence berikutnya sesuai sequence/00_EMERGENCY_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
EMERGENCY RESPONSE STABILIZED: GO
```
