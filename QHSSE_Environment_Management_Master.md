# START HERE — QHSSE Environment Management Generating Pack

Tanggal: 2026-06-22

Paket ini dibuat untuk menghasilkan modul **Environment Management** pada WebApp QHSSE secara sequence, lengkap, dan terintegrasi dengan Legal & Compliance Register.

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

Modul **Environment Management** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Environmental Aspect & Impact Register
03 Environmental Permit & Compliance Link
04 Waste Management Core
05 Hazardous Waste / Limbah B3 & Manifest
06 Environmental Monitoring Schedule
07 Water, Wastewater, Emission & Noise Monitoring
08 Exceedance, Spill & Environmental Incident
09 Energy, Fuel, Chemical & Resource Monitoring
10 Integration with Legal, Audit, Incident, Action & Document
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Environment Management tidak boleh hanya menjadi input data limbah. Modul ini harus mengontrol:

```text
Aspect impact
Legal limit
Environmental permit
Waste manifest
Monitoring schedule
Lab result
Exceedance
Spill
Corrective action
Compliance evidence
Environmental KPI
Regulatory reporting
```

Jika digenerate sekaligus, biasanya hasilnya hanya menjadi tabel pencatatan. Dengan 12 sequence, sistem akan menjadi environment compliance control yang bisa dipakai untuk monitoring, reporting, evidence, action, dan audit readiness.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_ENVIRONMENT_MANAGEMENT.md`.
3. Baca `01_ENVIRONMENT_MANAGEMENT_MASTER_BLUEPRINT.md`.
4. Baca `02_ENVIRONMENT_MANAGEMENT_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI ENVIRONMENT SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 12 selesai:

```text
ENVIRONMENT MANAGEMENT STABILIZED: GO
```


---

# 00 — PROMPT AWAL ENVIRONMENT MANAGEMENT UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management, Audit & Inspection, Permit to Work, Document Control, Training & Competency, dan Legal & Compliance Register sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Environment Management**.

Baca seluruh file dalam folder `qhsse_environment_management_generating_pack`.

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
   - Calendar/schedule
   - Dashboard
   - API/webhook
4. Environment Management tidak boleh hanya menjadi tabel limbah.
5. Harus ada aspect-impact register.
6. Harus ada environmental permit dan compliance link.
7. Harus ada waste management dan limbah B3/manifest.
8. Harus ada environmental monitoring schedule.
9. Harus ada water, wastewater, emission, dan noise monitoring.
10. Harus ada exceedance management.
11. Harus ada spill/environmental incident.
12. Harus ada energy, fuel, chemical, dan resource monitoring.
13. Semua data wajib tenant-safe.
14. Semua API wajib permission-guarded.
15. Semua exceedance, spill, manifest, assessment, evidence update, dan export harus audit logged.
16. Setelah sequence selesai, tulis:
   `SELESAI ENVIRONMENT SEQUENCE XX: <nama sequence>`
17. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT ENVIRONMENT MANAGEMENT

## Tujuan Modul

Modul **Environment Management** digunakan untuk mengelola aspek dan dampak lingkungan, izin lingkungan, pengelolaan limbah, limbah B3, manifest, monitoring lingkungan, hasil lab, exceedance, spill, environmental incident, energy/fuel/chemical/resource usage, KPI, evidence, dan reporting.

Modul ini harus menjadi pusat environment compliance operation.

## Prinsip Desain

1. Environment Management harus terkait dengan Legal & Compliance Register.
2. Legal limit harus bisa dimapping ke parameter monitoring.
3. Monitoring harus punya schedule, due date, result, review, dan evidence.
4. Lab result harus bisa dibandingkan dengan legal limit.
5. Exceedance harus otomatis membuat alert/action sesuai setting.
6. Waste dan limbah B3 harus punya register, storage, transporter, disposal, dan manifest.
7. Spill harus bisa menjadi environmental incident dan corrective action.
8. Environmental permit harus punya expiry/review/renewal reminder.
9. Environmental KPI harus bisa dihitung per site/period.
10. Semua evidence harus bisa dipakai oleh Legal Compliance.
11. Semua critical activities harus audit logged.
12. Final compliance status harus human-reviewed.

## Submodul Utama

```text
Environmental Aspect & Impact
Environmental Permit Register
Environmental Compliance Link
Waste Management
Hazardous Waste / Limbah B3
Waste Manifest
Waste Storage
Transporter / Disposal Vendor
Environmental Monitoring Schedule
Water Monitoring
Wastewater Monitoring
Air Emission Monitoring
Noise Monitoring
Soil Monitoring optional
Energy Monitoring
Fuel Monitoring
Chemical Usage Monitoring
Resource Monitoring
Exceedance Management
Spill Management
Environmental Incident
Environmental Inspection Link
Environmental KPI
Environmental Reporting
Settings & Master Data
```

## Jenis Environmental Record

```text
Aspect Impact
Permit
Waste Generation
Waste Storage
Waste Transfer
Waste Manifest
Water Monitoring
Wastewater Monitoring
Air Emission Monitoring
Noise Monitoring
Energy Usage
Fuel Usage
Chemical Usage
Resource Usage
Spill
Exceedance
Environmental Complaint
Environmental Inspection
Environmental Action
```

## Status Umum

```text
draft
active
scheduled
in_progress
submitted
reviewed
compliant
exceedance
action_required
action_in_progress
verified
closed
cancelled
archived
```

## Output Utama

```text
Environmental Aspect Impact Register
Environmental Permit Register
Waste Register
Hazardous Waste / Limbah B3 Register
Waste Manifest Register
Waste Storage Report
Waste Transport Report
Monitoring Schedule
Water Monitoring Report
Wastewater Monitoring Report
Emission Monitoring Report
Noise Monitoring Report
Exceedance Register
Spill Register
Environmental Incident Report
Energy/Fuel/Chemical Usage Report
Environmental KPI Dashboard
Compliance Evidence Export
Regulatory Report
```

## Integrasi Core

```text
Workflow: review monitoring result, exceedance verification, permit renewal approval
Action Tracking: corrective action dari exceedance/spill/finding
Attachment: lab result, manifest, photos, permit files
Notification: schedule due, exceedance, spill, permit expiry, overdue action
Audit Log: monitoring result, exceedance, manifest, export, status change
Numbering: environment record, waste, manifest, spill, exceedance
Calendar: monitoring schedule and compliance calendar
Dashboard: KPI and analytics
API/Webhook: environment events
```

## Integrasi Modul Lain

```text
Legal & Compliance:
- Legal limit and obligation mapping.
- Evidence from monitoring/manifest/permit.
- Exceedance creates compliance gap.

Audit & Inspection:
- Environmental inspection finding creates action.
- Audit can verify environmental controls.

Incident Management:
- Spill and major exceedance can create environmental incident.

Document Control:
- SOP, WI, emergency spill response, waste procedure.

Training & Competency:
- Waste handling, chemical handling, spill response training.

Contractor Management:
- Waste transporter/vendor compliance.

Asset & Equipment:
- Monitoring points, WWTP, emission sources, flow meter, sampling point.
```


---

# 02 — ENVIRONMENT MANAGEMENT GENERATING RULES

## Aturan Utama

1. Jangan membuat modul ini hanya sebagai tabel pencatatan limbah.
2. Environmental aspect-impact harus punya register tersendiri.
3. Environmental permit harus bisa link ke Legal Compliance.
4. Monitoring parameter harus configurable.
5. Legal limit harus bisa configurable dan/atau berasal dari Legal Compliance.
6. Monitoring result harus dibandingkan dengan limit.
7. Exceedance harus bisa membuat action.
8. Spill harus bisa membuat environmental incident/action.
9. Waste manifest harus punya lifecycle.
10. Evidence harus bisa link ke Legal Compliance.
11. Semua critical change harus audit logged.
12. Semua data wajib tenant-safe.
13. Semua API wajib permission-guarded.
14. Export environmental report harus permission-aware dan audit logged.

## Permission Standard

```text
environment.view
environment.view_all
environment.create
environment.update
environment.delete
environment.submit
environment.review
environment.approve
environment.close
environment.export
environment.manage_settings

env_aspect.view
env_aspect.create
env_aspect.update
env_aspect.approve

env_permit.view
env_permit.create
env_permit.update
env_permit.renew

env_waste.view
env_waste.create
env_waste.update
env_waste.verify

env_monitoring.view
env_monitoring.create
env_monitoring.update
env_monitoring.review

env_exceedance.view
env_exceedance.create
env_exceedance.assign_action
env_exceedance.verify
env_exceedance.close
```

## Audit Log Wajib

```text
env.aspect_created
env.aspect_updated
env.permit_created
env.permit_updated
env.permit_renewed
env.waste_created
env.manifest_uploaded
env.manifest_verified
env.monitoring_scheduled
env.monitoring_result_uploaded
env.exceedance_detected
env.exceedance_action_assigned
env.exceedance_closed
env.spill_reported
env.incident_created
env.report_exported
env.settings_changed
```

## Webhook Events

```text
env.permit_expiring
env.monitoring_due
env.monitoring_overdue
env.result_uploaded
env.exceedance_detected
env.spill_reported
env.waste_manifest_due
env.manifest_uploaded
env.action_overdue
env.kpi_updated
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
environment_settings
environment_aspect_categories
environment_aspects
environment_impacts
environment_aspect_controls
environment_permits
environment_permit_obligations
environment_monitoring_points
environment_parameters
environment_limits
environment_monitoring_schedules
environment_monitoring_results
environment_lab_results
environment_exceedances
environment_spills
environment_incidents
environment_waste_types
environment_waste_records
environment_waste_storage
environment_waste_transfers
environment_waste_manifests
environment_transporters
environment_disposal_vendors
environment_energy_records
environment_fuel_records
environment_chemical_records
environment_resource_records
environment_kpi_records
environment_links
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

## environment_aspects

```text
id
company_id
site_id
department_id optional
activity_or_process
aspect_category_id
aspect_description
impact_description
condition_type
normal_abnormal_emergency
severity_score
frequency_score
legal_concern_score
stakeholder_concern_score
significance_score
is_significant
controls
responsible_person_id
review_frequency_months
next_review_date
status
created_by
updated_by
created_at
updated_at
```

## environment_permits

```text
id
company_id
permit_number
permit_name
permit_type
issuing_authority
site_id
scope
issue_date
valid_from
valid_until
renewal_due_date
responsible_person_id
legal_obligation_id optional
document_id optional
file_id optional
status
created_by
updated_by
created_at
updated_at
```

## environment_monitoring_points

```text
id
company_id
site_id
location_id optional
point_code
point_name
monitoring_type
media_type
parameter_group
asset_id optional
legal_obligation_id optional
is_active
created_at
updated_at
```

## environment_parameters

```text
id
company_id
parameter_code
parameter_name
unit
media_type
method_reference optional
is_active
created_at
updated_at
```

## environment_limits

```text
id
company_id
parameter_id
site_id optional
monitoring_point_id optional
legal_obligation_id optional
limit_type
min_value optional
max_value optional
unit
valid_from
valid_until optional
status
created_at
updated_at
```

## environment_monitoring_results

```text
id
company_id
result_number
schedule_id optional
monitoring_point_id
parameter_id
sample_date
result_date
measured_value
unit
limit_value_snapshot
result_status
lab_name optional
lab_report_file_id optional
reviewed_by optional
reviewed_at optional
exceedance_id optional
status
created_by
updated_by
created_at
updated_at
```

## environment_exceedances

```text
id
company_id
exceedance_number
source_type
source_id
monitoring_point_id optional
parameter_id optional
limit_value
measured_value
exceedance_level
description
immediate_action
root_cause optional
action_id optional
pic_id
due_date
verification_status
status
created_by
updated_by
closed_by optional
closed_at optional
created_at
updated_at
```

## environment_waste_records

```text
id
company_id
waste_record_number
waste_type_id
waste_category
is_hazardous
site_id
location_id optional
generated_date
quantity
unit
source_activity
storage_location
container_type optional
label_status
responsible_person_id
status
created_by
updated_by
created_at
updated_at
```

## environment_waste_manifests

```text
id
company_id
manifest_number
waste_record_id optional
transporter_id
disposal_vendor_id
pickup_date
quantity
unit
manifest_file_id optional
receipt_file_id optional
verification_status
verified_by optional
verified_at optional
status
created_by
updated_by
created_at
updated_at
```

## Index Wajib

```text
company_id
site_id
status
monitoring_type
media_type
parameter_id
monitoring_point_id
sample_date
result_date
valid_until
renewal_due_date
manifest_number
exceedance_number
created_at
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Aspect & Impact

```text
GET    /environment/aspects
POST   /environment/aspects
GET    /environment/aspects/:id
PATCH  /environment/aspects/:id
DELETE /environment/aspects/:id
POST   /environment/aspects/:id/submit
POST   /environment/aspects/:id/approve
POST   /environment/aspects/:id/review
```

## Environmental Permit

```text
GET    /environment/permits
POST   /environment/permits
GET    /environment/permits/:id
PATCH  /environment/permits/:id
DELETE /environment/permits/:id
POST   /environment/permits/:id/renew
POST   /environment/permits/:id/link-obligation
GET    /environment/permits/expiring
```

## Waste & Manifest

```text
GET    /environment/waste-records
POST   /environment/waste-records
GET    /environment/waste-records/:id
PATCH  /environment/waste-records/:id
POST   /environment/waste-records/:id/verify

GET    /environment/waste-manifests
POST   /environment/waste-manifests
GET    /environment/waste-manifests/:id
PATCH  /environment/waste-manifests/:id
POST   /environment/waste-manifests/:id/upload
POST   /environment/waste-manifests/:id/verify
```

## Monitoring

```text
GET    /environment/monitoring-points
POST   /environment/monitoring-points
PATCH  /environment/monitoring-points/:id

GET    /environment/parameters
POST   /environment/parameters
PATCH  /environment/parameters/:id

GET    /environment/limits
POST   /environment/limits
PATCH  /environment/limits/:id

GET    /environment/monitoring-schedules
POST   /environment/monitoring-schedules
PATCH  /environment/monitoring-schedules/:id

GET    /environment/monitoring-results
POST   /environment/monitoring-results
GET    /environment/monitoring-results/:id
PATCH  /environment/monitoring-results/:id
POST   /environment/monitoring-results/:id/review
POST   /environment/monitoring-results/:id/create-exceedance
```

## Exceedance, Spill, Incident

```text
GET    /environment/exceedances
POST   /environment/exceedances
GET    /environment/exceedances/:id
PATCH  /environment/exceedances/:id
POST   /environment/exceedances/:id/assign-action
POST   /environment/exceedances/:id/verify
POST   /environment/exceedances/:id/close

GET    /environment/spills
POST   /environment/spills
GET    /environment/spills/:id
PATCH  /environment/spills/:id
POST   /environment/spills/:id/create-incident
```

## Energy / Fuel / Chemical / Resource

```text
GET  /environment/energy-records
POST /environment/energy-records
GET  /environment/fuel-records
POST /environment/fuel-records
GET  /environment/chemical-records
POST /environment/chemical-records
GET  /environment/resource-records
POST /environment/resource-records
```

## Dashboard & Reports

```text
GET /environment/dashboard
GET /environment/kpi
GET /environment/exceedance-trend
GET /environment/waste-report
GET /environment/monitoring-report
GET /environment/permit-expiry-report
GET /environment/export
```

## Settings

```text
GET   /environment/settings
PATCH /environment/settings
GET   /environment/master-data
```

## Standard Query

```text
?page=1&pageSize=20&search=&siteId=&monitoringType=&mediaType=&status=&dateFrom=&dateTo=&sort=createdAt:desc
```


---

# 05 — UI/UX GUIDE ENVIRONMENT MANAGEMENT

## Sidebar

```text
Environment Management
├── Overview
├── Aspect & Impact
├── Environmental Permits
├── Waste Management
├── Limbah B3 / Hazardous Waste
├── Waste Manifest
├── Monitoring Schedule
├── Monitoring Results
├── Exceedance
├── Spill / Environmental Incident
├── Energy / Fuel / Chemical
├── Reports
└── Settings
```

## Halaman Utama

```text
Environment Overview Dashboard
Aspect Impact Register
Environmental Permit Register
Waste Register
Limbah B3 Register
Manifest Register
Monitoring Point Register
Monitoring Schedule Calendar
Monitoring Result Entry
Lab Result Upload
Exceedance Register
Spill Register
Energy/Fuel/Chemical Usage
Environmental Report Export
Settings
```

## Detail Tabs

Environmental Permit:
```text
Overview
Obligations
Evidence
Renewal History
Attachments
Comments
Audit Trail
```

Monitoring Result:
```text
Overview
Parameter Result
Limit Comparison
Lab Report
Exceedance
Action
Review
Audit Trail
```

Exceedance:
```text
Overview
Source Result
Root Cause
Action
Verification
Evidence
Comments
Audit Trail
```

Waste Manifest:
```text
Overview
Waste Detail
Transporter
Disposal Vendor
Manifest File
Verification
Audit Trail
```

## Komponen Wajib

```text
EnvironmentStatusBadge
AspectSignificanceBadge
PermitExpiryBadge
WasteCategoryBadge
MonitoringResultBadge
LimitComparisonPanel
ExceedanceBadge
SpillSeverityBadge
ManifestStatusBadge
MonitoringCalendar
EnvironmentalKpiCard
EnvironmentalTrendChart
ComplianceEvidencePanel
```

## UX Penting

- Monitoring schedule harus bisa dilihat dalam calendar/list.
- Lab result upload harus mudah dan bisa menampilkan pass/exceedance.
- Exceedance harus terlihat jelas dan bisa langsung create action.
- Waste manifest harus mudah dilacak statusnya.
- Environmental permit expiry harus jelas.
- Dashboard harus bisa filter by site/period/media type.


---

# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Environment General

```text
environment.view
environment.view_all
environment.create
environment.update
environment.delete
environment.submit
environment.review
environment.approve
environment.close
environment.export
environment.manage_settings
```

### Waste

```text
env_waste.view
env_waste.create
env_waste.update
env_waste.verify
env_waste.export
```

### Monitoring

```text
env_monitoring.view
env_monitoring.create
env_monitoring.update
env_monitoring.review
env_monitoring.export
```

### Exceedance / Spill

```text
env_exceedance.view
env_exceedance.create
env_exceedance.assign_action
env_exceedance.verify
env_exceedance.close

env_spill.view
env_spill.create
env_spill.update
env_spill.close
```

## Scope

```text
Global
Company
Site
Project
Department
Location
Responsible Person
Reviewer
Approver
PIC
Evidence Owner
```

## Security Rules

- Semua query wajib filter company_id.
- User site scope hanya boleh melihat environment record di site terkait.
- File lab result, permit, manifest, dan evidence harus permission-guarded.
- Exceedance close butuh verification permission.
- Manifest verification butuh permission khusus.
- Export report harus audit logged.
- Environmental compliance decision penting harus human-reviewed.
- Cross-module link harus same-company only.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Aspect Impact Register
Environmental Permit
Waste Management
Limbah B3 / Manifest
Monitoring Schedule
Monitoring Result
Limit Comparison
Exceedance Detection
Spill Management
Action Tracking Integration
Legal Compliance Evidence Link
Attachment Security
Notification
Dashboard Calculation
Report Export
Audit Log
Cross-Module Links
Regression Test
```

## Release Gate

Environment Management hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Aspect impact PASS
Permit register PASS
Waste management PASS
Manifest workflow PASS
Monitoring schedule PASS
Limit comparison PASS
Exceedance detection PASS
Spill workflow PASS
Action integration PASS
Legal evidence link PASS
Attachment security PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Cross-module integration PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
ENVIRONMENT MANAGEMENT STABILIZED: GO
```

Jika gagal:

```text
ENVIRONMENT MANAGEMENT STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Legal & Compliance Register

```text
- Environmental permit can link to legal obligation.
- Monitoring parameter can use legal limit.
- Monitoring result can become evidence.
- Exceedance can create compliance gap.
- Waste manifest can become legal evidence.
```

## Audit & Inspection

```text
- Environmental inspection finding can create environment action.
- Audit can verify environmental compliance evidence.
- Failed inspection can create exceedance/finding link.
```

## Incident Management

```text
- Spill can create environmental incident.
- Major exceedance can create incident if configured.
- Incident investigation can link to environmental records.
```

## Action Tracking

```text
- Exceedance creates corrective action.
- Spill creates action.
- Manifest issue creates action.
- Permit expiry issue creates action.
```

## Document Control

```text
- SOP waste handling, spill response, monitoring method.
- Environmental permit documents.
- Lab reports and regulatory reports.
```

## Training & Competency

```text
- Waste handling training.
- Chemical handling training.
- Spill response training.
- Environmental awareness training.
```

## Asset & Equipment

```text
- Monitoring point linked to asset/equipment.
- WWTP equipment linked to monitoring.
- Emission source linked to asset.
- Flow meter/calibration link optional.
```

## Contractor Management

```text
- Waste transporter/vendor compliance.
- Disposal vendor document status.
- Contractor environmental performance.
```


---

# Environment Management Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Environmental Aspect & Impact Register
03 Environmental Permit & Compliance Link
04 Waste Management Core
05 Hazardous Waste / Limbah B3 & Manifest
06 Environmental Monitoring Schedule
07 Water, Wastewater, Emission & Noise Monitoring
08 Exceedance, Spill & Environmental Incident
09 Energy, Fuel, Chemical & Resource Monitoring
10 Integration with Legal, Audit, Incident, Action & Document
11 Dashboard, KPI, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Environment Management Sequence. Kerjakan sequence berikutnya sesuai sequence/00_ENVIRONMENT_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
ENVIRONMENT MANAGEMENT STABILIZED: GO
```
