# 02 — DOCUMENT CONTROL GENERATING RULES

## Aturan Utama

1. Jangan membuat Document Control sebagai upload file biasa.
2. Semua dokumen harus memiliki metadata.
3. Semua dokumen harus memiliki document number.
4. Semua dokumen harus memiliki revision.
5. Published revision harus immutable.
6. Edit published document harus membuat draft revision baru.
7. Review dan approval harus menggunakan workflow engine.
8. File harus disimpan melalui attachment/file service core.
9. Download/view harus permission-guarded.
10. Acknowledgement harus tercatat per user.
11. Obsolete document tidak boleh hard delete.
12. Controlled copy harus bisa dilacak.
13. QR harus mengarah ke latest published version atau revision spesifik sesuai konfigurasi.
14. Audit log wajib untuk upload, download, publish, revise, obsolete, archive, restore, distribution, acknowledgement.
15. Semua data wajib tenant-safe.

## Status Dokumen

```text
draft
submitted_for_review
under_review
revision_required
approved
published
distributed
review_due
superseded
obsolete
archived
cancelled
```

## Status Revision

```text
draft
under_review
approved
published
superseded
obsolete
archived
```

## Permission Standard

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
document.controlled_copy.manage
```

## Scope Standard

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

## Audit Log Wajib

```text
document.created
document.updated
document.uploaded
document.submitted
document.reviewed
document.approved
document.published
document.distributed
document.acknowledged
document.downloaded
document.revision_created
document.superseded
document.obsoleted
document.archived
document.restored
controlled_copy.created
controlled_copy.revoked
report.exported
settings.changed
```

## Webhook Events

```text
document.created
document.submitted
document.approved
document.published
document.distributed
document.acknowledgement_due
document.review_due
document.obsoleted
document.revision_created
document.downloaded optional
controlled_copy.created
```
