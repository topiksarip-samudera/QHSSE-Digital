# SELESAI CORE: Backup & Restore UI (Phase 3 — Core 05)

**Status:** COMPLETE (2026-06-22) | **Tests:** 451 cumulative (+3 backup tests)

## Features

### Database (4 tables)
- `backups` — Manual/scheduled backups with scope, encryption, status
- `backup_schedules` — Daily/weekly/monthly with retention and next run time
- `restore_requests` — Request → approve/reject → complete workflow
- `restore_logs` — Per-request log entries

### Backend API
- CRUD manual backups + scheduled backups
- Restore request → approve → log pipeline
- Reject restore with status tracking

### Frontend
- 3-tab page: Backups, Schedules, Restore Requests
- Create backup button, approve/reject restore actions

**Build:** API ✅ | Web ✅ | **Tests:** 451/451 PASS
