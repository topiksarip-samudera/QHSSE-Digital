# START HERE — QHSSE Stabilization & QA Pack

Tanggal: 2026-06-21

Paket ini digunakan **setelah Core Platform selesai** dan **sebelum masuk QHSSE Operational Modules**.

Roadmap:

```text
Core Platform
→ Stabilization & QA
→ QHSSE Operational Modules
→ Reports & Analytics
→ AI Assistant
→ Mobile/PWA Field Optimization
→ SaaS Commercialization
```

## Tujuan

Tahap ini memastikan Core Platform benar-benar stabil, aman, dan siap menjadi fondasi semua modul QHSSE.

## Kenapa Wajib

Jangan lanjut ke Incident, Risk, Audit, Permit, Document, Training, Legal, Environment, Quality, Security, Contractor, atau Emergency sebelum Core Platform lulus QA.

Risiko jika dilewati:

- Data company bocor antar tenant.
- Permission hanya aman di UI, tetapi API bocor.
- Workflow tidak reusable.
- Audit log tidak konsisten.
- Attachment bisa diakses tanpa izin.
- Module ON/OFF hanya menyembunyikan menu, tetapi API tetap aktif.
- Form/checklist builder tidak stabil.
- Migration database sulit diperbaiki setelah modul besar dibuat.

## Cara Pakai

1. Buka `00_PROMPT_AWAL_STABILIZATION_QA.md`.
2. Jalankan QA sesuai `01_STABILIZATION_QA_MASTER_PLAN.md`.
3. Kerjakan sequence dari folder `qa_sequence/`.
4. Gunakan folder `test_matrix/` untuk test otomatis.
5. Gunakan folder `reports_templates/` untuk laporan QA.
6. Gunakan folder `prompts/` untuk instruksi AI Agent.
7. Jangan lanjut ke QHSSE Operational Modules sebelum status: `CORE PLATFORM STABILIZED: GO`.

## Output Akhir

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


---

# 00 — PROMPT AWAL STABILIZATION & QA UNTUK AI AGENT

Core Platform sudah selesai dibuat.

Sekarang lakukan tahap Stabilization & QA sebelum lanjut ke QHSSE Operational Modules.

Baca seluruh file dalam folder `qhsse_stabilization_qa_pack`.

Aturan wajib:

1. Jangan membuat modul QHSSE operational dulu.
2. Jangan lanjut ke Incident, Risk, Audit, Permit, Document, Training, Legal, Environment, Quality, Security, Contractor, atau Emergency.
3. Fokus hanya menstabilkan Core Platform.
4. Ikuti `01_STABILIZATION_QA_MASTER_PLAN.md`.
5. Kerjakan sequence di folder `qa_sequence/` satu per satu.
6. Jika menemukan bug, perbaiki bug tersebut.
7. Setelah perbaikan, jalankan regression test.
8. Buat QA report.
9. Jika semua gate lulus, tulis `CORE PLATFORM STABILIZED: GO`.
10. Jika belum lulus, tulis `CORE PLATFORM STABILIZED: NO-GO` disertai daftar masalah yang harus diperbaiki.

Mulai dari mengecek:

- Tenant isolation
- Authentication/session
- Role/permission/scope
- Module ON/OFF
- Master data
- Workflow
- Notification
- Attachment/evidence
- Audit log
- Action tracking
- Form/checklist builder jika sudah ada
- API contract
- Database integrity
- Frontend UX
- Test coverage
- Performance baseline


---

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


---

# 02 — STABILIZATION & QA SEQUENCE

Kerjakan berurutan. Jangan lompat.

## Sequence

1. `01_core_inventory_and_integration_audit.md`
2. `02_tenant_isolation_qa.md`
3. `03_auth_session_security_qa.md`
4. `04_role_permission_scope_qa.md`
5. `05_module_on_off_qa.md`
6. `06_master_data_qa.md`
7. `07_workflow_engine_qa.md`
8. `08_notification_qa.md`
9. `09_attachment_evidence_file_security_qa.md`
10. `10_audit_log_qa.md`
11. `11_action_tracking_qa.md`
12. `12_form_checklist_builder_qa.md`
13. `13_api_contract_backend_qa.md`
14. `14_database_integrity_migration_qa.md`
15. `15_frontend_ux_responsive_qa.md`
16. `16_automated_test_coverage_qa.md`
17. `17_performance_reliability_baseline.md`
18. `18_bug_fix_and_regression.md`
19. `19_release_gate_go_no_go.md`

## Prompt Continue

```text
Continue Stabilization & QA Sequence. Kerjakan file QA berikutnya. Jika selesai, tulis SELESAI QA STEP: <nama step>. Jangan lanjut step berikutnya sebelum saya minta continue.
```

## Syarat Lanjut

Hanya lanjut jika release gate menghasilkan:

```text
CORE PLATFORM STABILIZED: GO
```


---

# QHSSE Stabilization & QA — Master File

## Posisi dalam Roadmap

```text
Core Platform
→ Stabilization & QA
→ QHSSE Operational Modules
→ Reports & Analytics
→ AI Assistant
→ Mobile/PWA Field Optimization
→ SaaS Commercialization
```

## Tujuan

Menstabilkan Core Platform sebelum modul operasional QHSSE dibuat.

## Gate Utama

Core Platform hanya boleh lanjut jika:

```text
P0 = 0
P1 = 0
Tenant isolation PASS
Permission backend PASS
File security PASS
Audit log PASS
Workflow PASS
Lint/test/build PASS
```

## Sequence

1. Core Inventory & Integration Audit
2. Tenant Isolation QA
3. Auth & Session Security QA
4. Role, Permission & Scope QA
5. Module ON/OFF QA
6. Master Data QA
7. Workflow Engine QA
8. Notification QA
9. Attachment & File Security QA
10. Audit Log QA
11. Action Tracking QA
12. Form & Checklist Builder QA
13. API Contract & Backend QA
14. Database Integrity & Migration QA
15. Frontend UX & Responsive QA
16. Automated Test Coverage QA
17. Performance & Reliability Baseline
18. Bug Fix & Regression
19. Release Gate GO / NO-GO

## Prompt Singkat

```text
Core Platform sudah selesai. Jalankan Stabilization & QA sesuai qhsse_stabilization_qa_pack. Kerjakan sequence satu per satu. Jangan lanjut ke QHSSE Operational Modules sebelum release gate menghasilkan CORE PLATFORM STABILIZED: GO.
```
