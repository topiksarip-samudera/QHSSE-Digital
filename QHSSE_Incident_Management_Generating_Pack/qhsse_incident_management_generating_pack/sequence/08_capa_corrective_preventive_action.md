# Incident Management Sequence 08 — CAPA / Corrective & Preventive Action

## Tujuan

Mengintegrasikan incident dengan Action Tracking Core untuk corrective action, preventive action, verification, dan effectiveness review.

## Fitur yang Harus Dibuat

- [ ] Create corrective action from incident
- [ ] Create preventive action from incident
- [ ] Link action to root cause
- [ ] Assign PIC
- [ ] Due date
- [ ] Priority
- [ ] Action evidence
- [ ] Submit action verification
- [ ] Verify/reject action
- [ ] CAPA effectiveness review
- [ ] CAPA overdue detection
- [ ] CAPA status summary in incident

## Database / Tabel Minimal

- `actions`
- `action_evidences`
- `action_verifications`
- `incident_action_links`
- `incident_capa_effectiveness_reviews`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/:id/capa`
- `POST /incidents/:id/capa`
- `PATCH /incidents/:id/capa/:actionId`
- `POST /incidents/:id/capa/:actionId/submit-verification`
- `POST /incidents/:id/capa/:actionId/verify`
- `POST /incidents/:id/capa/:actionId/reject`
- `POST /incidents/:id/capa/effectiveness-review`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- CAPA Tab
- Create CAPA modal
- CAPA list by root cause
- Action status badge
- Evidence upload from action core
- Verification panel
- Effectiveness review section

## Permission yang Dipakai

```text
incident.view
incident.capa
incident.verify
action.view
action.create
action.update
action.verify
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan


## Workflow / Status

```text
RCA Reviewed → CAPA Assigned → CAPA In Progress → Pending Verification → CAPA Verified
```


## Validasi Backend

- [ ] CAPA must link to incident
- [ ] CAPA must have PIC
- [ ] CAPA must have due date
- [ ] Due date cannot be before creation date
- [ ] CAPA closure requires verification
- [ ] High severity cannot close with open CAPA
- [ ] Verifier should not be same as PIC if configured

## Testing Minimal

- [ ] Create corrective action success
- [ ] Create preventive action success
- [ ] Action linked to incident
- [ ] CAPA overdue computed
- [ ] High severity cannot close with open CAPA
- [ ] CAPA verification works
- [ ] Notification created for PIC
- [ ] Audit log created


## Output yang Harus Jadi

- Corrective action list
- Preventive action list
- CAPA verification
- Effectiveness review


## Acceptance Criteria

- [ ] Incident can generate CAPA
- [ ] CAPA uses Action Tracking Core
- [ ] CAPA appears in My Actions for PIC
- [ ] CAPA status visible in incident
- [ ] Incident cannot close while mandatory CAPA open
- [ ] CAPA changes are audited

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 08: CAPA / Corrective & Preventive Action. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 08.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 08: CAPA / Corrective & Preventive Action
```
