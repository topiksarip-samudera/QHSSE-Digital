# Incident Permission Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| INC-PERM-001 | No view permission open list | 403/hidden UI |
| INC-PERM-002 | No create permission create incident | 403 |
| INC-PERM-003 | No update permission edit incident | 403 |
| INC-PERM-004 | No submit permission submit | 403 |
| INC-PERM-005 | No review permission review | 403 |
| INC-PERM-006 | No investigate permission edit investigation | 403 |
| INC-PERM-007 | No RCA permission submit RCA | 403 |
| INC-PERM-008 | No export permission export | 403 |
| INC-PERM-009 | Contractor view internal note | Hidden/403 |
