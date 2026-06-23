# Incident Management Sequence 07 — Root Cause Analysis

## Tujuan

Membangun RCA terstruktur: 5 Why, Fishbone, immediate/basic/system cause, human/equipment/procedure/environment/management factors.

## Fitur yang Harus Dibuat

- [ ] Root cause summary
- [ ] Immediate cause
- [ ] Basic cause
- [ ] System cause
- [ ] 5 Why Analysis
- [ ] Fishbone Analysis
- [ ] Root cause category
- [ ] Human factor
- [ ] Equipment factor
- [ ] Procedure factor
- [ ] Environment factor
- [ ] Management system factor
- [ ] Root cause verification
- [ ] Submit RCA for review

## Database / Tabel Minimal

- `incident_root_causes`
- `incident_5why`
- `incident_fishbone`
- `incident_cause_factors`
- `incident_rca_reviews`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/:id/rca`
- `PATCH /incidents/:id/rca`
- `POST /incidents/:id/rca/5why`
- `POST /incidents/:id/rca/fishbone`
- `POST /incidents/:id/rca/submit`
- `POST /incidents/:id/rca/review`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- RCA Tab
- 5 Why builder
- Fishbone builder
- Cause category selector
- Cause factor checklist
- RCA review action

## Permission yang Dipakai

```text
incident.view
incident.rca
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
Investigation Submitted → RCA In Progress → RCA Submitted → RCA Reviewed
```


## Validasi Backend

- [ ] RCA required for high severity incidents
- [ ] At least one root cause required before submit
- [ ] 5 Why must have at least defined chain if selected
- [ ] Fishbone category values must come from master data
- [ ] RCA review requires authorized reviewer

## Testing Minimal

- [ ] Create RCA success
- [ ] 5 Why creation success
- [ ] Fishbone creation success
- [ ] Submit RCA without root cause fails
- [ ] High severity cannot close without RCA
- [ ] Unauthorized RCA rejected
- [ ] Audit log created


## Output yang Harus Jadi

- RCA summary
- 5 Why analysis
- Fishbone analysis
- Root cause list


## Acceptance Criteria

- [ ] Incident has complete RCA
- [ ] High severity requires RCA
- [ ] RCA can be reviewed
- [ ] RCA becomes source for CAPA
- [ ] Audit log created

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 07: Root Cause Analysis. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 07.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 07: Root Cause Analysis
```
