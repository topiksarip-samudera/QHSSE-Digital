# 05 — UI/UX GUIDELINES

## Prinsip UI

- Clean enterprise dashboard.
- Sidebar modular sesuai module ON/OFF.
- Topbar dengan company/site switcher.
- Permission-aware buttons.
- Mobile responsive.
- Table kuat: search, filter, sort, pagination, column visibility.
- Detail page berbasis tabs.

## Layout Dasar

```text
Login Layout
Dashboard Layout
Admin Layout
Record Detail Layout
Form Builder Layout
Checklist Builder Layout
Workflow Builder Layout
Mobile/PWA Layout
```

## Sidebar Rekomendasi

```text
Dashboard
Risk Management
Incident Management
Audit & Inspection
Permit to Work
Action Tracking
Document Control
Training & Competency
Legal Compliance
Environment
Quality
Security
Contractor Management
Reports
AI Assistant
Core Platform
Settings
```

## Record Detail Tabs

```text
Overview
Details
Workflow
Actions
Attachments
Comments
Audit Trail
History
```

## Komponen Wajib

```text
DataTable
FilterBar
StatusBadge
RiskBadge
PriorityBadge
UserPicker
SitePicker
DepartmentPicker
AttachmentUploader
CommentThread
WorkflowTimeline
AuditTimeline
ConfirmDialog
EmptyState
LoadingSkeleton
ErrorState
PermissionGate
```

## Warna Status

Jangan hardcode di banyak tempat. Simpan mapping di config/master data.

Contoh:

```text
Draft = gray
Submitted = blue
Approved = green
Rejected = red
Overdue = red
Closed = neutral
```
