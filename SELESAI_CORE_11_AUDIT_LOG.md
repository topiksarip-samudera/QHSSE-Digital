# SELESAI CORE 11: Audit Log Basic

**Status:** COMPLETE (2026-06-22)
**Tests:** 17 tests passing for audit-log service, 361 cumulative tests across 15 test files

## Features Implemented

### Database
- ✅ `audit_logs` table — immutable record of all data changes (module, action, actor, old/new values, IP, user agent)
- ✅ `activity_logs` table — user activity tracking (login, export, sensitive data view, etc.)
- ✅ `login_histories` table — authentication events (success, failed, blocked)
- ✅ All tables indexed on `company_id`, `actor_id`, `module`, `action`, `created_at`, `status`

### Backend API (`/api/v1/audit-logs`)
- ✅ `GET /` — List audit logs (paginated, filterable by module, action, actorId, recordType, recordId, date range, full-text search)
- ✅ `GET /stats` — Audit statistics (total, by module, by action, recent activity)
- ✅ `GET /export` — Export audit logs as CSV
- ✅ `GET /:id` — Get audit log detail (includes actor info)
- ✅ `GET /activity/list` — List activity logs (paginated, filterable)
- ✅ `POST /activity` — Create activity log entry
- ✅ `GET /login-history` — List login history (paginated, filterable by status, email, date range)
- ✅ `GET /login-history/stats` — Login statistics (total, success, failed, blocked, recent)

### Tracking
- ✅ Track login/logout/failed login via `login_histories` table
- ✅ Track CRUD via `AuditLogInterceptor` (auto-logs all POST/PATCH/PUT/DELETE)
- ✅ Track approval via workflow module audit entries
- ✅ Track upload/download via attachment module audit entries
- ✅ Track settings/permission/workflow changes via audit log
- ✅ Filter/export log via API
- ✅ Audit log immutable (no update/delete endpoints)

### Business Rules
- ✅ Audit log immutable — read-only access, no delete endpoints
- ✅ Export log itself is recorded
- ✅ Only authorized roles can view (`audit-log-basic.view`)
- ✅ Old/new value capture for updates
- ✅ Company-scoped queries

### Permissions
- ✅ `audit-log-basic.view`
- ✅ `audit-log-basic.create`
- ✅ `audit-log-basic.update`
- ✅ `audit-log-basic.delete`
- ✅ `audit-log-basic.export`
- ✅ Permissions seeded in `seed.ts`

### Frontend Pages
- ✅ **Activity Page** (`/dashboard/audit-log`) — Stats cards, tabs (Audit Logs / Login History), filters (search, module, action, date range), table with module/action/record/actor/IP columns, pagination, CSV export
- ✅ **Detail Page** (`/dashboard/audit-log/[id]`) — Event info, network info, old value, new value, metadata JSON views
- ✅ **Settings Page** (`/dashboard/audit-log/settings`) — Retention period, logged events toggles (data changes, access events, config changes), advanced settings

### Sidebar Navigation
- ✅ Audit Log section with sub-links: Activity, Settings

### API Client
- ✅ Full `auditLogApi` in `lib/api.ts` with getAuditLogs, getAuditLogById, getStats, exportAuditLogs, getLoginHistory, getLoginHistoryStats, getActivityLogs, createActivityLog

### Infrastructure
- ✅ `AuditLogInterceptor` registered globally in `AppModule` — auto-logs all mutating requests
- ✅ `AuditLogModule` registered in `AppModule`

## Cumulative Progress
- **Cores complete:** 11/13 (Core 01-11)
- **Tests:** 361 total across 15 test files
