# Incident Management Sequence 02 — Incident Report Core

## Tujuan

Membangun fitur dasar pelaporan incident: create, list, detail, edit, archive, dan submit draft.

## Fitur yang Harus Dibuat

- [ ] Create incident draft
- [ ] Edit incident draft
- [ ] Incident list
- [ ] Incident detail
- [ ] Archive incident
- [ ] Incident number generation
- [ ] Incident date/time
- [ ] Reported by
- [ ] Site/department/location
- [ ] Incident title
- [ ] Description
- [ ] Immediate action
- [ ] Draft/submitted status
- [ ] Basic filters and search

## Database / Tabel Minimal

- `incidents`
- `incident_status_histories`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents`
- `POST /incidents`
- `GET /incidents/:id`
- `PATCH /incidents/:id`
- `DELETE /incidents/:id`
- `POST /incidents/:id/submit`
- `GET /incidents/:id/status-history`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Incident List Page
- Create Incident Page
- Incident Detail Page
- Edit Incident Page
- Basic Overview Tab
- Status badge
- Filter by site/status/date/type

## Permission yang Dipakai

```text
incident.view
incident.view_all
incident.create
incident.update
incident.delete
incident.submit
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan


## Workflow / Status

```text
Draft → Submitted
```


## Validasi Backend

- [ ] Incident date/time required
- [ ] Site required
- [ ] Location required depending setting
- [ ] Title required
- [ ] Description required
- [ ] Immediate action required depending severity/type setting
- [ ] Draft can be edited by creator or authorized role
- [ ] Submitted incident cannot be edited except allowed fields
- [ ] No cross-company site/location reference

## Testing Minimal

- [ ] Create incident success
- [ ] Create incident validation error
- [ ] List incident tenant isolation
- [ ] Update incident permission denied
- [ ] Archive incident permission denied
- [ ] Submit incident changes status
- [ ] Audit log created on create/update/archive/submit


## Output yang Harus Jadi

- Incident report basic CRUD
- Incident number
- Draft/submitted lifecycle


## Acceptance Criteria

- [ ] User can create incident draft
- [ ] User can submit incident
- [ ] Incident number generated using numbering core
- [ ] Company A cannot access Company B incident
- [ ] Unauthorized user cannot update/delete/submit
- [ ] Audit log created

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 02: Incident Report Core. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 02.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 02: Incident Report Core
```
