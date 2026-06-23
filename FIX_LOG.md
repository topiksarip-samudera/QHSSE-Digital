# FIX_LOG — QHSSE Core Platform Stabilization

## P0 Fixes

### P0-01: Tenant Guard sets `request.user.companyId`
**File:** `apps/api/src/common/guards/tenant.guard.ts:49-51`
**Fix:** Added `request.user.companyId = companyId` after extracting from header/query.
**Verification:** All 201+ controllers reading `req.user.companyId` now get correct value.
**Tests:** 470/470 PASS

### P0-02: Workflow service tenant isolation
**Files:** `apps/api/src/workflows/workflow.service.ts`, `workflow.controller.ts`, `__tests__/workflow.service.spec.ts`
**Fix:**
- `findOneWorkflow(id)` → `findOneWorkflow(id, companyId?)` with `if (companyId && workflow.companyId && workflow.companyId !== companyId) throw ForbiddenException`
- `findOneInstance(id)` → `findOneInstance(id, companyId?)` with same check
- All instance action methods (`submitInstance`, `approveStep`, `rejectStep`, `requestRevision`, `closeInstance`) now accept `companyId: string` parameter
- `getInstanceHistory` now uses `findOneInstance` for ownership check
- Controller updated to pass `user.companyId` to all methods
- 9 test calls updated to match new signatures
**Verification:** 470/470 PASS

### P1-01: Users service `findOne` adds company membership check
**File:** `apps/api/src/users/users.service.ts`

## Pending P1 Fixes (for next QA step)
- P1-02: Notification templates
- P1-03: Global Search `deleteSaved`
- P1-04: Dashboard personal queries
