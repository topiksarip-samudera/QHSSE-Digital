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
