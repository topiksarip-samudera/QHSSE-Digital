# QA & RELEASE GATE

## QA Area

```text
Tenant isolation
Permission backend
Risk matrix calculation
HIRADC calculation
JSA calculation
Workflow
Action integration
Attachment security
Audit log
Notification
Dashboard calculation
Export PDF/Excel
Cross-module links
```

## P0 Critical

```text
Cross-company data leak
Permission backend bypass
Wrong risk calculation
Risk matrix change corrupts old assessments
File access public
Approved risk can be edited without revision control
```

## Release Gate

Risk Management boleh GO jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Risk calculation PASS
HIRADC calculation PASS
JSA calculation PASS
Workflow PASS
Audit log PASS
Dashboard PASS
Export PASS
Regression PASS
```

Final status:

```text
RISK MANAGEMENT STABILIZED: GO
```
