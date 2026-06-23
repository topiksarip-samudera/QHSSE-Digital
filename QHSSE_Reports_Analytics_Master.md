# START HERE — QHSSE Reports & Analytics Generating Pack

Paket ini untuk generate modul **Reports & Analytics** setelah seluruh QHSSE Operational Modules selesai.

## Rekomendasi Split

Reports & Analytics sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Reporting Data Model
02 Global Dashboard Framework
03 Executive QHSSE Dashboard
04 Incident, Risk & Permit Analytics
05 Audit, CAPA & Compliance Analytics
06 Training, Contractor & Competency Analytics
07 Environment, Quality & Security Analytics
08 Emergency, Asset & Equipment Analytics
09 Report Builder & Custom Report Designer
10 Scheduled Report, Export & Distribution
11 Data Governance, Access Control & Performance Optimization
12 QA, Test, Permission & Stabilization
```

## Sumber Data

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
```

## Tujuan

Menyatukan seluruh data QHSSE menjadi:
- Executive Dashboard
- QHSSE Performance Dashboard
- KPI Dashboard
- Trend Analysis
- Compliance Score
- Risk Heatmap
- Incident Analytics
- Audit & CAPA Analytics
- Report Builder
- Scheduled Report
- Export PDF / Excel / CSV
- Data governance dan access control

## Cara Pakai

1. Extract ZIP.
2. Baca `00_PROMPT_AWAL_REPORTS_ANALYTICS.md`.
3. Baca `01_REPORTS_ANALYTICS_MASTER_BLUEPRINT.md`.
4. Mulai dari `sequence/01_foundation_reporting_data_model.md`.
5. Kerjakan satu sequence saja.
6. Setelah selesai tulis status sequence.
7. Jangan lanjut sebelum diminta continue.

## Status Akhir

```text
REPORTS ANALYTICS STABILIZED: GO
```


---

# 00 — PROMPT AWAL REPORTS & ANALYTICS

Core Platform sudah stabil. Semua QHSSE Operational Modules sudah selesai atau siap integrasi:

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
```

Sekarang generate **Reports & Analytics** berdasarkan folder `qhsse_reports_analytics_generating_pack`.

Aturan wajib:
1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_reporting_data_model.md`.
3. Reports & Analytics tidak boleh hanya dashboard statis.
4. Harus ada metric catalog, KPI definition, data source registry, dashboard framework, widget engine, executive dashboard, analytics per modul, report builder, scheduled report, export PDF/Excel/CSV, data governance, row-level security, cache/materialized view, dan QA.
5. Semua report, export, drill-down, scheduled distribution, dan setting change wajib audit logged.
6. Semua data wajib tenant-safe, site/project/department scoped, dan permission-guarded.
7. Setelah selesai tulis:
`SELESAI REPORTS ANALYTICS SEQUENCE 01: Foundation & Reporting Data Model`

Jangan lanjut sequence berikutnya sebelum saya minta continue.


---

# 01 — MASTER BLUEPRINT REPORTS & ANALYTICS

## Tujuan

Reports & Analytics menjadi pusat informasi QHSSE untuk management, HSE, auditor, site/project, contractor reviewer, dan tenant SaaS.

## Submodul

```text
Metric Catalog
KPI Definition
Data Source Registry
Dashboard Framework
Widget Engine
Executive Dashboard
Operational Analytics
Report Builder
Custom Report Designer
Scheduled Report
Export PDF / Excel / CSV
Report Distribution
Data Governance
Access Control
Cache / Materialized View
Performance Optimization
```

## Dashboard

```text
Executive QHSSE Dashboard
QHSSE Performance Dashboard
Incident Dashboard
Risk Dashboard
Permit Dashboard
Audit & CAPA Dashboard
Compliance Dashboard
Training Dashboard
Contractor Dashboard
Environment Dashboard
Quality Dashboard
Security Dashboard
Emergency Dashboard
Asset Dashboard
```

## KPI Utama

```text
Total Incident
TRIR
LTIFR
Severity Rate
Near Miss Rate
Open CAPA
Overdue CAPA
Risk Heatmap
High Risk Open
Residual Risk Trend
Active Permit
Expired Permit
Audit Score
Finding Closure Rate
Compliance Score
Legal Obligation Due
Training Completion
Competency Gap
Certificate Expiry
Contractor Performance Score
Environmental Exceedance
Waste Generated
Emission Trend
NCR Count
Complaint Count
Cost of Poor Quality
Security Incident
Emergency Readiness Score
Drill Completion
Asset Readiness
Inspection Overdue
Calibration Due
```

## Prinsip

- Semua KPI harus punya formula dan source module.
- Semua dashboard harus filterable dan drillable.
- Semua drill-down harus kembali ke record sumber.
- Semua report harus permission-aware.
- Semua query harus tenant-safe.
- Semua export harus audit logged.
- Semua analytics berat memakai cache/materialized view.


---

# 02 — GENERATING RULES

## Aturan Wajib

1. Jangan buat dashboard statis.
2. Buat metric catalog sebelum dashboard.
3. Buat data source registry untuk semua modul.
4. Setiap KPI wajib punya formula, unit, source, period, dan threshold.
5. Setiap widget wajib punya permission key.
6. Setiap dashboard wajib punya filter date range, company, site, project, department, module, status.
7. Setiap analytics wajib punya drill-down.
8. Report builder tidak boleh menerima raw SQL dari user.
9. Export wajib lewat queue/job untuk data besar.
10. Scheduled report wajib punya audit log dan distribution log.
11. Terapkan row-level access control.
12. Optimalkan dengan cache, snapshot, aggregation table, materialized view.

## Permissions

```text
reports.view
reports.view_all
reports.create
reports.update
reports.delete
reports.export
reports.schedule
reports.manage_settings
analytics.view
analytics.view_executive
analytics.view_incident
analytics.view_risk
analytics.view_permit
analytics.view_audit
analytics.view_compliance
analytics.view_training
analytics.view_contractor
analytics.view_environment
analytics.view_quality
analytics.view_security
analytics.view_emergency
analytics.view_asset
dashboard.view
dashboard.create_custom
dashboard.save_view
dashboard.share
report_builder.view
report_builder.create
report_builder.update
report_builder.delete
report_builder.publish
metric.manage
```

## Audit Log

```text
dashboard.viewed
dashboard.saved_view_created
analytics.drilldown_opened
metric.created
metric.updated
report.created
report.updated
report.exported
report.scheduled
report.distributed
report_builder.dataset_accessed
settings.changed
```


---

# 03 — REPORTING DATA MODEL GUIDE

## Tabel Minimal

```text
reporting_settings
reporting_data_sources
reporting_metric_catalog
reporting_metric_formulas
reporting_kpi_definitions
reporting_kpi_thresholds
dashboard_definitions
dashboard_widgets
dashboard_saved_views
dashboard_user_preferences
analytics_cache_jobs
analytics_metric_snapshots
analytics_aggregations
report_templates
custom_reports
custom_report_fields
custom_report_filters
custom_report_charts
scheduled_reports
scheduled_report_recipients
report_exports
report_distribution_logs
report_access_logs
reporting_audit_logs
```

## Field Wajib Tenant-Specific

```text
id
company_id
site_id optional
project_id optional
department_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## Entitas Kunci

`reporting_metric_catalog`:
```text
metric_key, metric_name, module_key, unit, aggregation_type, formula_expression, source_id, date_field, scope_field, permission_key, is_enabled
```

`dashboard_widgets`:
```text
dashboard_id, widget_key, title, widget_type, metric_id, chart_type, query_config_json, filter_config_json, drilldown_config_json, permission_key
```

`custom_reports`:
```text
report_name, dataset_key, visibility, filter_config_json, field_config_json, chart_config_json, sort_config_json, permission_key
```

`scheduled_reports`:
```text
schedule_name, frequency, cron_expression, timezone, recipient_config_json, export_format, last_run_at, next_run_at, status
```


---

# 04 — API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## Metric & KPI

```text
GET    /reporting/data-sources
POST   /reporting/data-sources
GET    /reporting/metrics
POST   /reporting/metrics
GET    /reporting/metrics/:id
PATCH  /reporting/metrics/:id
POST   /reporting/metrics/:id/refresh
GET    /reporting/kpis
POST   /reporting/kpis
PATCH  /reporting/kpis/:id
```

## Dashboard & Analytics

```text
GET    /dashboards
POST   /dashboards
GET    /dashboards/:id
PATCH  /dashboards/:id
GET    /dashboards/:id/widgets
POST   /dashboards/:id/widgets
GET    /dashboards/executive-qhsse
GET    /dashboards/qhsse-performance
GET    /analytics/incident
GET    /analytics/risk
GET    /analytics/permit
GET    /analytics/audit
GET    /analytics/capa
GET    /analytics/compliance
GET    /analytics/training
GET    /analytics/contractor
GET    /analytics/environment
GET    /analytics/quality
GET    /analytics/security
GET    /analytics/emergency
GET    /analytics/asset
GET    /analytics/drilldown
```

## Report Builder, Export, Schedule

```text
GET    /report-builder/datasets
GET    /report-builder/datasets/:key/fields
POST   /report-builder/preview
GET    /custom-reports
POST   /custom-reports
PATCH  /custom-reports/:id
POST   /custom-reports/:id/publish
POST   /custom-reports/:id/export
POST   /reports/export
GET    /reports/exports
GET    /scheduled-reports
POST   /scheduled-reports
PATCH  /scheduled-reports/:id
POST   /scheduled-reports/:id/run-now
GET    /report-distribution-logs
```


---

# 05 — UI/UX GUIDE

## Sidebar

```text
Reports & Analytics
├── Executive Dashboard
├── QHSSE Performance
├── Incident Analytics
├── Risk Analytics
├── Permit Analytics
├── Audit & CAPA Analytics
├── Compliance Analytics
├── Training Analytics
├── Contractor Analytics
├── Environment Analytics
├── Quality Analytics
├── Security Analytics
├── Emergency Analytics
├── Asset Analytics
├── Report Builder
├── Scheduled Reports
├── Export History
└── Settings
```

## Components

```text
MetricCard
TrendChart
HeatmapWidget
DonutChart
GaugeWidget
LeaderboardTable
DueListTable
FilterBar
DateRangePicker
ScopeSelector
SavedViewSelector
DrilldownDrawer
ExportButton
ReportBuilderCanvas
ScheduleReportDialog
```

## Report Builder Flow

```text
1 Select dataset
2 Select fields
3 Add filters
4 Add grouping/sorting
5 Choose chart/table
6 Preview
7 Save / Publish / Export / Schedule
```


---

# 06 — PERMISSION & SECURITY GUIDE

## Rules

- Semua query wajib filter `company_id`.
- Scope wajib mengikuti site/project/department/location user.
- Widget disembunyikan jika permission tidak ada.
- Drill-down harus memanggil permission source module.
- Custom report tidak boleh bypass permission.
- Export wajib audit log.
- Scheduled report recipient wajib divalidasi.
- Report sharing lintas tenant dilarang.
- Data sensitif harus masking sesuai permission.
- Row limit dan export limit wajib dikonfigurasi.

## Roles

```text
Executive Viewer
QHSSE Manager
Site HSE
Department Head
Auditor
Module Owner
Report Designer
Report Scheduler
Tenant Admin
```


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Metric Accuracy
KPI Formula
Dashboard Widget
Filter & Date Range
Drill-Down
Executive Dashboard
Operational Analytics
Report Builder
Custom Report
Scheduled Report
Export PDF / Excel / CSV
Data Governance
Cache / Aggregation
Performance
Audit Log
Regression Test
```

## Release Gate

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Metric catalog PASS
KPI formula PASS
Dashboard framework PASS
Executive dashboard PASS
All module analytics PASS
Report builder PASS
Scheduled report PASS
Export PDF/Excel/CSV PASS
Drill-down PASS
Audit log PASS
Cache/performance PASS
Cross-module integration PASS
Lint/test/build PASS
```

Status akhir:

```text
REPORTS ANALYTICS STABILIZED: GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

Reports & Analytics mengambil data dari:

```text
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
```

## Mapping Ringkas

```text
Incident → frequency, severity, RCA, CAPA
Risk → risk level, residual risk, control effectiveness
Permit → active permit, high-risk work, extension, closure
Audit → finding, score, action closure
Document → acknowledgement, obsolete, revision
Training → completion, competency gap, certificate expiry
Legal → compliance score, obligation due, evidence
Environment → exceedance, waste, emission, monitoring
Quality → NCR, complaint, defect, COPQ
Security → incident, patrol, access, visitor
Contractor → compliance, worker, equipment, performance
Emergency → drill, readiness, emergency equipment
Asset → certificate, inspection, maintenance, calibration
```


---

# Reports & Analytics Sequence

```text
01 Foundation & Reporting Data Model
02 Global Dashboard Framework
03 Executive QHSSE Dashboard
04 Incident, Risk & Permit Analytics
05 Audit, CAPA & Compliance Analytics
06 Training, Contractor & Competency Analytics
07 Environment, Quality & Security Analytics
08 Emergency, Asset & Equipment Analytics
09 Report Builder & Custom Report Designer
10 Scheduled Report, Export & Distribution
11 Data Governance, Access Control & Performance Optimization
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Reports & Analytics Sequence. Kerjakan sequence berikutnya sesuai sequence/00_REPORTS_ANALYTICS_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
REPORTS ANALYTICS STABILIZED: GO
```
