# Incident Tenant Isolation Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| INC-TI-001 | Company A list incidents | Only Company A incidents |
| INC-TI-002 | Company A direct API Company B incident | 403/404 |
| INC-TI-003 | Company A dashboard | Count only Company A |
| INC-TI-004 | Company A export incidents | Only Company A |
| INC-TI-005 | Company A download Company B evidence | 403/404 |
| INC-TI-006 | Super Admin cross-company access | Allowed with audit log |
