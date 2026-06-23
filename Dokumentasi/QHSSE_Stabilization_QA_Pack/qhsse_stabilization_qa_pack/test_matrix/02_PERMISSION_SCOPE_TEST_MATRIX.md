# Permission & Scope Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| PS-001 | No view permission opens list | 403 / hidden UI |
| PS-002 | No create permission submits create API | 403 |
| PS-003 | No update permission submits patch API | 403 |
| PS-004 | No delete permission archives record | 403 |
| PS-005 | No approve permission approves workflow | 403 |
| PS-006 | Site A scope views Site B record | 403/404 |
| PS-007 | Own scope views other user's record | 403/404 |
| PS-008 | Assigned scope views unassigned record | 403/404 |
| PS-009 | Contractor views internal note | Hidden/403 |
| PS-010 | Permission change | Audit log created |
