# 06 — PERMISSION & SECURITY GUIDE

## Permission Groups

### Document

```text
document.view
document.view_all
document.create
document.update
document.delete
document.submit
document.review
document.approve
document.publish
document.distribute
document.acknowledge
document.download
document.archive
document.obsolete
document.restore
document.export
document.manage_settings
```

### Revision

```text
document_revision.view
document_revision.create
document_revision.update
document_revision.submit_review
document_revision.review
document_revision.approve
document_revision.publish
document_revision.download
```

### Controlled Copy

```text
document_controlled_copy.view
document_controlled_copy.create
document_controlled_copy.update
document_controlled_copy.revoke
```

## Scope

```text
Global
Company
Site
Project
Department
Owner Department
Author
Reviewer
Approver
Distribution Recipient
Controlled Copy Holder
```

## Confidentiality Level

```text
public_internal
controlled
confidential
restricted
management_only
```

## Security Rules

- Semua query wajib filter company_id.
- User hanya bisa melihat dokumen sesuai scope dan confidentiality.
- Distribution recipient dapat melihat dokumen yang didistribusikan kepadanya.
- Reviewer hanya bisa review dokumen yang ditugaskan.
- Approver hanya bisa approve dokumen yang ditugaskan.
- Published document tidak boleh diedit langsung.
- Download file harus permission-guarded.
- QR verification tidak boleh membuka dokumen restricted tanpa auth.
- Controlled copy revoke harus butuh permission khusus.
- Obsolete/archive tidak boleh hard delete.
- Download, publish, obsolete, archive, restore wajib audit log.
