# Incident Management Sequence 12 — QA, Test, Permission & Stabilization

## Tujuan

Menstabilkan Incident Management sebelum lanjut ke Risk Management / HIRADC / JSA.

## Fitur yang Harus Dibuat

- [ ] Incident module regression test
- [ ] Tenant isolation test
- [ ] Permission test
- [ ] Workflow test
- [ ] Attachment security test
- [ ] CAPA integration test
- [ ] Notification test
- [ ] Dashboard calculation test
- [ ] Report export test
- [ ] Audit log test
- [ ] Bug register
- [ ] Fix log
- [ ] Release gate

## Database / Tabel Minimal

- `qa_reports_optional`
- `bug_register_optional`
- `test_results_optional`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `No new business API required`
- `Use test scripts and QA reports`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- No new UI required unless QA dashboard exists
- Fix UI defects found during QA

## Permission yang Dipakai

```text
incident.view
incident.create
incident.update
incident.submit
incident.review
incident.investigate
incident.rca
incident.capa
incident.close
incident.export
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan



## Validasi Backend

- [ ] No P0 bug
- [ ] No P1 bug
- [ ] Tenant isolation passed
- [ ] Permission backend passed
- [ ] Workflow passed
- [ ] Attachment security passed
- [ ] CAPA integration passed
- [ ] Audit log passed
- [ ] Dashboard KPI passed

## Testing Minimal

- [ ] Company A cannot access Company B incident
- [ ] User without permission cannot create/update/approve/close
- [ ] High severity incident sends notification
- [ ] Incident can generate CAPA
- [ ] CAPA can be verified
- [ ] Attachment cannot be accessed without permission
- [ ] Audit log recorded for create/update/submit/approve/close/export
- [ ] Dashboard counts are correct
- [ ] Report export works


## Output yang Harus Jadi

- Incident QA Summary
- Bug Register
- Fix Log
- Regression Test Result
- Release Gate Decision


## Acceptance Criteria

- [ ] P0 bugs = 0
- [ ] P1 bugs = 0
- [ ] Tenant isolation PASS
- [ ] Permission backend PASS
- [ ] Workflow PASS
- [ ] Attachment security PASS
- [ ] CAPA integration PASS
- [ ] Notification PASS
- [ ] Audit log PASS
- [ ] Dashboard/report PASS
- [ ] Final status: INCIDENT MANAGEMENT STABILIZED: GO

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 12: QA, Test, Permission & Stabilization. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 12.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 12: QA, Test, Permission & Stabilization
```
