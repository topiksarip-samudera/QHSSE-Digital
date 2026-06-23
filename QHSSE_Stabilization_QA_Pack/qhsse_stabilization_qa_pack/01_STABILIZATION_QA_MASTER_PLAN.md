# 01 — STABILIZATION & QA MASTER PLAN

## Tujuan

Menjadikan Core Platform stabil, aman, dan siap digunakan sebagai fondasi semua modul QHSSE.

## Scope QA

Tahap ini menguji dan memperbaiki:

1. Core Integration
2. Tenant Isolation
3. Authentication & Session
4. Role, Permission & Scope
5. Module ON/OFF
6. Master Data
7. Workflow Engine
8. Notification
9. Attachment & Evidence
10. Audit Log
11. Action Tracking
12. Form Builder
13. Checklist Builder
14. API Contract
15. Database Integrity
16. Frontend UX
17. Automated Test
18. Performance Baseline
19. Bug Fix & Regression
20. Release Gate

## Prinsip QA

- Jangan hanya test happy path.
- Test forbidden access.
- Test cross-company access.
- Test direct API call, bukan hanya UI.
- Test old workflow instance setelah workflow template berubah.
- Test file access dengan user yang tidak punya permission.
- Test module OFF di UI dan API.
- Test audit log untuk semua critical action.
- Test import/export jika sudah dibuat.
- Test notification event.
- Test soft delete dan restore jika tersedia.
- Test responsive UI.

## Severity Bug

```text
P0 Critical:
- Data leak antar company
- Login/security broken
- Permission backend bypass
- File public tanpa auth
- Data corruption

P1 High:
- Workflow salah approver
- Audit log tidak tercatat
- Module OFF API tetap aktif
- Action close tanpa permission
- Notification approval tidak terkirim

P2 Medium:
- UI error
- Filter/pagination salah
- Empty state tidak ada
- Validation kurang jelas

P3 Low:
- Typo
- Layout minor
- Minor UX polish
```

## Release Gate

Core Platform hanya boleh lanjut ke QHSSE Operational Modules jika:

```text
P0 = 0
P1 = 0
P2 <= disetujui untuk backlog
P3 boleh backlog
Tenant isolation PASS
Permission backend PASS
Audit log PASS
File access security PASS
Workflow basic PASS
Build/lint/test PASS
```

## Deliverable Wajib

```text
QA_SUMMARY.md
BUG_REGISTER.md
FIX_LOG.md
REGRESSION_TEST_RESULT.md
SECURITY_TEST_RESULT.md
TENANT_ISOLATION_RESULT.md
PERMISSION_TEST_RESULT.md
RELEASE_GATE_DECISION.md
```
