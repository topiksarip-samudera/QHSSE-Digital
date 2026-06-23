# BUG_REGISTER — QHSSE Core Platform Stabilization

## P0: Cross-Tenant Data Leak

| ID | Severity | Module | Description | Date Found | Date Fixed |
|----|----------|--------|-------------|-----------|------------|
| P0-01 | P0 | Tenant Guard | `req.user.companyId` always `undefined` — JWT strategy returns no `companyId`, TenantGuard writes to `request.companyId` not `request.user.companyId`. All 201+ controller refs reading `req.user.companyId` get `undefined`. | 2026-06-22 | 2026-06-22 |
| P0-02 | P0 | Workflow | Zero tenant isolation on all `findOne`/mutate methods. Any user can read/update/delete any workflow/instance/step across any company. `checkSlaBreaches` accepts companyId but never uses it. | 2026-06-22 | 2026-06-22 |

## P1: Missing Tenant Isolation

| ID | Severity | Module | Description | Date Found | Date Fixed |
|----|----------|--------|-------------|-----------|------------|
| P1-01 | P1 | Users | `findOne(id)` exposes full user data (company assignments, roles, scopes) without tenant check. | 2026-06-22 | 2026-06-22 |
| P1-02 | P1 | Notifications | Template CRUD has no companyId isolation. `getTemplateById`, `updateTemplate`, `deleteTemplate`, `getLogs` all unprotected. | 2026-06-22 | PENDING |
| P1-03 | P1 | Global Search | `deleteSaved(id)` deletes by ID only — any user can delete any saved search. | 2026-06-22 | PENDING |
| P1-04 | P1 | Dashboard | Personal dashboard: 3/9 sub-queries omit companyId (pendingWorkflowSteps, unreadNotifications, myWorkflowInstances). | 2026-06-22 | PENDING |
