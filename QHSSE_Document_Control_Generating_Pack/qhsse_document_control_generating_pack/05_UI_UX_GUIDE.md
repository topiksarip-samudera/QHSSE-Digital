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
