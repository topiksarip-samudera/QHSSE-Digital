# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Audit Program

```text
audit_program.view
audit_program.create
audit_program.update
audit_program.delete
audit_program.submit
audit_program.approve
audit_program.reject
audit_program.export
```

### Audit

```text
audit.view
audit.view_all
audit.create
audit.update
audit.delete
audit.submit
audit.start
audit.complete_checklist
audit.submit_report
audit.approve_report
audit.close
audit.export
```

### Inspection

```text
inspection.view
inspection.view_all
inspection.create
inspection.update
inspection.delete
inspection.start
inspection.submit
inspection.review
inspection.close
inspection.export
```

### Finding

```text
finding.view
finding.view_all
finding.create
finding.update
finding.delete
finding.assign_action
finding.verify
finding.close
finding.export
```

### Settings

```text
audit_inspection.manage_settings
```

## Scope

```text
Global
Company
Site
Department
Own
Assigned
Auditor
Auditee
Inspector
Finding PIC
```

## Security Rules

- Semua query wajib filter company_id.
- User Site A tidak boleh melihat audit/inspection Site B kecuali punya scope company/global.
- Auditor hanya bisa mengakses audit yang ditugaskan jika scope assigned.
- Inspector hanya bisa mengakses inspection yang ditugaskan jika scope assigned.
- Finding PIC hanya bisa update progress/action sesuai permission.
- Contractor hanya bisa melihat audit/inspection yang terkait dirinya jika diberikan akses.
- Evidence download harus permission-guarded.
- Export report harus dicatat audit log.
- Critical finding close harus butuh verification permission.
