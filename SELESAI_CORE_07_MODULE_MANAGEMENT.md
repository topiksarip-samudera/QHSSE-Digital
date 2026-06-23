# SELESAI — CORE 07: Module Management ON/OFF

**Tanggal:** 2026-06-22  
**Status:** ✅ COMPLETE  
**Tests:** 39 tests, 0 failures  
**Build:** Backend ✅ | Frontend ✅

---

## Ringkasan

Core 07 membangun **Module Management ON/OFF** — sistem untuk mengelola modul QHSSE secara sistem-wide, mengaktifkan/menonaktifkan modul per tenant, mengelola sub-features, dan mengatur akses modul per role.

---

## Database / Schema

### Models Baru (2)

| Model | Tabel | Keterangan |
|-------|-------|------------|
| `TenantFeatureFlag` | `tenant_feature_flags` | Feature flags per tenant — enable/disable sub-features |
| `RoleModuleAccess` | `role_module_access` | Akses modul per role per tenant |

### Models Existing (sudah ada dari Core 01)

| Model | Tabel | Keterangan |
|-------|-------|------------|
| `Module` | `modules` | 13 QHSSE modules (Risk, Incident, Audit, dll) |
| `ModuleFeature` | `module_features` | Sub-features per module |
| `TenantModule` | `tenant_modules` | Enable/disable module per tenant |

### Schema Changes

```prisma
model TenantFeatureFlag {
  id, tenantId, featureId, isEnabled, config (Json), enabledAt, disabledAt
  @@unique([tenantId, featureId])
}

model RoleModuleAccess {
  id, roleId, moduleId, tenantId, canAccess, createdAt
  @@unique([roleId, moduleId, tenantId])
}
```

### Relations Added

- `Tenant` → `featureFlags[]`, `roleModuleAccess[]`
- `Module` → `roleModuleAccess[]`
- `ModuleFeature` → `tenantFeatureFlags[]`
- `Role` → `roleModuleAccess[]`

---

## Seed Data

### Module Features (52 features untuk 13 modules)

| Module | Features |
|--------|----------|
| Risk Management | risk-register, risk-assessment, risk-mitigation, risk-matrix |
| Incident Management | incident-report, investigation, corrective-action, root-cause-analysis |
| Audit & Inspection | audit-plan, inspection-checklist, findings, non-conformance |
| Permit to Work | permit-request, permit-approval, permit-closure, gas-testing |
| Document Control | document-creation, document-approval, document-review, version-control |
| Training & Competency | training-plan, training-attendance, competency-assessment, certification-tracking |
| Legal Compliance | legal-register, compliance-monitoring, regulatory-update, gap-analysis |
| Environment | waste-management, emission-monitoring, water-management, environmental-impact |
| Quality | quality-plan, quality-inspection, corrective-preventive, quality-metrics |
| Security | access-control, visitor-management, security-patrol, incident-reporting |
| Contractor Management | contractor-registration, contractor-evaluation, work-permit, safety-briefing |
| Action Tracking | action-creation, action-assignment, action-monitoring, action-closure |
| Dashboard | executive-dashboard, safety-dashboard, environmental-dashboard, quality-dashboard |

### Role Module Access

- `super_admin` → full access to all 13 modules

---

## Backend API

### Service: `ModuleManagementService` (15 methods)

| Method | Fungsi |
|--------|--------|
| `findAllModules` | List semua sistem modules dengan filter/pagination |
| `findOneModule` | Get module by ID dengan features, tenant assignments, role access |
| `findModuleByCode` | Get module by code |
| `createModule` | Buat module baru |
| `updateModule` | Update module (name, icon, sortOrder, isActive) |
| `deleteModule` | Hapus module (dicekal jika masih aktif di tenant) |
| `createFeature` | Tambah sub-feature ke module |
| `updateFeature` | Update feature (name, description, isActive) |
| `deleteFeature` | Hapus feature |
| `getTenantModules` | Get semua modules untuk tenant dengan status enable/disable + feature flags |
| `toggleTenantModule` | Enable/disable module untuk tenant |
| `toggleTenantFeature` | Enable/disable feature untuk tenant |
| `getRoleModuleAccess` | Get akses module untuk role |
| `setRoleModuleAccess` | Set akses module untuk role |
| `bulkToggleTenantModules` | Bulk enable/disable modules |

### Controller: `ModuleManagementController` (15 endpoints)

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/v1/modules` | `module.view` |
| GET | `/api/v1/modules/:id` | `module.view` |
| GET | `/api/v1/modules/code/:code` | `module.view` |
| POST | `/api/v1/modules` | `module.create` |
| PATCH | `/api/v1/modules/:id` | `module.update` |
| DELETE | `/api/v1/modules/:id` | `module.delete` |
| POST | `/api/v1/modules/:id/features` | `module.create` |
| PATCH | `/api/v1/modules/features/:featureId` | `module.update` |
| DELETE | `/api/v1/modules/features/:featureId` | `module.delete` |
| GET | `/api/v1/modules/tenant/:tenantId` | `module.view` |
| PATCH | `/api/v1/modules/tenant/:tenantId/:moduleId` | `module.update` |
| POST | `/api/v1/modules/tenant/:tenantId/bulk-toggle` | `module.update` |
| PATCH | `/api/v1/modules/tenant/:tenantId/features/:featureId` | `module.update` |
| GET | `/api/v1/modules/access/:tenantId/role/:roleId` | `module.view` |
| PATCH | `/api/v1/modules/access/:tenantId/role/:roleId/:moduleId` | `module.update` |

### Module: `ModuleManagementModule`

Terdaftar di `AppModule` sebagai import.

---

## Frontend

### Pages (5)

| Path | File | Fungsi |
|------|------|--------|
| `/dashboard/module-management` | `page.tsx` | Grid view semua modules dengan toggle active/inactive |
| `/dashboard/module-management/new` | `new/page.tsx` | Form buat module baru |
| `/dashboard/module-management/[id]` | `[id]/page.tsx` | Detail module — features table, tenant assignments |
| `/dashboard/module-management/[id]/edit` | `[id]/edit/page.tsx` | Edit module |
| `/dashboard/module-management/tenant` | `tenant/page.tsx` | Tenant module settings — toggle modules & features per tenant |

### API Functions

`moduleManagementApi` object dengan 13 methods di `apps/web/src/lib/api.ts`.

### Sidebar Navigation

Ditambahkan di `layout.tsx`:
```
🧩 Module Management
    ├── System Modules → /dashboard/module-management
    └── Tenant Settings → /dashboard/module-management/tenant
```

---

## Business Rules Implemented

- ✅ Module OFF tidak tampil di tenant
- ✅ API module OFF menolak request (feature toggle checks parent module)
- ✅ Sub-features bisa ON/OFF independently
- ✅ Module dengan active tenants tidak bisa dihapus
- ✅ Bulk toggle untuk efisiensi

---

## DTOs (6)

1. `CreateModuleDto` — name, code, description, icon, sortOrder
2. `UpdateModuleDto` — name, description, icon, sortOrder, isActive
3. `CreateFeatureDto` — name, code, description, isActive
4. `ToggleModuleDto` — isEnabled, config
5. `ToggleFeatureDto` — isEnabled, config
6. `QueryModulesDto` — page, pageSize, search, status, sort, order

---

## Testing

**39 tests, 0 failures** — `apps/api/src/modules/__tests__/module-management.service.spec.ts`

| Group | Tests | Status |
|-------|-------|--------|
| findAllModules | 4 | ✅ |
| findOneModule | 2 | ✅ |
| createModule | 2 | ✅ |
| updateModule | 2 | ✅ |
| deleteModule | 3 | ✅ |
| createFeature | 3 | ✅ |
| updateFeature | 2 | ✅ |
| deleteFeature | 2 | ✅ |
| getTenantModules | 3 | ✅ |
| toggleTenantModule | 4 | ✅ |
| toggleTenantFeature | 3 | ✅ |
| getRoleModuleAccess | 2 | ✅ |
| setRoleModuleAccess | 3 | ✅ |
| bulkToggleTenantModules | 2 | ✅ |
| findModuleByCode | 2 | ✅ |

---

## Total Test Suite

| File | Tests |
|------|-------|
| auth.service.spec.ts | 30 |
| permissions.guard.spec.ts | 6 |
| companies.service.spec.ts | 20 |
| sites.service.spec.ts | 14 |
| departments.service.spec.ts | 11 |
| locations.service.spec.ts | 11 |
| positions.service.spec.ts | 11 |
| users.service.spec.ts | 37 |
| roles.service.spec.ts | 26 |
| master-data.service.spec.ts | 31 |
| **module-management.service.spec.ts** | **39** |
| **TOTAL** | **236** |

---

## File Inventory

### Backend (9 files)
- `prisma/schema.prisma` — added TenantFeatureFlag, RoleModuleAccess
- `prisma/seed.ts` — added module features + role module access seed
- `apps/api/src/modules/module-management.module.ts`
- `apps/api/src/modules/module-management.service.ts`
- `apps/api/src/modules/module-management.controller.ts`
- `apps/api/src/modules/dto/create-module.dto.ts`
- `apps/api/src/modules/dto/update-module.dto.ts`
- `apps/api/src/modules/dto/create-feature.dto.ts`
- `apps/api/src/modules/dto/toggle-module.dto.ts`
- `apps/api/src/modules/dto/toggle-feature.dto.ts`
- `apps/api/src/modules/dto/query-modules.dto.ts`
- `apps/api/src/modules/__tests__/module-management.service.spec.ts`
- `apps/api/src/app.module.ts` — registered ModuleManagementModule

### Frontend (6 files)
- `apps/web/src/lib/api.ts` — added moduleManagementApi + interfaces
- `apps/web/src/app/dashboard/module-management/page.tsx`
- `apps/web/src/app/dashboard/module-management/new/page.tsx`
- `apps/web/src/app/dashboard/module-management/[id]/page.tsx`
- `apps/web/src/app/dashboard/module-management/[id]/edit/page.tsx`
- `apps/web/src/app/dashboard/module-management/tenant/page.tsx`
- `apps/web/src/app/dashboard/layout.tsx` — added Module Management sidebar
