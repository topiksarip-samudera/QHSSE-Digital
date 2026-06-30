# SELESAI ENVIRONMENT SEQUENCE 02: Aspect & Impact Register

**Date:** 2026-06-24 | **Tests:** 492/492 PASS

## Features

### Database (2 tables)
- `environment_aspects` — significance, legalConcern, stakeholderConcern, responsibleId
- `environment_impacts` — severity, likelihood

### Backend API (`/api/v1/environment`)
- `POST /aspects` — Create aspect
- `GET /aspects` — List all aspects
- `GET /aspects/:id` — Get aspect by ID
- `PATCH /aspects/:id` — Update aspect
- `DELETE /aspects/:id` — Delete aspect
- `POST /impacts` — Create impact
- `GET /impacts` — List all impacts
- `GET /impacts/:id` — Get impact by ID
- `PATCH /impacts/:id` — Update impact
- `DELETE /impacts/:id` — Delete impact
- `GET /aspects/:id/significance` — Calculate significance score

### Business Rules
- ✅ Significance = legal concern + stakeholder concern + severity scoring
- ✅ Impact severity and likelihood auto-weighted into significance
- ✅ Tenant isolation enforced on all queries

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
