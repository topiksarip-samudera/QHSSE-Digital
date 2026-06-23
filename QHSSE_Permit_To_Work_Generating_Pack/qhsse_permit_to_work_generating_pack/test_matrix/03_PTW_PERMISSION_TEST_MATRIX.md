# PTW Permission Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| PERM-001 | User without permit.view opens list | 403 / hidden UI |
| PERM-002 | User without permit.create creates permit | 403 |
| PERM-003 | User without permit.approve approves | 403 |
| PERM-004 | User without permit.activate activates | 403 |
| PERM-005 | User without permit.suspend suspends | 403 |
| PERM-006 | User without permit.loto.remove removes LOTO | 403 |
| PERM-007 | Contractor views unrelated permit | 403/404 |
| PERM-008 | Site A user views Site B permit | 403/404 |
| PERM-009 | Security viewer scans QR | Limited summary only |
