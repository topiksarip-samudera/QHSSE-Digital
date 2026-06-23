# 02 — AUDIT & INSPECTION GENERATING RULES

## Aturan Utama

1. Jangan hardcode checklist.
2. Gunakan checklist builder core untuk template dan execution.
3. Simpan versi checklist saat execution.
4. Audit dan inspection boleh berbagi finding engine.
5. Finding harus bisa membuat action.
6. Semua critical change harus masuk audit log.
7. Semua API wajib tenant-filter dan permission-guarded.
8. Semua file evidence harus memakai attachment core.
9. Workflow approval tidak boleh hardcoded.
10. Dashboard angka harus dihitung dari data nyata.

## Pattern Setiap Sequence

Setiap sequence harus menghasilkan:

```text
Database update
Backend API
Frontend UI
Permission
Audit log
Notification jika relevan
Test minimal
Acceptance criteria
```

## Standard Status

Audit status:

```text
draft
program_approved
planned
scheduled
in_progress
checklist_completed
finding_review
report_draft
report_approval
action_assigned
verification
closed
cancelled
```

Inspection status:

```text
scheduled
in_progress
submitted
reviewed
action_assigned
verification
closed
cancelled
```

Finding status:

```text
open
in_review
action_assigned
in_progress
pending_verification
verified
closed
rejected
cancelled
```

## Permission Standard

```text
audit_inspection.view
audit_inspection.view_all
audit_inspection.create
audit_inspection.update
audit_inspection.delete
audit_inspection.submit
audit_inspection.approve
audit_inspection.reject
audit_inspection.close
audit_inspection.export
audit_inspection.manage_settings

audit_program.view
audit_program.create
audit_program.update
audit_program.approve

inspection.view
inspection.create
inspection.update
inspection.submit
inspection.review
inspection.close

finding.view
finding.create
finding.update
finding.assign_action
finding.verify
finding.close
```

## Audit Log Wajib

Catat:

```text
audit.created
audit.updated
audit.submitted
audit.approved
audit.closed
inspection.created
inspection.submitted
inspection.reviewed
inspection.closed
finding.created
finding.updated
finding.action_assigned
finding.verified
finding.closed
report.exported
evidence.uploaded
score.changed
settings.changed
```

## Webhook Events

```text
audit.program_created
audit.scheduled
audit.started
audit.finding_created
audit.report_approved
audit.closed
inspection.scheduled
inspection.started
inspection.failed
inspection.finding_created
inspection.closed
finding.created
finding.high_severity
finding.overdue
finding.closed
```
