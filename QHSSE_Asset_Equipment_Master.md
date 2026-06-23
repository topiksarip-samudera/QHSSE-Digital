# START HERE — QHSSE Asset & Equipment Generating Pack

Paket ini dibuat untuk menghasilkan modul **Asset & Equipment** pada WebApp QHSSE secara sequence, aman, dan terintegrasi.

## Rekomendasi Split

Modul **Asset & Equipment** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Asset & Equipment Register Core
03 Asset Category, Type, Location & Ownership
04 Critical Equipment & Risk Classification
05 Certificate Register & Expiry Management
06 Inspection Schedule & Inspection Result
07 Maintenance Schedule & Maintenance History
08 Calibration & Measuring Equipment Control
09 LOTO / Isolation Point & Energy Source
10 Integration with Permit, Incident, Audit, Risk, Emergency & Contractor
11 Dashboard, QR Asset, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Asset & Equipment bukan hanya daftar alat. Modul ini harus mengontrol asset ownership, critical equipment, inspection due, certificate expiry, calibration due, maintenance history, LOTO point, permit equipment validation, emergency readiness, incident history, audit finding, risk linkage, dan QR asset.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_ASSET_EQUIPMENT.md`.
3. Baca `01_ASSET_EQUIPMENT_MASTER_BLUEPRINT.md`.
4. Mulai dari `sequence/01_foundation_master_data.md`.
5. Kerjakan satu sequence saja.
6. Setelah selesai tulis `SELESAI ASSET EQUIPMENT SEQUENCE XX`.
7. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

```text
ASSET EQUIPMENT STABILIZED: GO
```


---

# 00 — PROMPT AWAL ASSET & EQUIPMENT UNTUK AI AGENT

Core Platform sudah stabil. Emergency Response, Permit to Work, Incident Management, Risk Management, Audit & Inspection, Contractor Management, Training & Competency, Document Control, Legal & Compliance, dan Action Tracking sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Asset & Equipment**.

Baca seluruh file dalam folder `qhsse_asset_equipment_generating_pack`.

Aturan wajib:
1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core: tenant, site/project/department/location, role permission, module ON/OFF, master data, workflow, action tracking, attachment, audit log, notification, calendar/schedule, numbering, checklist builder, QR, dashboard, API/webhook.
4. Asset & Equipment tidak boleh hanya menjadi daftar alat.
5. Harus ada asset/equipment register, critical equipment, certificate expiry, inspection, maintenance, calibration, LOTO/isolation point, QR asset, dashboard.
6. Semua data wajib tenant-safe dan semua API wajib permission-guarded.
7. Semua certificate, inspection, maintenance, calibration, LOTO, QR verification, status change, dan export harus audit logged.
8. Setelah sequence selesai, tulis `SELESAI ASSET EQUIPMENT SEQUENCE XX: <nama sequence>`.
9. Jangan lanjut sequence berikutnya sebelum user meminta continue.


---

# 01 — MASTER BLUEPRINT ASSET & EQUIPMENT

## Tujuan Modul

Modul **Asset & Equipment** digunakan untuk mengelola aset dan equipment QHSSE dari register, category, location, ownership, criticality, certificate, inspection, maintenance, calibration, LOTO/isolation point, QR asset, risk link, incident history, permit validation, emergency readiness, sampai dashboard.

## Prinsip Desain

1. Asset & Equipment bukan master data alat biasa.
2. Setiap asset/equipment harus punya lifecycle dan status.
3. Critical equipment harus bisa diklasifikasikan.
4. Certificate dan expiry harus bisa dikelola.
5. Inspection schedule harus bisa recurring.
6. Inspection result harus bisa membuat finding/action.
7. Maintenance history harus terdokumentasi.
8. Calibration harus mengontrol measuring equipment.
9. LOTO/isolation point harus bisa dipakai Permit to Work.
10. QR asset harus bisa dipakai untuk field verification.
11. Equipment status harus memengaruhi permit eligibility jika relevan.
12. Emergency equipment readiness harus memengaruhi Emergency Response.

## Jenis Asset / Equipment

```text
Emergency Equipment
Fire Extinguisher / APAR
Fire Hydrant
Fire Alarm
AED
Rescue Equipment
Vehicle
Heavy Equipment
Lifting Gear
Crane
Forklift
Scaffolding
Ladder
Electrical Panel
Generator
Compressor
Pressure Vessel
Pump
Gas Detector
Monitoring Equipment
Measuring Equipment
Calibration Equipment
Machine
LOTO Point
Isolation Point
Environmental Equipment
WWTP Equipment
Security Equipment
PPE Equipment
```

## Status Asset / Equipment

```text
draft
active
in_use
available
under_inspection
inspection_due
inspection_overdue
under_maintenance
maintenance_due
maintenance_overdue
calibration_due
calibration_overdue
certificate_expiring
certificate_expired
out_of_service
disposed
archived
```

## Output Utama

```text
Asset Register
Equipment Register
Critical Equipment Register
Certificate Expiry List
Inspection Due List
Inspection Result Report
Maintenance Due List
Maintenance History
Calibration Due List
Calibration Certificate Register
LOTO Point Register
Isolation Point Register
QR Asset Label
Equipment Status Board
Asset Risk Link
Equipment Incident History
Asset Dashboard
Asset Report Export
```


---

# 02 — ASSET & EQUIPMENT GENERATING RULES

## Aturan Utama

1. Jangan membuat Asset & Equipment sebagai master data alat biasa.
2. Asset/equipment harus punya status lifecycle.
3. Asset category, type, location, ownership harus configurable.
4. Critical equipment harus bisa ditandai dan diberi criticality.
5. Certificate expiry harus punya warning/notification.
6. Inspection schedule harus bisa recurring.
7. Inspection result harus bisa membuat finding/action.
8. Maintenance schedule dan history harus terdokumentasi.
9. Calibration harus punya due date, result, certificate, dan status.
10. LOTO/isolation point harus bisa dipakai oleh Permit to Work.
11. QR asset harus bisa verify asset status di lapangan.
12. Semua critical changes wajib audit log.
13. Semua data wajib tenant-safe.
14. Semua API wajib permission-guarded.

## Permission Standard

```text
asset.view
asset.view_all
asset.create
asset.update
asset.delete
asset.archive
asset.export
asset.manage_settings
equipment.view
equipment.create
equipment.update
equipment.delete
equipment.inspect
equipment.maintain
equipment.calibrate
equipment.change_status
equipment.export
asset_certificate.view
asset_certificate.create
asset_certificate.update
asset_certificate.verify
asset_inspection.view
asset_inspection.create
asset_inspection.verify
asset_inspection.close
asset_maintenance.view
asset_maintenance.create
asset_maintenance.close
asset_calibration.view
asset_calibration.create
asset_calibration.verify
loto_point.view
loto_point.create
loto_point.update
loto_point.verify
asset_qr.generate
asset_qr.verify
```

## Audit Log Wajib

```text
asset.created
asset.updated
asset.status_changed
asset.archived
equipment.created
equipment.updated
equipment.status_changed
certificate.created
certificate.verified
certificate.expired
inspection.scheduled
inspection.completed
inspection.failed
maintenance.scheduled
maintenance.completed
calibration.scheduled
calibration.completed
calibration.failed
loto_point.created
loto_point.updated
qr.verified
report.exported
settings.changed
```


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
asset_settings
asset_categories
equipment_types
asset_locations
assets
equipment
asset_ownerships
asset_criticality_levels
asset_risk_classifications
asset_certificates
asset_certificate_types
asset_inspection_schedules
asset_inspection_results
asset_inspection_items
asset_maintenance_schedules
asset_maintenance_records
asset_calibration_schedules
asset_calibration_records
measuring_equipment_controls
loto_points
isolation_points
energy_sources
asset_qr_codes
asset_links
asset_incident_links
asset_status_histories
asset_reports
```

## Field Umum Wajib

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

## assets

```text
id
company_id
asset_number
asset_name
asset_category_id
equipment_type_id optional
description
site_id
department_id
location_id
owner_department_id
custodian_id optional
manufacturer optional
model optional
serial_number optional
purchase_date optional
commissioning_date optional
criticality_level_id optional
risk_classification_id optional
is_critical
is_statutory
is_emergency_equipment
is_calibration_required
is_loto_applicable
qr_code_id optional
current_status
created_by
updated_by
created_at
updated_at
deleted_at
```

## asset_certificates

```text
asset_id
certificate_type_id
certificate_number
issued_by
issue_date
expiry_date
file_id optional
verification_status
verified_by optional
verified_at optional
status
```

## asset_inspection_results

```text
asset_id
schedule_id optional
inspection_number
inspection_date
inspected_by
result
score optional
finding_created
action_id optional
remarks
file_id optional
status
```

## loto_points

```text
asset_id
point_code
energy_source_id
isolation_method
lock_required
tag_required
verification_required
description
location_detail
status
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## Asset & Equipment Core

```text
GET    /assets
POST   /assets
GET    /assets/:id
PATCH  /assets/:id
DELETE /assets/:id
POST   /assets/:id/archive
POST   /assets/:id/change-status
GET    /assets/:id/status-history
GET    /equipment
POST   /equipment
GET    /equipment/:id
PATCH  /equipment/:id
DELETE /equipment/:id
```

## Certificates

```text
GET  /assets/:id/certificates
POST /assets/:id/certificates
GET  /asset-certificates/:certificateId
PATCH /asset-certificates/:certificateId
POST /asset-certificates/:certificateId/verify
GET  /asset-certificates/expiring
GET  /asset-certificates/expired
```

## Inspection / Maintenance / Calibration

```text
GET  /assets/:id/inspection-schedules
POST /assets/:id/inspection-schedules
POST /asset-inspections
POST /asset-inspections/:id/complete
POST /asset-inspections/:id/create-finding
GET  /assets/:id/maintenance-schedules
POST /asset-maintenance-records
POST /asset-maintenance-records/:id/close
GET  /assets/:id/calibration-schedules
POST /asset-calibrations
POST /asset-calibrations/:id/verify
GET  /asset-calibrations/due
GET  /asset-calibrations/overdue
```

## LOTO / QR / Reports

```text
GET  /assets/:id/loto-points
POST /assets/:id/loto-points
POST /loto-points/:id/verify
GET  /assets/:id/qr
POST /assets/qr/verify
GET  /asset-equipment/dashboard
GET  /asset-equipment/kpi
GET  /asset-equipment/due-list
GET  /asset-equipment/export
```


---

# 05 — UI/UX GUIDE ASSET & EQUIPMENT

## Sidebar

```text
Asset & Equipment
├── Overview
├── Asset Register
├── Equipment Register
├── Critical Equipment
├── Certificates
├── Inspection Schedule
├── Inspection Results
├── Maintenance
├── Calibration
├── LOTO / Isolation Points
├── QR Asset
├── Reports
└── Settings
```

## Asset Detail Tabs

```text
Overview
Specification
Location & Ownership
Criticality & Risk
Certificates
Inspection
Maintenance
Calibration
LOTO / Isolation
Linked Records
QR Asset
Attachments
Comments
Audit Trail
```

## Komponen Wajib

```text
AssetStatusBadge
CriticalityBadge
CertificateStatusBadge
InspectionDueBadge
MaintenanceDueBadge
CalibrationDueBadge
LotoPointTable
AssetQRCode
AssetTimeline
EquipmentReadinessCard
AssetLinkPanel
DueListPanel
```


---

# 06 — PERMISSION & SECURITY GUIDE

## Scope

```text
Global
Company
Site
Project
Department
Owner Department
Custodian
Inspector
Maintainer
Calibrator
Permit Issuer
HSE
Asset Admin
```

## Security Rules

- Semua query wajib filter company_id.
- User site scope hanya melihat asset di sitenya.
- Certificate file download harus permission-guarded.
- Status change out_of_service hanya role berwenang.
- LOTO point change harus permission khusus.
- QR verification tidak boleh membuka data sensitif tanpa auth.
- Export asset data wajib audit log.
- Maintenance/calibration verification harus backend guarded.


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Asset Register
Category / Type / Location
Criticality & Risk Classification
Certificate Register & Expiry
Inspection Schedule & Result
Maintenance Schedule & History
Calibration Control
LOTO / Isolation Point
QR Verification
Cross-Module Links
Dashboard Calculation
Report Export
Audit Log
Notification
Regression Test
```

## Release Gate

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Asset register PASS
Criticality classification PASS
Certificate expiry PASS
Inspection schedule/result PASS
Maintenance history PASS
Calibration control PASS
LOTO/isolation point PASS
QR verification PASS
Cross-module integration PASS
Dashboard calculation PASS
Report export PASS
Audit log PASS
Lint/test/build PASS
```

## Status Akhir

```text
ASSET EQUIPMENT STABILIZED: GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Permit to Work

```text
Equipment validation before permit activation.
LOTO/isolation point selection.
Lifting gear, electrical panel, gas detector validation.
Out-of-service equipment blocks permit.
```

## Emergency Response

```text
Emergency equipment readiness.
Fire equipment inspection.
AED/hydrant/alarm readiness.
Equipment not ready affects emergency readiness score.
```

## Audit & Inspection

```text
Equipment inspection checklist.
Failed inspection creates finding/action.
Audit can verify critical equipment.
```

## Incident / Risk / Contractor / Training / Document / Legal

```text
Incident can link equipment involved.
Risk can link asset hazard and critical control.
Contractor equipment certificate validation.
Operator competency validation.
Manual, SOP, inspection checklist, certificates.
Statutory certificate and legal compliance evidence.
```


---

# Asset & Equipment Sequence

01. 01 — Foundation & Master Data
02. 02 — Asset & Equipment Register Core
03. 03 — Asset Category, Type, Location & Ownership
04. 04 — Critical Equipment & Risk Classification
05. 05 — Certificate Register & Expiry Management
06. 06 — Inspection Schedule & Inspection Result
07. 07 — Maintenance Schedule & Maintenance History
08. 08 — Calibration & Measuring Equipment Control
09. 09 — LOTO / Isolation Point & Energy Source
10. 10 — Integration with Permit, Incident, Audit, Risk, Emergency & Contractor
11. 11 — Dashboard, QR Asset, Report & Export
12. 12 — QA, Test, Permission & Stabilization

## Prompt Continue

```text
Continue Asset & Equipment Sequence. Kerjakan sequence berikutnya sesuai sequence/00_ASSET_EQUIPMENT_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
ASSET EQUIPMENT STABILIZED: GO
```
