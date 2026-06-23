# Incident Management Sequence 01 — Foundation & Master Data

## Tujuan

Menyiapkan fondasi modul Incident Management: module registration, permission, numbering, settings, master data, dan workflow template awal.

## Fitur yang Harus Dibuat

- [ ] Register Incident Management sebagai module operational
- [ ] Enable/disable Incident Management per company
- [ ] Register incident permissions
- [ ] Register incident numbering rule
- [ ] Incident settings per company
- [ ] Incident severity matrix configurable
- [ ] Incident type master data
- [ ] Incident category master data
- [ ] Incident consequence master data
- [ ] Incident status master data
- [ ] Loss type master data
- [ ] Injury classification master data
- [ ] Root cause category master data
- [ ] Default workflow template
- [ ] Default notification template

## Database / Tabel Minimal

- `modules`
- `module_features`
- `tenant_modules`
- `permissions`
- `numbering_rules`
- `master_data_groups`
- `master_data_items`
- `incident_settings`
- `workflows`
- `workflow_steps`
- `notification_templates`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incident/settings`
- `PATCH /incident/settings`
- `GET /incident/master-data`
- `POST /incident/master-data/seed-defaults`
- `GET /companies/:companyId/modules/incident`
- `PATCH /companies/:companyId/modules/incident`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- Incident Settings Page
- Incident Master Data Page
- Severity Matrix Config Page
- Incident module ON/OFF config
- Permission-aware menu registration

## Permission yang Dipakai

```text
incident.view
incident.create
incident.update
incident.manage_settings
incident.export
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan



## Validasi Backend

- [ ] Company must exist
- [ ] Only authorized admin can update incident settings
- [ ] Severity matrix must have valid levels
- [ ] Numbering format must be unique per company/module
- [ ] Master data item code must be unique within group/company

## Testing Minimal

- [ ] Seed default incident master data
- [ ] Module ON/OFF works
- [ ] Settings update requires permission
- [ ] Company A settings not visible to Company B
- [ ] Audit log created for settings update


## Output yang Harus Jadi

- Incident module registered
- Permissions available
- Master data available
- Default workflow template available
- Default numbering format available


## Acceptance Criteria

- [ ] Incident Management can be enabled/disabled per company
- [ ] Incident menu appears only when module is enabled
- [ ] Default incident master data is available
- [ ] Settings are tenant-isolated
- [ ] Settings changes are audited

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 01: Foundation & Master Data. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 01.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 01: Foundation & Master Data
```
