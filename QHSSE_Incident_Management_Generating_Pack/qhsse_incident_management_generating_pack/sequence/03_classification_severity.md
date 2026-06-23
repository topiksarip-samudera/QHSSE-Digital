# Incident Management Sequence 03 — Incident Classification & Severity

## Tujuan

Membangun klasifikasi incident, severity, potential consequence, actual consequence, loss type, dan high severity flag.

## Fitur yang Harus Dibuat

- [ ] Incident type selection
- [ ] Incident category selection
- [ ] Actual severity
- [ ] Potential severity
- [ ] Actual consequence
- [ ] Potential consequence
- [ ] Loss type
- [ ] People/environment/asset/security/quality impact classification
- [ ] High severity flag
- [ ] Repeat incident flag
- [ ] Mandatory field rules based on type/severity
- [ ] Classification review

## Database / Tabel Minimal

- `incident_classifications`
- `incident_impacts`
- `incident_repeat_links`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/:id/classification`
- `PATCH /incidents/:id/classification`
- `POST /incidents/:id/classification/review`
- `GET /incidents/:id/related-incidents`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Classification Tab
- Severity selector
- Consequence selector
- Impact classification form
- Repeat incident suggestion/list
- Classification review action

## Permission yang Dipakai

```text
incident.view
incident.update
incident.classify
incident.review
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan


## Workflow / Status

```text
Submitted → Initial Review → Classification
```


## Validasi Backend

- [ ] Only authorized role can finalize classification
- [ ] Severity must exist in company severity matrix
- [ ] Incident type must exist in company master data
- [ ] High severity requires mandatory notification event
- [ ] Potential severity cannot be empty after initial review

## Testing Minimal

- [ ] Update classification success
- [ ] Invalid severity rejected
- [ ] High severity creates notification event
- [ ] Unauthorized classify rejected
- [ ] Classification change audit log created


## Output yang Harus Jadi

- Incident classification complete
- High severity detection
- Repeat incident flag foundation


## Acceptance Criteria

- [ ] Incident can be classified
- [ ] High severity flag works
- [ ] Classification changes are audited
- [ ] High severity notification is triggered
- [ ] Classification fields are tenant-specific via master data

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 03: Incident Classification & Severity. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 03.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 03: Incident Classification & Severity
```
