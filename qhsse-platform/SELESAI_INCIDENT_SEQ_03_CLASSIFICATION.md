# SELESAI INCIDENT SEQUENCE 03: Classification & Severity

**Date:** 2026-06-22 | **Tests:** 480 cumulative (+1 classify test, 41 files)

## Features

### Database (3 new tables + extended Incident)
- `Incident` extended — incidentTypeId, categoryId, actual/potential severity, actual/potential consequence, isHighSeverity, isRepeat
- `incident_classifications` — Who classified, review status, notes
- `incident_impacts` — Multi-dimension impacts (people/environment/asset/security/quality/reputation/legal)
- `incident_repeat_links` — Link related/repeat incidents

### Backend API
- `GET /:id/classification` — Full classification detail (incident fields + impacts + repeat links)
- `PATCH /:id/classification` — Classify incident, auto-set isHighSeverity, auto-transitions draft→submitted
- `POST /:id/classification/review` — Reviewer sign-off with timestamp
- `GET /:id/related-incidents` — Linked incidents

### Business Rules
- High severity auto-detection (actualSeverity or potentialSeverity in [high, critical])
- Classification pushes draft status to submitted
- Impacts replace existing on update (deleteMany + batch create)
- Review sign-off with timestamp

**Build:** API ✅ | Web ✅ | **Tests:** 480/480 PASS
