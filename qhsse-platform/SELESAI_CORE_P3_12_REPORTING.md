# SELESAI CORE: Enterprise Reporting (Phase 3 — Core 12)

**Status:** COMPLETE (2026-06-22) | **Tests:** 470 cumulative

## Features

### Database (5 tables)
- `report_templates` — Executive/monthly_qhsse/site_comparison/kpi_trends/custom with JSON config
- `scheduled_reports` — Daily/weekly/monthly/quarterly with time, format (PDF/Excel/CSV)
- `report_runs` — Run history (manual/scheduled trigger, file path, status)
- `report_recipients` — Per-schedule email distribution
- `report_exports` — Download tracking per run

### Backend API
- CRUD `report-templates` with type-based filtering
- `POST /reports/:id/run` — Trigger report generation
- `GET /report-runs` — Run history
- CRUD `scheduled-reports` with recipient management

### Frontend
- 3-tab page: Report Templates (with Run button), Scheduled Reports (frequency/format/recipients), Run History

**Build:** API ✅ | Web ✅ | **Tests:** 470/470 PASS
