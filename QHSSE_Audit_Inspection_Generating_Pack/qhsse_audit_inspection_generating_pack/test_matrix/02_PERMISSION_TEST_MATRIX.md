# Permission Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| PERM-001 | User without audit.view opens audit list | 403 / hidden UI |
| PERM-002 | User without audit.create creates audit | 403 |
| PERM-003 | User without inspection.review reviews inspection | 403 |
| PERM-004 | Non auditor accesses assigned-only audit | 403/404 |
| PERM-005 | Site A user opens Site B inspection | 403/404 |
| PERM-006 | User without finding.verify verifies finding | 403 |
| PERM-007 | User without export exports report | 403 |
| PERM-008 | Permission change | Audit log created |
