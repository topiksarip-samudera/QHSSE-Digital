# SELESAI — CORE 08: Workflow Engine Basic

**Tanggal:** 2026-06-22  
**Status:** ✅ COMPLETE  
**Tests:** 44 tests, 0 failures  
**Build:** Backend ✅ | Frontend ✅

---

## Ringkasan

Core 08 membangun **Workflow Engine Basic** — sistem untuk mendesain approval workflow (template), menjalankan instance workflow untuk record apapun, dan memproses approval/rejection/revision secara berurutan step-by-step dengan SLA tracking dan escalation.

---

## Database / Schema

### Models (6 — semua sudah ada sebelumnya)

| Model | Tabel | Keterangan |
|-------|-------|------------|
| `Workflow` | `workflows` | Template workflow — name, moduleCode, isActive, companyId |
| `WorkflowStep` | `workflow_steps` | Steps dalam workflow — stepOrder, assigneeType, assigneeValue, actionType, SLA |
| `WorkflowApprover` | `workflow_approvers` | Approver per step — userId mapping |
| `WorkflowInstance` | `workflow_instances` | Running instance dari workflow — recordType, recordId, status, currentStep |
| `WorkflowInstanceStep` | `workflow_instance_steps` | Instance steps tracking — status per step, completedBy, comment |
| `WorkflowHistory` | `workflow_histories` | Audit trail — action, comment, performedBy, timestamp |

### Schema Structure

```prisma
model Workflow {
  id, companyId, moduleCode, name, description, isActive, createdBy
  steps[], instances[]
  @@map("workflows")
}

model WorkflowStep {
  id, workflowId, name, stepOrder, assigneeType, assigneeValue
  actionType, isRequired, slaHours, escalateAfterHr
  approvers[]
  @@map("workflow_steps")
}

model WorkflowApprover {
  id, stepId, userId
  @@unique([stepId, userId])
  @@map("workflow_approvers")
}

model WorkflowInstance {
  id, workflowId, companyId, recordType, recordId
  submitterId, currentStep, status, startedAt, completedAt
  steps[], histories[]
  @@map("workflow_instances")
}

model WorkflowInstanceStep {
  id, instanceId, stepId, stepOrder, assigneeType, assigneeValue
  status, assignedTo, completedBy, completedAt, comment, dueAt
  @@map("workflow_instance_steps")
}

model WorkflowHistory {
  id, instanceId, stepOrder, action, comment, performedBy, performedAt
  @@map("workflow_histories")
}
```

---

## Backend API

### Service: `WorkflowService` (18 methods)

| Method | Fungsi |
|--------|--------|
| `createWorkflow` | Buat workflow template baru (duplicate name check) |
| `findAllWorkflows` | List workflow templates — filter by search, moduleCode, status, pagination |
| `findOneWorkflow` | Get workflow detail dengan steps, approvers, instance count |
| `updateWorkflow` | Update workflow template |
| `deleteWorkflow` | Soft delete workflow (preserves running instances) |
| `addStep` | Tambah step ke workflow (duplicate stepOrder check) |
| `updateStep` | Update step properties |
| `removeStep` | Hapus step + reorder remaining steps |
| `addApprover` | Tambah approver ke step (upsert) |
| `removeApprover` | Hapus approver dari step |
| `createInstance` | Buat instance dari workflow template + clone steps |
| `findAllInstances` | List instances — filter by status, pagination |
| `findOneInstance` | Get instance detail dengan workflow, steps, histories |
| `submitInstance` | Submit draft → submitted, activate step 1 |
| `approveStep` | Approve current step, advance to next (or complete if last) |
| `rejectStep` | Reject current step (comment required) |
| `requestRevision` | Request revision → back to draft (comment required) |
| `closeInstance` | Close approved/rejected instance |
| `getInstanceHistory` | Get audit trail ordered by timestamp |
| `checkSlaBreaches` | Find steps past their due date |

### Controller: `WorkflowController` (18 endpoints)

| Method | Endpoint | Permission |
|--------|----------|------------|
| **Workflow Templates** | | |
| GET | `/api/v1/workflows` | `workflow-engine-basic.view` |
| GET | `/api/v1/workflows/:id` | `workflow-engine-basic.view` |
| POST | `/api/v1/workflows` | `workflow-engine-basic.create` |
| PATCH | `/api/v1/workflows/:id` | `workflow-engine-basic.update` |
| DELETE | `/api/v1/workflows/:id` | `workflow-engine-basic.delete` |
| **Steps** | | |
| POST | `/api/v1/workflows/:workflowId/steps` | `workflow-engine-basic.update` |
| PATCH | `/api/v1/workflows/steps/:stepId` | `workflow-engine-basic.update` |
| DELETE | `/api/v1/workflows/steps/:stepId` | `workflow-engine-basic.update` |
| **Approvers** | | |
| POST | `/api/v1/workflows/steps/:stepId/approvers` | `workflow-engine-basic.update` |
| DELETE | `/api/v1/workflows/steps/:stepId/approvers/:userId` | `workflow-engine-basic.update` |
| **Instances** | | |
| POST | `/api/v1/workflows/instances` | `workflow-engine-basic.create` |
| GET | `/api/v1/workflows/instances/list` | `workflow-engine-basic.view` |
| GET | `/api/v1/workflows/instances/:id` | `workflow-engine-basic.view` |
| **Actions** | | |
| POST | `/api/v1/workflows/instances/:id/submit` | `workflow-engine-basic.submit` |
| POST | `/api/v1/workflows/instances/:id/approve` | `workflow-engine-basic.approve` |
| POST | `/api/v1/workflows/instances/:id/reject` | `workflow-engine-basic.reject` |
| POST | `/api/v1/workflows/instances/:id/request-revision` | `workflow-engine-basic.approve` |
| POST | `/api/v1/workflows/instances/:id/close` | `workflow-engine-basic.close` |
| **History & SLA** | | |
| GET | `/api/v1/workflows/instances/:id/history` | `workflow-engine-basic.view` |
| GET | `/api/v1/workflows/sla/breaches` | `workflow-engine-basic.view` |

### Module: `WorkflowModule`

Terdaftar di `AppModule` sebagai import.

---

## Frontend

### Pages (7)

| Path | File | Fungsi |
|------|------|--------|
| `/dashboard/workflow` | `page.tsx` | Grid view workflow templates — card layout dengan steps preview, filter by status/module |
| `/dashboard/workflow/new` | `new/page.tsx` | Form buat workflow template baru — module selector, name, description |
| `/dashboard/workflow/[id]` | `[id]/page.tsx` | Detail workflow — stats, visual step pipeline, add/remove steps, toggle active |
| `/dashboard/workflow/[id]/edit` | `[id]/edit/page.tsx` | Edit workflow template — name, description, isActive |
| `/dashboard/workflow/instances` | `instances/page.tsx` | Table view semua workflow instances — filter by status, pagination |
| `/dashboard/workflow/instances/[id]` | `instances/[id]/page.tsx` | Instance detail — steps progress, action panel (submit/approve/reject/revision/close), history |
| `/dashboard/workflow/queue` | `queue/page.tsx` | Approval queue — pending review items + SLA breaches tab, quick approve |

### API Functions

`workflowApi` object dengan 22 methods di `apps/web/src/lib/api.ts`.

### TypeScript Interfaces

- `WorkflowData` — workflow template dengan steps
- `WorkflowStepData` — step dengan approvers
- `WorkflowInstanceData` — instance dengan workflow, steps, histories
- `WorkflowInstanceStepData` — instance step tracking
- `WorkflowHistoryData` — history entry
- `WorkflowQuery` — query params

### Sidebar Navigation

Ditambahkan di `layout.tsx`:
```
🔄 Workflow Engine
    ├── Workflow Templates → /dashboard/workflow
    ├── Instances → /dashboard/workflow/instances
    └── Approval Queue → /dashboard/workflow/queue
```

---

## Business Rules Implemented

- ✅ Sequential step execution — steps must be approved in order
- ✅ Draft → Submitted → In Review → Approved/Rejected lifecycle
- ✅ Only authorized approvers can act (by role, user, or direct approver assignment)
- ✅ Duplicate workflow name check within company + module
- ✅ Duplicate stepOrder check within workflow
- ✅ Only one active instance per record (prevents duplicate workflows)
- ✅ Inactive workflow cannot create new instances
- ✅ Soft delete workflow (preserves running instances)
- ✅ Step reorder on removal
- ✅ Revision sends instance back to draft
- ✅ Reject requires comment
- ✅ Instance auto-completes on last step approval
- ✅ SLA breach detection (due date tracking)
- ✅ Escalation hours per step
- ✅ Workflow history audit trail

---

## DTOs (6)

1. `CreateWorkflowDto` — name, moduleCode, description, isActive, companyId
2. `UpdateWorkflowDto` — name, description, isActive
3. `CreateWorkflowStepDto` — name, stepOrder, assigneeType, assigneeValue, actionType, isRequired, slaHours, escalateAfterHr
4. `UpdateWorkflowStepDto` — name, stepOrder, assigneeType, assigneeValue, actionType, isRequired, slaHours
5. `CreateWorkflowInstanceDto` — workflowId, recordType, recordId, companyId
6. `WorkflowActionDto` — comment
7. `WorkflowQueryDto` — search, status, moduleCode, companyId, page, limit

---

## Testing

**44 tests, 0 failures** — `apps/api/src/workflows/__tests__/workflow.service.spec.ts`

| Group | Tests | Status |
|-------|-------|--------|
| createWorkflow | 2 | ✅ |
| findAllWorkflows | 5 | ✅ |
| findOneWorkflow | 2 | ✅ |
| updateWorkflow | 1 | ✅ |
| deleteWorkflow | 1 | ✅ |
| addStep | 2 | ✅ |
| updateStep | 2 | ✅ |
| removeStep | 1 | ✅ |
| addApprover | 2 | ✅ |
| removeApprover | 1 | ✅ |
| createInstance | 3 | ✅ |
| findAllInstances | 2 | ✅ |
| findOneInstance | 2 | ✅ |
| submitInstance | 2 | ✅ |
| approveStep | 3 | ✅ |
| rejectStep | 2 | ✅ |
| requestRevision | 2 | ✅ |
| closeInstance | 2 | ✅ |
| getInstanceHistory | 2 | ✅ |
| checkSlaBreaches | 2 | ✅ |
| isStepApprover | 2 | ✅ |

---

## File Structure

```
apps/api/src/workflows/
├── workflow.module.ts
├── workflow.controller.ts
├── workflow.service.ts
├── dto/
│   ├── create-workflow.dto.ts
│   ├── update-workflow.dto.ts
│   ├── create-workflow-step.dto.ts
│   └── workflow-instance.dto.ts
└── __tests__/
    └── workflow.service.spec.ts

apps/web/src/app/dashboard/workflow/
├── page.tsx                    (workflow templates grid)
├── new/page.tsx                (create workflow form)
├── [id]/page.tsx               (workflow detail + steps builder)
├── [id]/edit/page.tsx          (edit workflow)
├── instances/page.tsx          (instances list)
├── instances/[id]/page.tsx     (instance detail + actions)
└── queue/page.tsx              (approval queue + SLA breaches)
```

---

## Cumulative Progress — Phase 1

| Core | Status | Tests |
|------|--------|-------|
| 01 Multi-Company | ✅ | 20 |
| 02 Organization | ✅ | 47 |
| 03 User Management | ✅ | 37 |
| 04 Authentication | ✅ | 30 |
| 05 Role & Permission | ✅ | 26 |
| 06 Master Data | ✅ | 31 |
| 07 Module Management | ✅ | 39 |
| **08 Workflow Engine** | **✅** | **44** |
| 09 Risk Management | 🔲 | — |
| 10 Incident Management | 🔲 | — |
| 11 Audit & Inspection | 🔲 | — |
| 12 Action Tracking | 🔲 | — |
| 13 Document Control | 🔲 | — |
| **TOTAL** | **8/13** | **274** |
