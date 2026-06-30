# SELESAI PTW SEQUENCE 05: JSA & Risk Assessment Integration

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Database (2 tables)
- **permit_jsa_links** — Bridges PTW to JSA module
- **permit_risk_links** — Bridges PTW to HIRADC module

### Backend API
- POST /permits/:id/jsa — Link JSA
- POST /permits/:id/risk — Link risk assessment
- GET /permits/:id/links — List all links
- DELETE /permits/:id/jsa/:linkId — Unlink JSA
- DELETE /permits/:id/risk/:linkId — Unlink risk

### Business Rules
- Bridge PTW ↔ JSA/HIRADC modules
- Unique constraint per permit + link combination

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
