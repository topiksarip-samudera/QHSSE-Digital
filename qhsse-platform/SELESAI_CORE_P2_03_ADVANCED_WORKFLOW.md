# SELESAI CORE: Advanced Workflow Engine (Phase 2 — Core 03)

**Status:** COMPLETE (2026-06-22)
**Tests:** 402 cumulative across 19 test files

## Features

### Database (6 new tables)
- `workflow_conditions` — Conditional rules per step (field, operator, value, logical group)
- `workflow_condition_groups` — Group conditions with AND/OR logic
- `workflow_escalations` — Auto-escalate when SLA missed (escalate to role/user, max escalations)
- `workflow_delegations` — Temporary delegation with start/end dates and expiry
- `workflow_sla_rules` — SLA per workflow/step with priority and warning thresholds
- `workflow_parallel_steps` — Parallel step groups configuration

### Backend APIs (added to existing workflow controller)
- ✅ `POST /workflows/:id/simulate` — Simulate workflow with dynamic condition evaluation
- ✅ `POST /workflows/:wid/steps/:sid/conditions` + GET + DELETE
- ✅ `POST /workflows/escalations` + GET + DELETE
- ✅ `POST /workflows/delegations` + GET + DELETE
- ✅ `POST /workflows/sla-rules` + GET + DELETE

### Simulation Engine
- Dynamic approver resolution based on conditions
- Field value resolution with dot-notation paths
- Conditional operators: eq, neq, gt, lt, gte, lte, contains, in, not_in

### Frontend
- Advanced Workflow page with 4 tabs: Simulation, Delegations, Escalations, SLA Rules
- Run simulation with workflow ID input
- View active delegations, escalation rules, SLA rules

### Permissions
- `advanced-workflow-engine.*` (view, create, update, delete, export)
- Seeded in seed.ts

**Build:** API ✅ | Web ✅ (51 pages) | **Tests:** 402/402 PASS
