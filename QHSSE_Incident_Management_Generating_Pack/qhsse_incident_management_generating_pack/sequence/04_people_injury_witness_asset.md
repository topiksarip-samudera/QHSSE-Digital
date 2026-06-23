# Incident Management Sequence 04 — People, Injury, Witness & Asset Involved

## Tujuan

Mencatat korban, saksi, orang terlibat, contractor, vehicle, asset/equipment, property damage, dan injury detail.

## Fitur yang Harus Dibuat

- [ ] Involved persons
- [ ] Injured persons
- [ ] Witnesses
- [ ] Contractor involved
- [ ] Vehicle involved
- [ ] Equipment/asset involved
- [ ] Body part injured
- [ ] Injury type
- [ ] Treatment type
- [ ] Lost time days
- [ ] Restricted work days
- [ ] Property damage
- [ ] Estimated damage cost
- [ ] Environmental impact detail

## Database / Tabel Minimal

- `incident_people`
- `incident_injuries`
- `incident_witnesses`
- `incident_assets`
- `incident_vehicles`
- `incident_property_damages`
- `incident_environmental_impacts`

Catatan database:
- Tambahkan `company_id` untuk semua tabel tenant-specific.
- Tambahkan `site_id`, `department_id`, `location_id` jika relevan.
- Tambahkan `created_by`, `updated_by`, `created_at`, `updated_at`.
- Gunakan `deleted_at` untuk soft delete pada data penting.
- Tambahkan index untuk `company_id`, `incident_id`, `status`, dan `created_at`.

## API Minimal

- `GET /incidents/:id/people`
- `POST /incidents/:id/people`
- `PATCH /incidents/:id/people/:personId`
- `DELETE /incidents/:id/people/:personId`
- `GET /incidents/:id/injuries`
- `POST /incidents/:id/injuries`
- `GET /incidents/:id/assets`
- `POST /incidents/:id/assets`
- `GET /incidents/:id/witnesses`
- `POST /incidents/:id/witnesses`

Semua API memakai prefix `/api/v1`.

## Frontend Minimal

- People/Injury/Witness Tab
- Involved person form
- Injury detail form
- Witness statement summary
- Asset/equipment involved section
- Vehicle involved section
- Property damage section

## Permission yang Dipakai

```text
incident.view
incident.update
incident.investigate
```

## Integrasi Core Platform

- Tenant/company guard
- Role & permission
- Audit log
- Attachment jika relevan
- Notification jika relevan



## Validasi Backend

- [ ] Person can be internal user or external free text
- [ ] Injury classification required if injured person exists
- [ ] Lost time days cannot be negative
- [ ] Damage cost cannot be negative
- [ ] Asset must belong to same company if selected from asset register
- [ ] Contractor must belong to same company if selected

## Testing Minimal

- [ ] Add injured person
- [ ] Add witness
- [ ] Add asset involved
- [ ] Invalid cross-company asset rejected
- [ ] Negative lost time days rejected
- [ ] Permission denied test
- [ ] Audit log created for changes


## Output yang Harus Jadi

- Complete people and injury data
- Asset/equipment/vehicle involvement data
- Lost time data source for KPI


## Acceptance Criteria

- [ ] Incident can store injured persons and witnesses
- [ ] Incident can link asset/equipment/vehicle
- [ ] Cross-company references are rejected
- [ ] Data appears in incident detail
- [ ] Changes are audited

## Prompt untuk AI Agent

```text
Implementasikan Incident Management Sequence 04: People, Injury, Witness & Asset Involved. Selesaikan sesuai acceptance criteria lalu tulis SELESAI INCIDENT SEQUENCE 04.

Aturan:
- Jangan lanjut sequence berikutnya.
- Pastikan database, backend, frontend, permission, audit log, dan test selesai.
- Akhiri dengan: SELESAI INCIDENT SEQUENCE 04: People, Injury, Witness & Asset Involved
```
