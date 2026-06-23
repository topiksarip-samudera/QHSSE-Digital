# ✅ SELESAI — Core 03: User Management

## Status: COMPLETED

---

## Checklist

### Database
- [x] **User** model — `id`, `email` (unique), `passwordHash`, `firstName`, `lastName`, `avatar`, `phone`, `userType` (internal/contractor/vendor/auditor/viewer), `status`, `loginAttempts`, `lockedUntil`, `passwordChangedAt`, `createdBy`, `createdAt`, `updatedAt`, `deletedAt`
- [x] **UserCompanyAssignment** model — `id`, `userId`, `companyId`, `isPrimary`, `status`, `createdAt`, `updatedAt` with `@@unique([userId, companyId])`
- [x] **UserSiteAssignment** model — `id`, `userId`, `siteId`, `companyId`, `status`, `createdAt`, `updatedAt`
- [x] **LoginHistory** model — `id`, `userId`, `email`, `status`, `ipAddress`, `userAgent`, `failureReason`, `createdAt`
- [x] Relations: `User` → `UserCompanyAssignment[]`, `UserSiteAssignment[]`, `LoginHistory[]`, `UserRoleAssignment[]`
- [x] Indexes: `email`, `status`, `userId`, `companyId`

### Backend API
- [x] **UsersModule** registered in `AppModule`
- [x] **UsersService** — 13 methods:
  - `findAll` — Paginated list with search, tenant isolation
  - `findOne` — Single user with full relations
  - `create` — Create user with password hash
  - `update` — Update user profile
  - `remove` — Soft delete user
  - `activate` — Activate user
  - `deactivate` — Deactivate user
  - `assignRole` — Assign role with company/site scope
  - `removeRole` — Remove role assignment
  - `assignScope` — Assign company/site scope
  - `removeScope` — Remove scope assignment
  - `getLoginHistory` — Paginated login history
  - `resetPassword` — Admin reset user password
- [x] **UsersController** — 13 endpoints under `/api/v1/users`:
  - `GET    /` — List users
  - `GET    /:id` — Get user detail
  - `POST   /` — Create user
  - `PATCH  /:id` — Update user
  - `DELETE /:id` — Delete user
  - `POST   /:id/activate` — Activate user
  - `POST   /:id/deactivate` — Deactivate user
  - `POST   /:id/assign-role` — Assign role
  - `DELETE /:id/assign-role/:roleId` — Remove role
  - `POST   /:id/assign-scope` — Assign scope
  - `DELETE /scopes/:scopeId` — Remove scope
  - `GET    /:id/login-history` — Login history
  - `POST   /:id/reset-password` — Reset password
- [x] DTOs (5 files): `CreateUserDto`, `UpdateUserDto`, `QueryUsersDto`, `AssignRoleDto`, `AssignScopeDto`

### Permission & Access Control
- [x] Permissions seeded: `user.view`, `user.create`, `user.update`, `user.delete`, `user.export`
- [x] Guard chain: `JwtAuthGuard` → `TenantGuard` → `PermissionsGuard`
- [x] Tenant isolation: Non-super-admin only sees users in their assigned companies
- [x] User types: internal, contractor, vendor, auditor, viewer

### Frontend
- [x] **API Client**: `usersApi` in `lib/api.ts` — 10 methods (list, get, create, update, delete, activate, deactivate, assignRole, removeRole, assignScope)
- [x] **List Page**: `/dashboard/users` — Users table with search, status filter, pagination
- [x] **Create Page**: `/dashboard/users/new` — User creation form
- [x] **Detail Page**: `/dashboard/users/[id]` — User profile with role/scope management
- [x] **Edit Page**: `/dashboard/users/[id]/edit` — Edit user form
- [x] **Sidebar**: User Management group with Users link

### Audit Log
- [x] `AuditLogInterceptor` active globally

### Tests
- [x] `users.service.spec.ts` — **37 tests** covering:
  - findAll (4), findOne (2), create (3), update (2), remove (2)
  - activate (2), deactivate (2)
  - assignRole (3), removeRole (2)
  - assignScope (2), removeScope (2)
  - getLoginHistory (2), resetPassword (2)
  - Plus tenant isolation scenarios

### Build
- [x] Backend build: ✅ Success
- [x] Frontend build: ✅ Success
- [x] Tests: ✅ All pass

---

## Summary

| Metric | Value |
|--------|-------|
| Backend endpoints | 13 |
| Service methods | 13 |
| DTO files | 5 |
| Frontend pages | 4 |
| Tests | 37 |
| Build | ✅ API + Web |

---

## Files

### Created
- `apps/api/src/users/users.service.ts`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/users/users.module.ts`
- `apps/api/src/users/dto/create-user.dto.ts`
- `apps/api/src/users/dto/update-user.dto.ts`
- `apps/api/src/users/dto/query-users.dto.ts`
- `apps/api/src/users/dto/assign-role.dto.ts`
- `apps/api/src/users/dto/assign-scope.dto.ts`
- `apps/api/src/users/__tests__/users.service.spec.ts`
- `apps/web/src/app/dashboard/users/page.tsx`
- `apps/web/src/app/dashboard/users/new/page.tsx`
- `apps/web/src/app/dashboard/users/[id]/page.tsx`
- `apps/web/src/app/dashboard/users/[id]/edit/page.tsx`

### Prisma Models
- `User`, `UserCompanyAssignment`, `UserSiteAssignment`, `LoginHistory`
