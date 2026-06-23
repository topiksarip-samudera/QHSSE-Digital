# Incident Management Sequence 10 — Notification, Escalation & Lessons Learned

## Tujuan

Membangun notifikasi otomatis, escalation rules, dan lessons learned untuk incident.

## Fitur yang Harus Dibuat

- [ ] Incident submitted notification
- [ ] High severity notification
- [ ] Reviewer assigned notification
- [ ] Investigator assigned notification
- [ ] CAPA assigned notification
- [ ] CAPA overdue notification
- [ ] Incident close notification
- [ ] Escalation rules
- [ ] Lessons learned record
- [ ] Lessons learned publication
- [ ] Lessons learned acknowledgement
- [ ] Lessons learned distribution list

## Database / Tabel Minimal

- `notifications`
- `notification_templates`
- `notification_logs`
- `incident_escalation_rules`
- `incident_lessons_learned`
- `incident_lessons_learned_acknowledgements`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incident/escalation-rules`
- `PATCH /incident/escalation-rules`
- `GET /incidents/:id/lessons-learned`
- `POST /incidents/:id/lessons-learned`
- `POST /incidents/:id/lessons-learned/publish`
- `POST /incidents/:id/lessons-learned/acknowledge`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Escalation Settings Page
- Lessons Learned Tab
- Publish lessons learned action
- Acknowledgement status
- Notification template mapping

## Permission yang Dipakai

```text
incident.view
incident.manage_settings
incident.lessons_learned
incident.publish_lessons_learned
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan



## Validasi Backend

- [ ] High severity notification recipients must be configured
- [ ] Lessons learned required for high severity if setting enabled
- [ ] Only authorized role can publish lessons learned
- [ ] Acknowledgement only by targeted users

## Testing Minimal

- [ ] High severity sends notification
- [ ] Investigator assignment sends notification
- [ ] CAPA overdue sends notification
- [ ] Publish lessons learned success
- [ ] Acknowledgement works
- [ ] Unauthorized publish rejected
- [ ] Audit log created


## Output yang Harus Jadi

- Incident notification events
- Escalation configuration
- Lessons learned publication
- Acknowledgement tracking


## Acceptance Criteria

- [ ] High severity incident auto-notifies correct roles
- [ ] Lessons learned can be published
- [ ] Target users can acknowledge lessons learned
- [ ] Escalation rule changes are audited

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 10: Notification, Escalation & Lessons Learned. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 10.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 10: Notification, Escalation & Lessons Learned
```
