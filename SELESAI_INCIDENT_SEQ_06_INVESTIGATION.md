# SELESAI INCIDENT SEQUENCE 06: Investigation

**Date:** 2026-06-23 | **Tests:** 486 cumulative (+1 investigation test, 41 files)

## Features

### Database (6 new tables)
- `incident_investigations` — Core investigation (scene condition, direct/immediate/basic cause, conclusion)
- `incident_investigation_teams` — Team members with roles (team_leader, investigator, sme, hse_rep, management)
- `incident_chronologies` — Event timeline with source tracking
- `incident_interviews` — Interview records (interviewee, interviewer, summary, notes)
- `incident_failed_barriers` — Physical/procedural/behavioral/organizational/technical barriers
- `incident_investigation_findings` — Investigation findings (people/process/equipment/environment/management)

### Backend API (9 endpoints)
- `GET /:id/investigation` — Full investigation with team, chronology, interviews, barriers, findings
- `POST /:id/investigation/start` — Start investigation, auto-creates team leader
- `PATCH /:id/investigation` — Update causes, scene condition, conclusion
- `POST /:id/investigation/team` — Add team member
- `POST /:id/investigation/chronology` — Add timeline event
- `POST /:id/investigation/interviews` — Record interview
- `POST /:id/investigation/barriers` — Record failed barrier
- `POST /:id/investigation/findings` — Record finding
- `POST /:id/investigation/submit` — Submit → rca_completed status

**Build:** API ✅ | Web ✅ | **Tests:** 486/486 PASS
