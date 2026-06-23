# 04 — INCIDENT API CONTRACT GUIDE

## Standard Response

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Readable message",
    "details": []
  }
}
```

## Endpoint Group

### Core Incident

```text
GET    /api/v1/incidents
POST   /api/v1/incidents
GET    /api/v1/incidents/:id
PATCH  /api/v1/incidents/:id
DELETE /api/v1/incidents/:id
POST   /api/v1/incidents/:id/submit
```

### Classification

```text
GET   /api/v1/incidents/:id/classification
PATCH /api/v1/incidents/:id/classification
POST  /api/v1/incidents/:id/classification/review
```

### People/Injury/Witness/Asset

```text
GET    /api/v1/incidents/:id/people
POST   /api/v1/incidents/:id/people
PATCH  /api/v1/incidents/:id/people/:personId
DELETE /api/v1/incidents/:id/people/:personId

GET    /api/v1/incidents/:id/injuries
POST   /api/v1/incidents/:id/injuries

GET    /api/v1/incidents/:id/witnesses
POST   /api/v1/incidents/:id/witnesses

GET    /api/v1/incidents/:id/assets
POST   /api/v1/incidents/:id/assets
```

### Workflow/Review

```text
POST /api/v1/incidents/:id/review
POST /api/v1/incidents/:id/reject
POST /api/v1/incidents/:id/request-revision
POST /api/v1/incidents/:id/assign-investigator
GET  /api/v1/incidents/:id/workflow
GET  /api/v1/incidents/review-queue
```

### Investigation

```text
GET   /api/v1/incidents/:id/investigation
POST  /api/v1/incidents/:id/investigation/start
PATCH /api/v1/incidents/:id/investigation
POST  /api/v1/incidents/:id/investigation/team
POST  /api/v1/incidents/:id/investigation/chronology
POST  /api/v1/incidents/:id/investigation/interviews
POST  /api/v1/incidents/:id/investigation/findings
POST  /api/v1/incidents/:id/investigation/submit
```

### RCA

```text
GET   /api/v1/incidents/:id/rca
PATCH /api/v1/incidents/:id/rca
POST  /api/v1/incidents/:id/rca/5why
POST  /api/v1/incidents/:id/rca/fishbone
POST  /api/v1/incidents/:id/rca/submit
POST  /api/v1/incidents/:id/rca/review
```

### CAPA

```text
GET  /api/v1/incidents/:id/capa
POST /api/v1/incidents/:id/capa
POST /api/v1/incidents/:id/capa/:actionId/submit-verification
POST /api/v1/incidents/:id/capa/:actionId/verify
POST /api/v1/incidents/:id/capa/:actionId/reject
POST /api/v1/incidents/:id/capa/effectiveness-review
```

### Evidence/Comment/Timeline

```text
GET    /api/v1/incidents/:id/attachments
POST   /api/v1/incidents/:id/attachments
DELETE /api/v1/incidents/:id/attachments/:attachmentId

GET  /api/v1/incidents/:id/comments
POST /api/v1/incidents/:id/comments

GET /api/v1/incidents/:id/timeline
GET /api/v1/incidents/:id/audit-logs
```

### Lessons Learned

```text
GET  /api/v1/incidents/:id/lessons-learned
POST /api/v1/incidents/:id/lessons-learned
POST /api/v1/incidents/:id/lessons-learned/publish
POST /api/v1/incidents/:id/lessons-learned/acknowledge
```

### Dashboard / Reports

```text
GET /api/v1/incidents/dashboard
GET /api/v1/incidents/kpi
GET /api/v1/incidents/trends
GET /api/v1/incidents/export
GET /api/v1/incidents/:id/report
GET /api/v1/incidents/:id/investigation-report
GET /api/v1/incidents/:id/lessons-learned-report
```

## Mandatory Guards

```text
AuthGuard
TenantGuard
PermissionGuard
ModuleEnabledGuard
WorkflowGuard if relevant
```
