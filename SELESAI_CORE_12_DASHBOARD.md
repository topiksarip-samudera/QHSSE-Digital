# SELESAI CORE 12: Dashboard Basic

**Status:** COMPLETE (2026-06-22)
**Tests:** 6 tests passing for dashboard service, 367 cumulative tests across 16 test files

## Features Implemented

### Backend API (`/api/v1/dashboard`)
- ✅ `GET /dashboard/personal` — Personal dashboard: my actions, overdue, upcoming, pending approvals (from workflow instance steps), unread notifications, my workflow instances, actions by priority, recent actions
- ✅ `GET /dashboard/admin` — Admin dashboard: total/active users, sites, departments, companies, actions, attachments, modules enabled, actions by status, users by role, recent audit activity
- ✅ `GET /dashboard/qhsse` — QHSSE dashboard: total/open/overdue actions, completion rate, notifications (7 days), actions by priority/status, recent actions

### Frontend Dashboard Page
- ✅ **3-tab layout**: My Tasks | QHSSE Overview | Admin
- ✅ **My Tasks tab**: 5 stat cards (my actions, overdue, upcoming, pending approvals, unread notifications), priority breakdown, pending approvals list, recent actions with priority/status badges
- ✅ **QHSSE tab**: 5 stat cards (total, open, overdue, completion rate, notifications), bar charts for priority/status distribution, recent actions list
- ✅ **Admin tab**: 8 stat cards (users, active users, sites, departments, actions, attachments, modules, companies), users by role, actions by status, recent audit activity feed
- ✅ All stat cards clickable to navigate to related pages (users, sites, attachments, etc.)
- ✅ Priority and status badges with color coding
- ✅ Loading state while data fetches

### Business Rules
- ✅ Dashboard follows permission/scope (`dashboard-basic.view`)
- ✅ No cross-company data — all queries scoped by companyId
- ✅ Cards clickable to filtered pages
- ✅ Fast queries using Prisma aggregations (count, groupBy)

### Permissions
- ✅ `dashboard-basic.view`
- ✅ `dashboard-basic.create`
- ✅ `dashboard-basic.update`
- ✅ `dashboard-basic.delete`
- ✅ `dashboard-basic.export`
- ✅ Permissions seeded in `seed.ts`

### API Client
- ✅ Full `dashboardApi` in `lib/api.ts`: getPersonal, getAdmin, getQHSSE
- ✅ TypeScript interfaces: PersonalDashboard, AdminDashboard, QHSSEDashboard

### Infrastructure
- ✅ `DashboardModule` registered in `AppModule`
- ✅ Audit logging auto-applied via global interceptor

## Cumulative Progress
- **Cores complete:** 12/13 (Core 01-12)
- **Tests:** 367 total across 16 test files
