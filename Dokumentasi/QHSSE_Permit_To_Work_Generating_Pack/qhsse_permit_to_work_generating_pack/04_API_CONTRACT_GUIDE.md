# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Permit Types & Settings

```text
GET    /permit-types
POST   /permit-types
GET    /permit-types/:id
PATCH  /permit-types/:id
DELETE /permit-types/:id

GET    /permit-types/:id/requirements
POST   /permit-types/:id/requirements
PATCH  /permit-type-requirements/:id
DELETE /permit-type-requirements/:id

GET    /permit-settings
PATCH  /permit-settings
```

## Permit Core

```text
GET    /permits
POST   /permits
GET    /permits/:id
PATCH  /permits/:id
DELETE /permits/:id

POST   /permits/:id/submit
POST   /permits/:id/review
POST   /permits/:id/approve
POST   /permits/:id/reject
POST   /permits/:id/request-revision
POST   /permits/:id/activate
POST   /permits/:id/extend
POST   /permits/:id/suspend
POST   /permits/:id/resume
POST   /permits/:id/submit-closeout
POST   /permits/:id/verify-closeout
POST   /permits/:id/close
POST   /permits/:id/cancel
```

## Work Party & Requirement

```text
GET    /permits/:id/workers
POST   /permits/:id/workers
DELETE /permits/:id/workers/:workerId

GET    /permits/:id/ppe
POST   /permits/:id/ppe

GET    /permits/:id/tools
POST   /permits/:id/tools

GET    /permits/:id/equipment
POST   /permits/:id/equipment

POST   /permits/:id/validate-competency
POST   /permits/:id/validate-equipment
```

## Risk / JSA Link

```text
GET  /permits/:id/risk-links
POST /permits/:id/risk-links

GET  /permits/:id/jsa-links
POST /permits/:id/jsa-links

POST /permits/:id/validate-jsa
```

## Gas Test

```text
GET  /permits/:id/gas-tests
POST /permits/:id/gas-tests
POST /permit-gas-tests/:id/verify
```

## LOTO / Isolation

```text
GET  /permits/:id/loto
POST /permits/:id/loto
POST /permits/:id/loto/apply
POST /permits/:id/loto/verify
POST /permits/:id/loto/remove
```

## SIMOPS / Clash Detection

```text
POST /permits/:id/simops/check
GET  /permits/:id/simops
POST /permits/:id/simops/approve
POST /permits/:id/simops/reject
```

## QR & Active Board

```text
GET  /permits/:id/qr
POST /permits/qr/verify
GET  /permits/active-board
GET  /permits/active-board/map optional
```

## Reports & Dashboard

```text
GET /permits/:id/report
GET /permits/:id/export
GET /permit-to-work/dashboard
GET /permit-to-work/kpi
GET /permit-to-work/high-risk-work
GET /permit-to-work/expiring
```

## Standard Query

```text
?page=1&pageSize=20&search=&siteId=&permitTypeId=&status=&dateFrom=&dateTo=&locationId=&contractorId=&sort=startDatetime:desc
```
