# SELESAI RISK SEQUENCE 11: Dashboard, Heatmap, KPI & Reporting

**Date:** 2026-06-23 | **Tests:** 492 cumulative (42 files)

## Features

### Backend API (`/api/v1/risks`)
- `GET /dashboard` — Risk overview (total, draft, submitted, approved, high/extreme counts, overdue reviews, by-level breakdown)
- `GET /heatmap` — Risk heatmap data (matrix cells + risk frequency per severity×likelihood cell)
- `GET /export?format=csv` — Export up to 1000 risks

### Frontend
- **Dashboard** (`/dashboard/risk/heatmap`) — Stat cards (total/draft/submitted/approved/high/extreme/overdue), by-level bar

### Data Sources
- Risk counts by status, risk level (using Prisma groupBy)
- Heatmap frequency mapping (severity-likelihood grid)
- Matrix integration for visual reference

**Build:** API ✅ | Web ✅ | **Tests:** 492/492 PASS
