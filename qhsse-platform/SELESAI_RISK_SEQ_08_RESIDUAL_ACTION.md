# SELESAI RISK SEQUENCE 08: Residual Risk, Action Plan & Control Effectiveness

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (1 table)
- `risk_action_links` — Bridge risk register ↔ action tracking core (mitigation/verification/review)

### Backend API (`/api/v1/risks`)
- `POST /:id/residual` — Calculate & save residual risk (severity×likelihood→score/level from matrix)
- `GET /:id/actions` — Get linked actions (mitigation, verification, review)
- `POST /:id/actions` — Link action from Action Tracking core to risk
- `DELETE /:id/actions/:linkId` — Unlink action

### Risk Calculation Flow
```
Initial Risk: severity × likelihood → initialScore/initialLevel
       ↓ (after controls)
Residual Risk: residualSeverity × residualLikelihood → residualScore/residualLevel
       ↓ (if residual still high)
Action Plan → Link to Action Tracking core
```

### Integration
- Bridges Risk → Action Tracking core (reuses existing action CRUD, verification, comments)
- Residual calculation uses company's risk_matrix for level mapping

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
