# Controlled Copy & Obsolete Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| CC-001 | Issue controlled copy | Copy number created |
| CC-002 | Revoke controlled copy | Status revoked |
| CC-003 | Obsolete document | Status obsolete |
| CC-004 | Search obsolete document | Not shown in active/latest by default |
| CC-005 | Link obsolete doc to new permit | Blocked/warning |
| CC-006 | Archive document | Archived and restorable |
| CC-007 | Restore archived document | Restored with audit log |
| CC-008 | Legal hold document | Cannot purge |
