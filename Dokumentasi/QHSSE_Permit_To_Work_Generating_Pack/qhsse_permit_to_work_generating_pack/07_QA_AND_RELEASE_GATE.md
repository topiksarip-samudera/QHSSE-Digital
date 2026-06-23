# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Permit Type Configuration
Permit Request
Workflow Approval
JSA / Risk Integration
Worker Competency Validation
Contractor Validation
Equipment Validation
Gas Test
LOTO / Isolation
SIMOPS / Clash Detection
Activation / Extension / Suspension
Close-Out
QR Verification
Active Permit Board
Attachment Security
Notification
Audit Log
Dashboard Calculation
Report Export
Regression Test
```

## Release Gate

Permit to Work hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
Permit workflow PASS
JSA/Risk integration PASS
Competency validation PASS
Gas test validation PASS
LOTO validation PASS
SIMOPS clash detection PASS
QR verification PASS
Active permit board PASS
Attachment security PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
PERMIT TO WORK STABILIZED: GO
```

Jika gagal:

```text
PERMIT TO WORK STABILIZED: NO-GO
```
