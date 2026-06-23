# ✅ CORE 05 — Role, Permission & Access Control — SELESAI

**Status:** COMPLETE  
**Date:** 2025-01-XX  
**Tests:** 166 passed (26 new roles tests)  
**Build:** API ✅ | Frontend ✅

---

## Yang Dibangun

### Backend — Dedicated Roles Module (`apps/api/src/roles/`)
- **`roles.service.ts`** — 10 methods:
  - `findAll(query, userId, isSuperAdmin)` — List roles with tenant isolation, pagination, search, status filter
  - `findOne(id)` — Get role with permissions, assigned users, counts
  - `create(dto, creatorId)` — Create custom role (code unique per company scope)
  - `update(id, dto, updaterId)` — Update custom role (system roles protected)
  - `remove(id, deleterId)` — Soft delete role (system roles protected, must have 0 users)
  - `getPermissionMatrix()` — Permissions grouped by module
  - `getAllPermissions()` — Flat list of all permissions
  - `setRolePermissions(roleId, dto)` — Replace all role permissions
  - `addRolePermissions(roleId, dto)` — Append permissions (skip duplicates)
  - `removeRolePermission(roleId, permissionId)` — Remove single permission from role
  - `getRolePermissions(roleId)` — Get role's permission list

- **`roles.controller.ts`** — 11 endpoints:
  - `GET /api/v1/roles` — List roles
  - `GET /api/v1/roles/permissions` — All permissions (flat)
  - `GET /api/v1/roles/permissions/matrix` — Permission matrix by module
  - `GET /api/v1/roles/:id` — Get role detail
  - `GET /api/v1/roles/:id/permissions` — Get role's permissions
  - `POST /api/v1/roles` — Create role
  - `PATCH /api/v1/roles/:id` — Update role
  - `DELETE /api/v1/roles/:id` — Soft delete role
  - `POST /api/v1/roles/:id/permissions` — Set permissions (replace all)
  - `POST /api/v1/roles/:id/permissions/add` — Add permissions (append)
  - `DELETE /api/v1/roles/:id/permissions/:permissionId` — Remove permission

- **DTOs:**
  - `create-role.dto.ts` — name, code, description, companyId
  - `update-role.dto.ts` — name, description, status
  - `query-roles.dto.ts` — page, pageSize, sort, order, search, status, companyId, includeSystem
  - `assign-permissions.dto.ts` — permissionIds[]

- **`roles.module.ts`** — Registered in AppModule

### Business Rules Implemented
- ✅ System roles (super_admin, company_admin, viewer) cannot be modified/deleted
- ✅ Cannot delete role that has assigned users
- ✅ Role code unique within company scope
- ✅ Tenant isolation — non-super-admin only sees roles in their companies + system roles
- ✅ Permission validation — rejects invalid permission IDs
- ✅ Duplicate permission assignment prevention

### Frontend (`apps/web/src/`)
- **`app/dashboard/roles/page.tsx`** — Role list with columns: name, code, description, type (System/Custom), status, permissions count, users count
- **`app/dashboard/roles/new/page.tsx`** — Create role form (name, code, description)
- **`app/dashboard/roles/[id]/page.tsx`** — Role detail with:
  - Role info card (code, type, status, users, permissions, created date)
  - Assigned users table
  - Permission matrix (grouped by module, with module-level toggle)
  - Edit Permissions mode for custom roles
- **`app/dashboard/roles/[id]/edit/page.tsx`** — Edit role form (name, description, status)
- **`lib/api.ts`** — Added `rolesApi` and `permissionsApi` client functions
- **`app/dashboard/layout.tsx`** — Sidebar updated with "Roles & Permissions" under User Management

### Existing Infrastructure Utilized
- **Prisma Schema:** Role, Permission, RolePermission, UserRoleAssignment, UserScope models (already existed)
- **Seed:** Permissions for 13 modules × 5 actions, system roles (super_admin, company_admin, viewer)
- **PermissionsGuard:** `auth/guards/permissions.guard.ts` — role-based permission checking (already functional)
- **Users endpoints:** `/users/:id/assign-role`, `/users/:id/assign-scope` (already existed from Core 03)

### Tests — 26 New Tests
- `roles.service.spec.ts` covering:
  - findAll (4 tests): super admin, company filter, no company assignments, search
  - findOne (2 tests): success, not found
  - create (3 tests): success, conflict, company scope
  - update (3 tests): success, not found, system role protection
  - remove (4 tests): success, system role, assigned users, not found
  - getPermissionMatrix (1 test): grouped by module
  - getAllPermissions (1 test): flat list
  - setRolePermissions (3 tests): replace, not found, invalid permissions
  - addRolePermissions (1 test): append with dedup
  - removeRolePermission (2 tests): success, not found
  - getRolePermissions (2 tests): success, not found

### Verification
- **Build:** `pnpm run build --filter=api` ✅ | `pnpm run build --filter=web` ✅
- **Tests:** `pnpm run test --filter=api` — 166 passed, 0 failed ✅
- **Migration:** Schema already exists, no changes needed

---

## Blueprint Acceptance Criteria

| Criteria | Status |
|---|---|
| Database schema and migration | ✅ Already existed |
| API running and validated | ✅ 11 endpoints |
| Permission checked in backend | ✅ PermissionsGuard + @RequiredPermissions |
| Frontend list/create/detail/edit | ✅ 4 pages |
| Audit log recorded | ✅ AuditLogInterceptor |
| Tenant isolation safe | ✅ Company-scoped roles |
| Tests pass | ✅ 166 tests |
| No hardcoded values | ✅ |
| Super Admin cannot be deleted | ✅ |
| SELESAI written | ✅ This document |

---

## File Inventory

### New Files
```
apps/api/src/roles/roles.module.ts
apps/api/src/roles/roles.service.ts
apps/api/src/roles/roles.controller.ts
apps/api/src/roles/index.ts
apps/api/src/roles/dto/create-role.dto.ts
apps/api/src/roles/dto/update-role.dto.ts
apps/api/src/roles/dto/query-roles.dto.ts
apps/api/src/roles/dto/assign-permissions.dto.ts
apps/api/src/roles/__tests__/roles.service.spec.ts
apps/web/src/app/dashboard/roles/page.tsx
apps/web/src/app/dashboard/roles/new/page.tsx
apps/web/src/app/dashboard/roles/[id]/page.tsx
apps/web/src/app/dashboard/roles/[id]/edit/page.tsx
SELESAI_CORE_05_ROLE_PERMISSION.md
```

### Modified Files
```
apps/api/src/app.module.ts (added RolesModule import)
apps/web/src/lib/api.ts (added rolesApi, permissionsApi)
apps/web/src/app/dashboard/layout.tsx (added Roles & Permissions sidebar link)
```
