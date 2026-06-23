# 04 — API CONTRACT GUIDE

Gunakan prefix:

```text
/api/v1
```

## Document Types & Settings

```text
GET    /document-types
POST   /document-types
GET    /document-types/:id
PATCH  /document-types/:id
DELETE /document-types/:id

GET    /document-categories
POST   /document-categories
PATCH  /document-categories/:id

GET    /document-settings
PATCH  /document-settings
```

## Document Core

```text
GET    /documents
POST   /documents
GET    /documents/:id
PATCH  /documents/:id
DELETE /documents/:id
POST   /documents/:id/archive
POST   /documents/:id/restore
POST   /documents/:id/obsolete
```

## Revision

```text
GET    /documents/:id/revisions
POST   /documents/:id/revisions
GET    /document-revisions/:revisionId
PATCH  /document-revisions/:revisionId
POST   /document-revisions/:revisionId/submit-review
POST   /document-revisions/:revisionId/review
POST   /document-revisions/:revisionId/request-revision
POST   /document-revisions/:revisionId/approve
POST   /document-revisions/:revisionId/publish
POST   /document-revisions/:revisionId/supersede
```

## File

```text
POST /document-revisions/:revisionId/upload-file
GET  /document-revisions/:revisionId/download
GET  /document-revisions/:revisionId/preview
```

## Distribution & Acknowledgement

```text
GET  /documents/:id/distributions
POST /documents/:id/distribute
GET  /documents/:id/acknowledgements
POST /documents/:id/acknowledge
GET  /documents/:id/acknowledgement-status
```

## Controlled Copy

```text
GET    /documents/:id/controlled-copies
POST   /documents/:id/controlled-copies
PATCH  /controlled-copies/:id
POST   /controlled-copies/:id/revoke
```

## QR & Search

```text
GET  /documents/:id/qr
POST /documents/qr/verify
GET  /documents/search
GET  /documents/latest
GET  /documents/review-due
```

## Links

```text
GET  /documents/:id/links
POST /documents/:id/links
DELETE /document-links/:id
```

## Reports & Dashboard

```text
GET /document-control/dashboard
GET /document-control/kpi
GET /document-control/review-due
GET /document-control/acknowledgement-overdue
GET /documents/export
GET /documents/:id/report
```

## Standard Query

```text
?page=1&pageSize=20&search=&documentTypeId=&categoryId=&status=&ownerDepartmentId=&siteId=&reviewDue=&sort=updatedAt:desc
```
