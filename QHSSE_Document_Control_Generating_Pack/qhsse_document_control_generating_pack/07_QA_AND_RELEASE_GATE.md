# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Document Register
Document Metadata
File Upload/Download Security
Review Workflow
Approval Workflow
Revision Control
Published Immutable Rule
Distribution
Acknowledgement
Controlled Copy
Obsolete / Archive
Search
QR Verification
Dashboard Calculation
Report Export
Audit Log
Notification
Regression Test
```

## Release Gate

Document Control hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
File security PASS
Revision control PASS
Published immutable PASS
Workflow PASS
Distribution PASS
Acknowledgement PASS
Controlled copy PASS
Obsolete/archive PASS
QR verification PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
DOCUMENT CONTROL STABILIZED: GO
```

Jika gagal:

```text
DOCUMENT CONTROL STABILIZED: NO-GO
```
