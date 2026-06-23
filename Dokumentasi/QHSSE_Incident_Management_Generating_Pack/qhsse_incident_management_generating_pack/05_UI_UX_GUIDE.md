# 05 — INCIDENT UI/UX GUIDE

## Sidebar

Incident Management hanya tampil jika module aktif untuk company dan user punya permission.

```text
QHSSE
└── Incident Management
    ├── Dashboard
    ├── Incident List
    ├── Report Incident
    ├── Review Queue
    ├── Investigation Queue
    ├── CAPA
    ├── Lessons Learned
    └── Settings
```

## Incident List

Kolom minimal:

```text
Incident Number
Title
Incident Date
Site
Location
Type
Actual Severity
Potential Severity
Status
Investigator
Open CAPA
Created By
Updated At
Actions
```

Filter:

```text
Date range
Site
Department
Location
Status
Type
Severity
High severity
Investigator
CAPA overdue
```

## Create Incident Form

Section:

```text
Basic Information
Location
Incident Description
Immediate Action
Initial Classification
People Involved optional
Evidence optional
```

## Detail Page Tabs

```text
Overview
Classification
People / Injury / Witness
Investigation
Root Cause Analysis
CAPA
Evidence
Timeline
Comments
Workflow
Audit Trail
Reports
```

## Status Badge

```text
Draft
Submitted
In Review
Investigation Required
Investigation In Progress
RCA In Progress
CAPA Assigned
Pending Verification
Pending Approval
Closed
Cancelled
Archived
```

## Mobile/PWA Notes

Incident reporting harus nyaman di mobile:

```text
Camera upload
GPS/location optional
Offline draft optional
Simple form mode
Large buttons
Minimal required fields for quick report
```

## UX Rule

- Jangan tampilkan tombol yang user tidak punya permission.
- Tapi backend tetap wajib menolak akses tanpa permission.
- High severity incident harus terlihat jelas.
- CAPA overdue harus jelas.
- Detail page harus menampilkan timeline agar user paham status.
