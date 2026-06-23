# ✅ SELESAI — Core 06: Master Data Management

## Status: COMPLETED

---

## Checklist

### Database
- [x] Schema: `MasterDataGroup` model — `id`, `companyId`, `name`, `code`, `description`, `isSystem`, `status`, `createdAt`, `updatedAt`
- [x] Schema: `MasterDataItem` model — `id`, `groupId`, `companyId`, `parentId`, `name`, `code`, `value`, `sortOrder`, `metadata`, `status`, `createdBy`, `createdAt`, `updatedAt`, `deletedAt`
- [x] Relations: `MasterDataGroup` → `MasterDataItem[]` (1:N, cascade delete)
- [x] Relations: `MasterDataItem` → self-referential tree (`parent`/`children` via `parentId`)
- [x] Indexes: `companyId`, `groupId`, `parentId`, `status`
- [x] Unique constraint: `@@unique([companyId, code])` on groups
- [x] Prisma Client regenerated with new `parentId`/`parent`/`children` fields

### Backend API
- [x] **MasterDataModule** registered in `AppModule`
- [x] **MasterDataService** — 13 methods:
  - Groups: `findAllGroups`, `findOneGroup`, `createGroup`, `updateGroup`, `removeGroup`
  - Items: `findAllItems`, `findOneItem`, `createItem`, `updateItem`, `removeItem`, `restoreItem`
  - Export: `exportItems`
- [x] **MasterDataController** — 12 endpoints:
  - `GET    /api/v1/master-data/groups` — List groups (paginated, filterable)
  - `GET    /api/v1/master-data/groups/:id` — Get group with items
  - `POST   /api/v1/master-data/groups` — Create group
  - `PATCH  /api/v1/master-data/groups/:id` — Update group
  - `DELETE /api/v1/master-data/groups/:id` — Delete group
  - `GET    /api/v1/master-data/items` — List items (paginated, filterable)
  - `GET    /api/v1/master-data/items/:id` — Get item detail
  - `POST   /api/v1/master-data/items` — Create item
  - `PATCH  /api/v1/master-data/items/:id` — Update item
  - `DELETE /api/v1/master-data/items/:id` — Soft-delete item
  - `POST   /api/v1/master-data/items/:id/restore` — Restore archived item
  - `GET    /api/v1/master-data/export` — Export items as JSON
- [x] DTOs: `CreateGroupDto`, `UpdateGroupDto`, `CreateItemDto`, `UpdateItemDto`, `QueryGroupsDto`, `QueryItemsDto`
- [x] Permission checked via `@RequiredPermissions('master-data.*')` decorators

### Permission & Access Control
- [x] Permissions seeded: `master-data.view`, `master-data.create`, `master-data.update`, `master-data.delete`, `master-data.export`
- [x] Guard chain: `JwtAuthGuard` → `TenantGuard` → `PermissionsGuard`
- [x] Tenant isolation: Non-super-admin users only see groups/items for their assigned companies
- [x] System groups protected from deletion (`isSystem = true` → `ForbiddenException`)

### Business Logic
- [x] Code uniqueness enforced within company scope (groups) and group scope (items)
- [x] Cannot delete group with active items (`BadRequestException`)
- [x] Parent-child validation: same group, no self-reference
- [x] Soft delete with children cascade on items
- [x] Restore archived items
- [x] Search across name, code, description/value
- [x] Pagination with configurable pageSize

### Seed Data
- [x] `prisma/seed.ts` updated — 5 default system groups seeded:
  1. `risk_level` — Extreme, High, Medium, Low
  2. `incident_type` — Near Miss, First Aid, Medical Treatment, LTI, Fatality
  3. `inspection_status` — Scheduled, In Progress, Completed, Overdue
  4. `hazard_category` — Physical, Chemical, Biological, Ergonomic, Psychosocial
  5. `compliance_status` — Compliant, Non-Compliant, Pending Review, Expired

### Frontend
- [x] **API Client**: `masterDataApi` added to `lib/api.ts` — 12 methods (groups CRUD, items CRUD, restore, export)
- [x] **List Page**: `/dashboard/master-data` — Groups table with search, status filter, pagination, export button
- [x] **Create Group**: `/dashboard/master-data/new` — Form via `OrgFormPage`
- [x] **Group Detail**: `/dashboard/master-data/[id]` — Group info cards + items table with CRUD actions
- [x] **Edit Group**: `/dashboard/master-data/[id]/edit` — Form via `OrgFormPage`
- [x] **Add Item**: `/dashboard/master-data/[id]/items/new` — Form via `OrgFormPage`
- [x] **Edit Item**: `/dashboard/master-data/[id]/items/[itemId]/edit` — Form via `OrgFormPage`
- [x] **Sidebar**: "🗃️ Master Data" link added to navigation

### Audit Log
- [x] `AuditLogInterceptor` active globally — all create/update/delete operations logged

### Tests
- [x] `master-data.service.spec.ts` — **31 tests** covering:
  - Groups: findAll (4), findOne (2), create (2), update (2), delete (3)
  - Items: findAll (2), findOne (2), create (4), update (3), remove (2), restore (3), export (2)
- [x] All **197 backend tests pass** (10 test files, 0 failures)

### Build
- [x] Backend build: `pnpm run build --filter=api` — ✅ Success
- [x] Frontend build: `pnpm run build --filter=web` — ✅ Success
- [x] Tests: `pnpm run test --filter=api` — ✅ 197 passed

---

## Summary

| Metric | Value |
|--------|-------|
| Backend endpoints | 12 |
| Service methods | 13 |
| DTO files | 6 |
| Frontend pages | 7 |
| Seed data groups | 5 (20 items) |
| New tests | 31 |
| Total tests | 197 |
| Build | ✅ API + Web |
| Blueprint acceptance criteria | ✅ All met |

---

## Files Created/Modified

### Created
- `apps/api/src/master-data/master-data.service.ts`
- `apps/api/src/master-data/master-data.controller.ts`
- `apps/api/src/master-data/master-data.module.ts`
- `apps/api/src/master-data/index.ts`
- `apps/api/src/master-data/dto/create-group.dto.ts`
- `apps/api/src/master-data/dto/update-group.dto.ts`
- `apps/api/src/master-data/dto/create-item.dto.ts`
- `apps/api/src/master-data/dto/update-item.dto.ts`
- `apps/api/src/master-data/dto/query-groups.dto.ts`
- `apps/api/src/master-data/dto/query-items.dto.ts`
- `apps/api/src/master-data/__tests__/master-data.service.spec.ts`
- `apps/web/src/app/dashboard/master-data/page.tsx`
- `apps/web/src/app/dashboard/master-data/new/page.tsx`
- `apps/web/src/app/dashboard/master-data/[id]/page.tsx`
- `apps/web/src/app/dashboard/master-data/[id]/edit/page.tsx`
- `apps/web/src/app/dashboard/master-data/[id]/items/new/page.tsx`
- `apps/web/src/app/dashboard/master-data/[id]/items/[itemId]/edit/page.tsx`

### Modified
- `prisma/schema.prisma` — Added `parentId`, `parent`, `children` to `MasterDataItem`
- `prisma/seed.ts` — Added 5 default master data groups with 20 items
- `apps/api/src/app.module.ts` — Imported `MasterDataModule`
- `apps/web/src/lib/api.ts` — Added `masterDataApi` client
- `apps/web/src/app/dashboard/layout.tsx` — Added Master Data to sidebar
