# Workflow & Action Integration Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| WF-001 | Submit risk | Workflow instance created |
| WF-002 | Reject risk without comment | Validation error |
| WF-003 | Approve high risk | Correct approver required |
| WF-004 | Extreme risk approval | Additional approval required |
| WF-005 | High residual risk | Action required |
| WF-006 | Create risk action | Action Tracking linked |
| WF-007 | Close action | Risk action status updated |
| WF-008 | Review due | Notification created |
| WF-009 | Risk revision | Old revision preserved |
| WF-010 | Workflow history | Complete timeline |
