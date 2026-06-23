# API CONTRACT GUIDE

Gunakan prefix `/api/v1`.

## Risk Register API

```text
GET    /api/v1/risks
POST   /api/v1/risks
GET    /api/v1/risks/:id
PATCH  /api/v1/risks/:id
DELETE /api/v1/risks/:id
POST   /api/v1/risks/:id/submit
POST   /api/v1/risks/:id/approve
POST   /api/v1/risks/:id/reject
POST   /api/v1/risks/:id/archive
POST   /api/v1/risks/:id/review
POST   /api/v1/risks/:id/recalculate
GET    /api/v1/risks/:id/controls
POST   /api/v1/risks/:id/controls
GET    /api/v1/risks/:id/actions
POST   /api/v1/risks/:id/actions
GET    /api/v1/risks/:id/links
POST   /api/v1/risks/:id/links
GET    /api/v1/risks/dashboard
GET    /api/v1/risks/export
```

## Risk Matrix API

```text
GET    /api/v1/risk-matrix
POST   /api/v1/risk-matrix
PATCH  /api/v1/risk-matrix/:id
POST   /api/v1/risk-matrix/:id/publish
POST   /api/v1/risk-matrix/calculate
```

## HIRADC API

```text
GET    /api/v1/hiradc
POST   /api/v1/hiradc
GET    /api/v1/hiradc/:id
PATCH  /api/v1/hiradc/:id
DELETE /api/v1/hiradc/:id
POST   /api/v1/hiradc/:id/submit
POST   /api/v1/hiradc/:id/approve
POST   /api/v1/hiradc/:id/reject
POST   /api/v1/hiradc/:id/recalculate
GET    /api/v1/hiradc/:id/activities
POST   /api/v1/hiradc/:id/activities
GET    /api/v1/hiradc/:id/export
```

## JSA API

```text
GET    /api/v1/jsa
POST   /api/v1/jsa
GET    /api/v1/jsa/:id
PATCH  /api/v1/jsa/:id
DELETE /api/v1/jsa/:id
POST   /api/v1/jsa/:id/submit
POST   /api/v1/jsa/:id/approve
POST   /api/v1/jsa/:id/reject
POST   /api/v1/jsa/:id/recalculate
GET    /api/v1/jsa/:id/steps
POST   /api/v1/jsa/:id/steps
GET    /api/v1/jsa/:id/export
```

## Webhook Events

```text
risk.created
risk.high_created
risk.extreme_created
risk.rating_changed
risk.approved
risk.review_due
risk.action_created
hiradc.created
hiradc.approved
jsa.created
jsa.approved
risk.control_failed
```
