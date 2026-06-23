# Workflow Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| WF-001 | Submit draft | Status submitted |
| WF-002 | Approver by role receives task | Notification created |
| WF-003 | Approve step 1 | Moves to step 2 |
| WF-004 | Reject without comment | Validation error |
| WF-005 | Reject with comment | Status rejected |
| WF-006 | Request revision | Back to creator |
| WF-007 | Non-approver approve | 403 |
| WF-008 | Old instance after template change | Still works |
| WF-009 | SLA overdue | Escalation/reminder if available |
| WF-010 | Workflow history | Complete timeline |
