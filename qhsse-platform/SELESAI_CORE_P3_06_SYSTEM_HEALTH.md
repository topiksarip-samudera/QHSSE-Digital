# SELESAI CORE: System Health Monitoring (Phase 3 — Core 06)

**Status:** COMPLETE (2026-06-22) | **Tests:** 453 cumulative

## Features

### Database (7 tables)
- `system_health_logs` — CPU/RAM/disk/DB status/uptime snapshots
- `error_logs` — Error/warn/info with module, stack, metadata
- `api_metrics` — Endpoint, method, status code, duration, IP
- `queue_metrics` — Queue name, pending/processing/completed/failed
- `worker_logs` — Worker status tracking
- `alert_rules` — Metric thresholds with operators (gt/lt)
- `system_alerts` — Triggered alerts with acknowledged flag

### Backend API (`/api/v1/system-health`)
- `GET /` — Health overview (CPU, RAM, disk, DB, uptime, errors 24h, API calls, avg duration)
- `GET /errors` — Paginated error logs
- `GET/POST /alert-rules` — CRUD alert rules
- `GET /alerts` — Active alerts
- `POST /alerts/:id/acknowledge` — Acknowledge alert

### Frontend
- Health dashboard: CPU/RAM/Disk/Status cards, DB/uptime/errors/API metrics
- Active alerts list with acknowledge action

**Build:** API ✅ | Web ✅ | **Tests:** 453/453 PASS
