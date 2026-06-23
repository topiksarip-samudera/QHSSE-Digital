# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Audit Program

```text
GET    /audit-programs
POST   /audit-programs
GET    /audit-programs/:id
PATCH  /audit-programs/:id
DELETE /audit-programs/:id
POST   /audit-programs/:id/submit
POST   /audit-programs/:id/approve
POST   /audit-programs/:id/reject
```

## Audit

```text
GET    /audits
POST   /audits
GET    /audits/:id
PATCH  /audits/:id
DELETE /audits/:id
POST   /audits/:id/submit
POST   /audits/:id/start
POST   /audits/:id/complete-checklist
POST   /audits/:id/submit-report
POST   /audits/:id/approve-report
POST   /audits/:id/close
GET    /audits/:id/report
GET    /audits/:id/export
```

## Inspection

```text
GET    /inspections
POST   /inspections
GET    /inspections/:id
PATCH  /inspections/:id
DELETE /inspections/:id
POST   /inspections/:id/start
POST   /inspections/:id/submit
POST   /inspections/:id/review
POST   /inspections/:id/close
GET    /inspections/:id/report
GET    /inspections/:id/export
```

## Checklist Execution

```text
POST   /checklist-executions
GET    /checklist-executions/:id
PATCH  /checklist-executions/:id/items/:itemId
POST   /checklist-executions/:id/submit
POST   /checklist-executions/:id/create-findings
GET    /checklist-executions/:id/results
```

## Finding

```text
GET    /findings
POST   /findings
GET    /findings/:id
PATCH  /findings/:id
DELETE /findings/:id
POST   /findings/:id/assign-action
POST   /findings/:id/submit-verification
POST   /findings/:id/verify
POST   /findings/:id/reject-verification
POST   /findings/:id/close
GET    /findings/:id/actions
GET    /findings/:id/attachments
GET    /findings/:id/audit-logs
```

## Dashboard

```text
GET /audit-inspection/dashboard
GET /audit-inspection/kpi
GET /audit-inspection/finding-trend
GET /audit-inspection/score-trend
GET /audit-inspection/overdue-actions
```

## Settings

```text
GET   /audit-inspection/settings
PATCH /audit-inspection/settings
GET   /audit-inspection/master-data
```

## Standard Query

```text
?page=1&pageSize=20&search=&siteId=&departmentId=&status=&dateFrom=&dateTo=&sort=createdAt:desc
```
