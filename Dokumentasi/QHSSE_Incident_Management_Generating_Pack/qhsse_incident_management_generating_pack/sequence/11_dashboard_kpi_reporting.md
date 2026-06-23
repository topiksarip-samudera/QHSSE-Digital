# Incident Management Sequence 11 — Dashboard, KPI & Reporting

## Tujuan

Membangun dashboard, KPI, report export, PDF report, dan data source untuk analytics incident.

## Fitur yang Harus Dibuat

- [ ] Incident dashboard
- [ ] Incident trend
- [ ] Incident by type
- [ ] Incident by severity
- [ ] Incident by site
- [ ] Incident by department
- [ ] Open investigation
- [ ] Open CAPA
- [ ] Overdue CAPA
- [ ] Lost time days
- [ ] Repeat incident
- [ ] LTIFR data source
- [ ] TRIR data source
- [ ] Severity Rate data source
- [ ] Export Excel
- [ ] Export PDF
- [ ] Incident Report PDF
- [ ] Investigation Report PDF
- [ ] Lessons Learned Report

## Database / Tabel Minimal

- `incidents`
- `incident_kpi_snapshots_optional`
- `report_exports`
- `scheduled_reports_optional`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/dashboard`
- `GET /incidents/kpi`
- `GET /incidents/trends`
- `GET /incidents/export`
- `GET /incidents/:id/report`
- `GET /incidents/:id/investigation-report`
- `GET /incidents/:id/lessons-learned-report`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Incident Dashboard Page
- KPI cards
- Trend charts
- Filter by date/site/department/type/severity
- Export buttons
- Report preview/download

## Permission yang Dipakai

```text
incident.view
incident.view_all
incident.export
incident.report
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan



## Validasi Backend

- [ ] Dashboard must follow user scope
- [ ] Export must follow permission and scope
- [ ] Date range must be valid
- [ ] KPI formulas must be documented
- [ ] No cross-company data in report

## Testing Minimal

- [ ] Dashboard counts correct
- [ ] Date filter works
- [ ] Site scope dashboard correct
- [ ] Export respects permission
- [ ] Company A export excludes Company B
- [ ] PDF report generated
- [ ] Audit log created for export


## Output yang Harus Jadi

- Incident dashboard
- KPI data source
- Excel/PDF export
- Incident report PDF
- Investigation report PDF


## Acceptance Criteria

- [ ] Management can see incident KPIs
- [ ] Dashboard obeys tenant and scope
- [ ] Export works and is audited
- [ ] PDF reports include complete data
- [ ] KPI calculations are documented

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 11: Dashboard, KPI & Reporting. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 11.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 11: Dashboard, KPI & Reporting
```
