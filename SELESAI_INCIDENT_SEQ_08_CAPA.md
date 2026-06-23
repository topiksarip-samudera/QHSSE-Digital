# SELESAI INCIDENT SEQUENCE 08: CAPA

**Date:** 2026-06-23 | **Tests:** 486 cumulative (41 files)

## Features

### Database (2 new tables)
- `incident_action_links` — Links incident to core Action Tracking (corrective/preventive)
- `incident_capa_effectiveness_reviews` — Unique effectiveness review per incident

### Backend API (4 endpoints)
- `GET /:id/capa` — All linked actions + effectiveness review
- `POST /:id/capa` — Create corrective/preventive action (links to incident via action_links)
- `GET /:id/capa/effectiveness` — Get effectiveness review
- `POST /:id/capa/effectiveness-review` — Submit/update effectiveness review (upsert)

### Integration
- Bridges Incident ↔ Action Tracking core
- Actions created via existing `action` table
- Action verification flow delegated to action-tracking endpoints

**Build:** API ✅ | Web ✅ | **Tests:** 486/486 PASS
