# 07 — INCIDENT QA & RELEASE GATE

## QA Area

```text
Tenant isolation
Permission backend
Module ON/OFF
Incident report CRUD
Classification
People/injury/witness/asset
Workflow/review
Investigation
RCA
CAPA integration
Attachment security
Notification
Lessons learned
Dashboard calculation
Report export
Audit log
```

## P0 Bug

```text
Cross-company incident data leak
Permission backend bypass
File evidence public without auth
High severity can close without mandatory RCA/CAPA when configured
Data corruption
```

## P1 Bug

```text
Workflow wrong approver
CAPA not linked to action core
Audit log missing for critical action
High severity notification not sent
Dashboard shows wrong company data
Report export includes unauthorized data
```

## Release Gate

Incident Management hanya boleh lanjut ke Risk Management jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Workflow PASS
RCA PASS
CAPA PASS
Attachment security PASS
Notification PASS
Audit log PASS
Dashboard/report PASS
```

## Final Status

Jika lulus:

```text
INCIDENT MANAGEMENT STABILIZED: GO
```

Jika gagal:

```text
INCIDENT MANAGEMENT STABILIZED: NO-GO
Blocking issues:
- ...
```
