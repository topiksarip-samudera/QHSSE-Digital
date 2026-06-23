# Incident Management Sequence 06 — Investigation

## Tujuan

Membangun proses investigasi: team, plan, chronology, interview, scene condition, failed barrier, findings, conclusion.

## Fitur yang Harus Dibuat

- [ ] Investigation team
- [ ] Investigation plan
- [ ] Investigation start/end date
- [ ] Chronology / event timeline
- [ ] Scene condition
- [ ] Evidence review notes
- [ ] Interview notes
- [ ] Witness statement detail
- [ ] Direct cause
- [ ] Immediate cause
- [ ] Basic cause preliminary
- [ ] Failed barrier
- [ ] Investigation findings
- [ ] Investigation conclusion
- [ ] Submit investigation for RCA review

## Database / Tabel Minimal

- `incident_investigations`
- `incident_investigation_team`
- `incident_chronologies`
- `incident_interviews`
- `incident_failed_barriers`
- `incident_investigation_findings`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/:id/investigation`
- `POST /incidents/:id/investigation/start`
- `PATCH /incidents/:id/investigation`
- `POST /incidents/:id/investigation/team`
- `POST /incidents/:id/investigation/chronology`
- `POST /incidents/:id/investigation/interviews`
- `POST /incidents/:id/investigation/findings`
- `POST /incidents/:id/investigation/submit`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Investigation Tab
- Investigation team section
- Chronology builder
- Interview notes section
- Failed barrier section
- Investigation findings section
- Investigation conclusion editor

## Permission yang Dipakai

```text
incident.view
incident.investigate
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
Investigator Assigned → Investigation In Progress → Investigation Submitted
```


## Validasi Backend

- [ ] Only assigned investigator/team can edit investigation
- [ ] Investigation cannot start before assignment
- [ ] Chronology date cannot be after submit date unless allowed
- [ ] Submit investigation requires conclusion
- [ ] Submit investigation requires at least one finding for severe incidents

## Testing Minimal

- [ ] Start investigation success
- [ ] Unauthorized edit rejected
- [ ] Add chronology success
- [ ] Add interview success
- [ ] Submit without conclusion fails
- [ ] Submit investigation changes status
- [ ] Audit log created


## Output yang Harus Jadi

- Investigation record
- Investigation chronology
- Investigation findings
- Investigation conclusion


## Acceptance Criteria

- [ ] Investigator can complete investigation
- [ ] Investigation data appears in report
- [ ] Unauthorized users cannot edit investigation
- [ ] Investigation submit triggers next workflow step
- [ ] Audit log created

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 06: Investigation. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 06.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 06: Investigation
```
