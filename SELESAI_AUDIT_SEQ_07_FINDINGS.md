# SELESAI AUDIT INSPECTION SEQUENCE 07: Finding & Nonconformity Management

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (1 table)
- `findings` — Finding register (recordType: audit/inspection, findingType: NC/Observation/OFI, category, severity: Critical/Major/Minor/Observation, requirement reference, evidence, root cause required flag, action required flag, status lifecycle)

### Backend API (6 endpoints)
- `POST/GET/:id/PATCH /findings` — CRUD findings (filterable by recordType/recordId)
- `POST /findings/:id/assign` — Assign finding → status changes to action_assigned
- `POST /findings/:id/close` — Close finding (sets closedBy + closedAt)

### Finding Status Lifecycle
```
Open → Action Assigned → In Progress → Under Review → Verified → Closed
                                                                  ↓
                                                              Reopened
```

### Finding Fields
- Requirement reference (clause/standard)
- Root cause required flag for Major NC
- Action required flag
- Evidence description
- Linked to parent audit/inspection via recordType + recordId

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
