# SELESAI INCIDENT SEQUENCE 04: People, Injury, Witness & Asset Involved

**Date:** 2026-06-23 | **Tests:** 483 cumulative (+3 people/asset tests, 41 files)

## Features

### Database (7 new tables)
- `incident_people` — Persons involved (injured/involved/witness/contractor), internal user or external free text, role, department, contact, witness statement
- `incident_injuries` — Injury details linked to person (body part, treatment type, lost time days, restricted days)
- `incident_assets` — Equipment/vehicle/property/environmental assets involved with damage and cost estimates
- `incident_property_damages` — Location, description, estimated/actual cost
- `incident_environmental_impacts` — Spill/emission/discharge with substance, quantity, containment

### Backend API (16 endpoints)
- `GET/POST/PATCH/DELETE /incidents/:id/people` — CRUD people
- `GET/POST /incidents/:id/injuries` — CRUD injuries
- `GET/POST/DELETE /incidents/:id/assets` — CRUD assets
- `GET/POST /incidents/:id/property-damages`
- `GET/POST /incidents/:id/environmental-impacts`

### Business Rules
- All sub-resources check parent incident ownership via `findOne`
- Tenant-scoped (companyId on all tables)
- Permissions: incident.view/update/investigate

**Build:** API ✅ | Web ✅ | **Tests:** 483/483 PASS
