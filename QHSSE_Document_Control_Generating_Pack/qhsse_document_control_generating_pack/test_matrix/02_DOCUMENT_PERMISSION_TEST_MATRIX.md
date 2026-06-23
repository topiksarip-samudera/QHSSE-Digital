# Document Permission Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| PERM-001 | User without document.view opens register | 403 / hidden UI |
| PERM-002 | User without document.create creates document | 403 |
| PERM-003 | User without document.review reviews | 403 |
| PERM-004 | User without document.approve approves | 403 |
| PERM-005 | User without document.publish publishes | 403 |
| PERM-006 | User without document.download downloads | 403 |
| PERM-007 | Site A user opens Site B restricted document | 403/404 |
| PERM-008 | Non-recipient opens distributed restricted doc | 403/404 |
| PERM-009 | QR restricted doc without auth | Denied or limited summary |
