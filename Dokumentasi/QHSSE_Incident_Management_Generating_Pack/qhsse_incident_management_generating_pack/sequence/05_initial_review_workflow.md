# Incident Management Sequence 05 — Initial Review & Workflow

## Tujuan

Menghubungkan incident dengan workflow engine: initial review, reject, request revision, approve classification, assign investigator.

## Fitur yang Harus Dibuat

- [ ] Submit incident to workflow
- [ ] Initial review queue
- [ ] Review comments
- [ ] Reject incident
- [ ] Request revision
- [ ] Approve classification
- [ ] Set investigation required / not required
- [ ] Assign investigator
- [ ] Assign investigation due date
- [ ] Workflow history
- [ ] Approval timeline

## Database / Tabel Minimal

- `workflow_instances`
- `workflow_instance_steps`
- `workflow_histories`
- `incident_review_records`
- `incident_investigator_assignments`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `POST /incidents/:id/review`
- `POST /incidents/:id/reject`
- `POST /incidents/:id/request-revision`
- `POST /incidents/:id/assign-investigator`
- `GET /incidents/:id/workflow`
- `GET /incidents/review-queue`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Initial Review Page/Queue
- Workflow Tab
- Review action buttons
- Assign investigator modal
- Workflow timeline
- My pending reviews widget

## Permission yang Dipakai

```text
incident.view
incident.review
incident.reject
incident.assign_investigator
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan


## Workflow / Status

```text
Submitted → Initial Review → Investigation Required / No Investigation Required → Investigator Assigned
```


## Validasi Backend

- [ ] Only assigned reviewer/authorized role can review
- [ ] Reject requires comment
- [ ] Request revision requires comment
- [ ] Investigator must have incident.investigate permission
- [ ] Investigation due date required if investigation required
- [ ] Cannot assign investigator for closed/cancelled incident

## Testing Minimal

- [ ] Reviewer can approve initial review
- [ ] Non-reviewer cannot approve
- [ ] Reject without comment fails
- [ ] Assign investigator success
- [ ] Investigator notification created
- [ ] Workflow history created
- [ ] Audit log created


## Output yang Harus Jadi

- Initial review workflow
- Investigator assignment
- Workflow timeline


## Acceptance Criteria

- [ ] Incident can enter workflow
- [ ] Reviewer can request revision/reject/assign investigator
- [ ] Workflow history is complete
- [ ] Notification sent to investigator
- [ ] Audit log created for all review actions

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 05: Initial Review & Workflow. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 05.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 05: Initial Review & Workflow
```
