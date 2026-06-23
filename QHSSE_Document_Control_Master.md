# START HERE — QHSSE Document Control Generating Pack

Tanggal: 2026-06-21

Paket ini dibuat untuk menghasilkan modul **Document Control** pada WebApp QHSSE secara sequence, aman, dan tidak menjadi sekadar fitur upload file.

## Posisi Modul dalam Roadmap

```text
Core Platform
→ Stabilization & QA
→ Incident Management
→ Risk Management / HIRADC / JSA
→ Audit & Inspection
→ Permit to Work
→ Document Control
→ Training & Competency
→ Legal & Compliance
→ Environment
→ Quality
→ Security
→ Contractor
→ Emergency
→ Asset & Equipment
```

## Rekomendasi Split

Modul **Document Control** sebaiknya di-split menjadi **12 sequence**.

```text
01 Foundation & Master Data
02 Document Register Core
03 Document Type, Category & Numbering
04 Document Upload, Draft & Metadata
05 Review & Approval Workflow
06 Revision Control & Version History
07 Publishing, Distribution & Controlled Copy
08 Acknowledgement & Read Confirmation
09 Obsolete, Archive & Retention
10 Search, QR Document & Access Control
11 Dashboard, Report & Export
12 QA, Test, Permission & Stabilization
```

## Kenapa 12 Sequence?

Document Control menyentuh banyak core dan modul:

```text
Workflow
Attachment
Permission
Audit Log
Notification
Numbering
Search
QR Code
Training
Risk
Permit
Audit
Legal Compliance
Contractor Document
```

Jika digenerate sekaligus, biasanya hasilnya hanya menjadi upload file biasa. Dengan 12 sequence, modul akan menjadi sistem document control lengkap: revision, approval, publishing, distribution, acknowledgement, controlled copy, obsolete archive, dan access control.

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_DOCUMENT_CONTROL.md`.
3. Baca `01_DOCUMENT_CONTROL_MASTER_BLUEPRINT.md`.
4. Baca `02_DOCUMENT_CONTROL_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Selesaikan satu sequence.
7. Setelah selesai, AI Agent harus menulis `SELESAI DOCUMENT CONTROL SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.

## Status Akhir

Setelah sequence 12 selesai:

```text
DOCUMENT CONTROL STABILIZED: GO
```


---

# 00 — PROMPT AWAL DOCUMENT CONTROL UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management / HIRADC / JSA, Audit & Inspection, dan Permit to Work sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Document Control**.

Baca seluruh file dalam folder `qhsse_document_control_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core yang sudah ada:
   - Company / tenant
   - Site / project / department / location
   - Role & permission
   - Module ON/OFF
   - Master data
   - Workflow
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Search
   - QR code engine jika tersedia
   - API/webhook
4. Document Control tidak boleh hanya upload file.
5. Harus ada revision control.
6. Harus ada review dan approval workflow.
7. Harus ada publish dan obsolete/archive.
8. Harus ada distribution dan acknowledgement.
9. Harus ada controlled copy.
10. Dokumen published harus immutable; perubahan harus melalui revision baru.
11. Download/view dokumen harus permission-aware.
12. Semua download, publish, revision, obsolete, dan export penting harus audit logged.
13. Setelah sequence selesai, tulis:
   `SELESAI DOCUMENT CONTROL SEQUENCE XX: <nama sequence>`
14. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT DOCUMENT CONTROL

## Tujuan Modul

Modul **Document Control** digunakan untuk mengelola dokumen sistem manajemen QHSSE: policy, manual, SOP, work instruction, form, checklist, standard, drawing, method statement, HSE plan, quality plan, emergency procedure, legal document, dan controlled external document.

Modul ini harus mendukung lifecycle dokumen dari draft sampai obsolete/archive.

## Prinsip Desain

1. Document Control adalah sistem pengendalian dokumen, bukan file manager biasa.
2. Dokumen harus punya document number dan revision.
3. Dokumen published tidak boleh diedit langsung.
4. Perubahan dokumen harus melalui revision baru.
5. Dokumen harus punya review dan approval workflow.
6. Dokumen harus bisa didistribusikan ke user/role/site/department.
7. Dokumen penting harus bisa membutuhkan acknowledgement.
8. Controlled copy harus bisa ditandai dan dilacak.
9. Obsolete document harus tetap tersimpan sebagai history.
10. Semua akses sensitif harus permission-aware.
11. Download, publish, obsolete, dan revision harus audit logged.
12. Dokumen harus bisa di-link ke Risk, Permit, Audit, Training, Legal, Incident, Contractor.

## Jenis Dokumen

```text
Policy
Manual
Procedure / SOP
Work Instruction
Form
Checklist
Standard
Guideline
Emergency Procedure
HSE Plan
Quality Plan
Inspection Test Plan
Method Statement
Job Safety Analysis Attachment
Legal Document
Permit Supporting Document
Training Material
External Standard
Drawing
Specification
Contractor Document
```

## Lifecycle Dokumen

```text
Draft
→ Submitted for Review
→ Under Review
→ Revision Required optional
→ Approved
→ Published
→ Distributed
→ Acknowledgement Required optional
→ Periodic Review
→ Revised / Superseded
→ Obsolete
→ Archived
```

## Submodul Utama

```text
Document Register
Document Type & Category
Document Numbering
Document Metadata
Document Draft
Document Upload
Review Workflow
Approval Workflow
Revision Control
Version History
Publishing
Distribution
Controlled Copy
Acknowledgement
Read Confirmation
Obsolete Management
Archive
Retention
Document Search
QR Document
Access Control
Report & Dashboard
Settings
```

## Output Utama

```text
Master Document List
Document Register
Latest Revision List
Draft Document List
Review Pending List
Approval Pending List
Published Document List
Controlled Copy Register
Acknowledgement Report
Obsolete Document Archive
Document Review Due List
Document Download History
Document Distribution Report
Document PDF/Excel Export
QR Document Link
```

## Integrasi Core

```text
Workflow: review, approval, publish, obsolete
Attachment: file storage
Notification: review/approval/distribution/acknowledgement/review due
Audit Log: upload, download, revision, publish, obsolete
Numbering: document number
Search: document metadata and content if possible
QR: latest published document access
API/Webhook: integration
```

## Integrasi Modul Lain

```text
Risk Management:
- Dokumen menjadi control reference.
- Risk/HIRADC bisa link ke SOP/WI.

Permit to Work:
- Permit type bisa require SOP, method statement, JSA attachment.
- Permit bisa link ke latest published document.

Audit & Inspection:
- Audit finding bisa referensi dokumen.
- Audit evidence bisa dari document control.
- NC bisa memicu revision request.

Training & Competency:
- SOP/policy menjadi training material.
- Acknowledgement bisa menjadi evidence training awareness.

Legal & Compliance:
- Dokumen bisa menjadi compliance evidence.
- Legal obligation bisa link ke controlled document.

Incident Management:
- Incident lessons learned bisa memicu document revision.
- Incident investigation bisa link ke SOP terkait.

Contractor Management:
- Contractor document submission bisa memakai document control pattern.
```


---

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


---

# 03 — DATABASE MODEL GUIDE

## Tabel Minimal

```text
document_types
document_categories
document_settings
documents
document_metadata
document_revisions
document_files
document_reviewers
document_approvers
document_distribution_groups
document_distributions
document_acknowledgements
document_controlled_copies
document_obsolete_records
document_archive_records
document_retention_rules
document_qr_codes
document_access_logs
document_download_logs
document_links
document_reports
```

## Field Umum Wajib

Semua tabel tenant-specific wajib punya:

```text
id
company_id
site_id optional
department_id optional
created_by
updated_by
created_at
updated_at
deleted_at optional
status
```

## documents

```text
id
company_id
document_number
title
document_type_id
document_category_id
owner_department_id
applicable_site_id optional
applicable_department_id optional
confidentiality_level
current_revision_id optional
latest_published_revision_id optional
status
review_frequency_months
next_review_date
effective_date optional
expiry_date optional
workflow_instance_id optional
created_by
updated_by
created_at
updated_at
deleted_at
```

## document_revisions

```text
id
company_id
document_id
revision_number
revision_label
revision_date
change_summary
reason_for_change
file_id
prepared_by
reviewed_by optional
approved_by optional
published_by optional
effective_date optional
published_at optional
superseded_at optional
status
workflow_instance_id optional
created_at
updated_at
```

## document_distributions

```text
id
company_id
document_id
revision_id
distribution_type
recipient_user_id optional
recipient_role_id optional
recipient_site_id optional
recipient_department_id optional
distributed_by
distributed_at
acknowledgement_required
due_date optional
status
created_at
updated_at
```

## document_acknowledgements

```text
id
company_id
document_id
revision_id
distribution_id
user_id
acknowledged_at
acknowledgement_method
ip_address optional
user_agent optional
status
created_at
updated_at
```

## document_controlled_copies

```text
id
company_id
document_id
revision_id
copy_number
copy_holder_type
copy_holder_user_id optional
copy_holder_department_id optional
copy_holder_location_id optional
issued_by
issued_at
revoked_by optional
revoked_at optional
status
remarks
created_at
updated_at
```

## document_links

```text
id
company_id
document_id
revision_id optional
linked_module
linked_record_id
link_type
created_by
created_at
```

## Index Wajib

```text
company_id
document_number
document_type_id
document_category_id
owner_department_id
status
next_review_date
effective_date
expiry_date
current_revision_id
latest_published_revision_id
```

## Relasi Core

```text
attachments/files → document_files
workflow_instances → document/revision
audit_logs → module=document_control
notifications → review/approval/distribution/ack
comments → document/revision
qr_codes → document_qr_codes
```


---

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


---

# 05 — UI/UX GUIDE DOCUMENT CONTROL

## Sidebar

```text
Document Control
├── Overview
├── Document Register
├── Create Document
├── Drafts
├── Review Queue
├── Approval Queue
├── Published Documents
├── Distribution
├── Acknowledgement
├── Controlled Copies
├── Obsolete / Archive
├── Review Due
├── Reports
└── Settings
```

## Halaman Utama

```text
Document Overview Dashboard
Document Register
Create Document
Document Detail
Revision Detail
Document Review Page
Document Approval Page
Published Document Library
Distribution Page
Acknowledgement Page
Controlled Copy Register
Obsolete Archive
Document Search
Document QR Verification
Report Export
Settings
```

## Create Document Wizard

```text
Step 1: Document Type & Category
Step 2: Metadata
Step 3: Owner & Applicability
Step 4: Upload Draft File
Step 5: Reviewer & Approver
Step 6: Distribution & Acknowledgement
Step 7: Review & Submit
```

## Document Detail Tabs

```text
Overview
Metadata
Current Revision
Revision History
Workflow
Distribution
Acknowledgement
Controlled Copies
Linked Records
Attachments
Comments
Download Logs
Audit Trail
```

## Revision Detail Tabs

```text
Overview
File Preview
Change Summary
Review Comments
Approval History
Distribution
Audit Trail
```

## Komponen Wajib

```text
DocumentStatusBadge
RevisionBadge
ConfidentialityBadge
DocumentPreview
RevisionTimeline
ApprovalPanel
DistributionPicker
AcknowledgementTracker
ControlledCopyPanel
DocumentQRCode
DocumentSearchBar
DocumentLinkPanel
ReviewDueCard
```

## UX Penting

- User harus mudah tahu mana dokumen latest published.
- Dokumen obsolete harus diberi watermark/status jelas.
- Tombol download harus permission-aware.
- Published document tidak boleh menampilkan edit langsung, tetapi create new revision.
- Acknowledgement status harus mudah dilacak.
- Mobile view minimal nyaman untuk search, preview, dan acknowledge.


---

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


---

# 07 — QA AND RELEASE GATE

## QA Scope

```text
Tenant Isolation
Permission & Scope
Document Register
Document Metadata
File Upload/Download Security
Review Workflow
Approval Workflow
Revision Control
Published Immutable Rule
Distribution
Acknowledgement
Controlled Copy
Obsolete / Archive
Search
QR Verification
Dashboard Calculation
Report Export
Audit Log
Notification
Regression Test
```

## Release Gate

Document Control hanya boleh dinyatakan selesai jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
File security PASS
Revision control PASS
Published immutable PASS
Workflow PASS
Distribution PASS
Acknowledgement PASS
Controlled copy PASS
Obsolete/archive PASS
QR verification PASS
Audit log PASS
Dashboard calculation PASS
Report export PASS
Lint/test/build PASS
```

## Status Akhir

Jika lulus:

```text
DOCUMENT CONTROL STABILIZED: GO
```

Jika gagal:

```text
DOCUMENT CONTROL STABILIZED: NO-GO
```


---

# 08 — CROSS-MODULE INTEGRATION GUIDE

## Risk Management / HIRADC / JSA

```text
- Risk control can link to SOP/WI.
- HIRADC can reference latest published procedure.
- Risk review can trigger document revision.
```

## Permit to Work

```text
- Permit type can require specific SOP/WI/method statement.
- Permit can attach/link to latest published document.
- Obsolete document cannot be selected for new permit.
```

## Audit & Inspection

```text
- Audit finding can reference document clause/requirement.
- Finding can create document revision request.
- Audit evidence can use document control link.
```

## Training & Competency

```text
- Published SOP can become training material.
- Acknowledgement can feed training awareness.
- New revision can trigger retraining/acknowledgement.
```

## Legal & Compliance

```text
- Legal obligation can link to controlled document.
- Compliance evidence can link to published document.
```

## Incident Management

```text
- Incident RCA can identify document gap.
- Incident lesson learned can trigger SOP revision.
```

## Contractor Management

```text
- Contractor document submission can be stored or referenced.
- Contractor must acknowledge mandatory site documents.
```


---

# Document Control Sequence

Kerjakan sequence berikut secara berurutan:

```text
01 Foundation & Master Data
02 Document Register Core
03 Document Type, Category & Numbering
04 Document Upload, Draft & Metadata
05 Review & Approval Workflow
06 Revision Control & Version History
07 Publishing, Distribution & Controlled Copy
08 Acknowledgement & Read Confirmation
09 Obsolete, Archive & Retention
10 Search, QR Document & Access Control
11 Dashboard, Report & Export
12 QA, Test, Permission & Stabilization
```

## Prompt Continue

```text
Continue Document Control Sequence. Kerjakan sequence berikutnya sesuai sequence/00_DOCUMENT_CONTROL_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
DOCUMENT CONTROL STABILIZED: GO
```
