# Incident Management Sequence 09 — Evidence, Attachment, Comment & Timeline

## Tujuan

Melengkapi incident dengan evidence aman, comment thread, internal note, timeline, activity history, dan audit trail tab.

## Fitur yang Harus Dibuat

- [ ] Photo evidence
- [ ] Video evidence
- [ ] Document evidence
- [ ] Attachment tab
- [ ] Evidence description
- [ ] Evidence category
- [ ] Evidence metadata
- [ ] Download evidence with permission
- [ ] Comment thread
- [ ] Internal note
- [ ] Mention user
- [ ] Incident timeline
- [ ] Activity history
- [ ] Audit trail tab

## Database / Tabel Minimal

- `attachments`
- `file_links`
- `comments`
- `comment_mentions`
- `audit_logs`
- `incident_timeline_events`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/:id/attachments`
- `POST /incidents/:id/attachments`
- `DELETE /incidents/:id/attachments/:attachmentId`
- `GET /incidents/:id/comments`
- `POST /incidents/:id/comments`
- `GET /incidents/:id/timeline`
- `GET /incidents/:id/audit-logs`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Evidence Tab
- Attachment uploader
- Attachment preview/download
- Comment Tab
- Internal note option
- Timeline Tab
- Audit Trail Tab

## Permission yang Dipakai

```text
incident.view
incident.update
incident.upload_evidence
incident.download_evidence
incident.comment
incident.view_audit
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan



## Validasi Backend

- [ ] File type must be allowed
- [ ] File size within company/package limit
- [ ] Download requires permission
- [ ] Attachment must belong to same incident/company
- [ ] Internal note hidden from contractor if configured
- [ ] Mentioned user must belong to same company or allowed scope

## Testing Minimal

- [ ] Upload allowed file success
- [ ] Upload forbidden file rejected
- [ ] Company A cannot download Company B evidence
- [ ] Unauthorized download rejected
- [ ] Comment mention creates notification
- [ ] Internal note hidden from contractor
- [ ] Timeline records key events


## Output yang Harus Jadi

- Evidence management
- Comment collaboration
- Timeline
- Audit trail visibility


## Acceptance Criteria

- [ ] Incident evidence can be uploaded securely
- [ ] Evidence cannot be accessed without permission
- [ ] Comments and mentions work
- [ ] Timeline shows major incident events
- [ ] Audit trail tab displays relevant logs

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 09: Evidence, Attachment, Comment & Timeline. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 09.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 09: Evidence, Attachment, Comment & Timeline
```
