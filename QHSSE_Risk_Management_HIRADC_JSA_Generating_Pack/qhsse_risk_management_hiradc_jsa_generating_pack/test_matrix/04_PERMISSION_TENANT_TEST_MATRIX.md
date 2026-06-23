# Permission & Tenant Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| PT-001 | User without risk.view opens risk list | 403/hidden |
| PT-002 | User without risk.create creates risk | 403 |
| PT-003 | User without risk.approve approves risk | 403 |
| PT-004 | User with site scope A sees site B risk | 403/404 |
| PT-005 | Company A user accesses Company B risk by ID | 403/404 |
| PT-006 | Company A user downloads Company B export | Denied |
| PT-007 | User without risk_matrix.manage changes matrix | 403 |
| PT-008 | Export risk register | Audit log created |
| PT-009 | Change risk rating | Audit log created |
| PT-010 | Super Admin override | Audit log created |
