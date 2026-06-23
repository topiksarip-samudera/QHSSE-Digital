# START HERE — Risk Management / HIRADC / JSA Generating Pack

Paket ini digunakan setelah **Core Platform + Stabilization & QA + Incident Management**.

## Rekomendasi Split

Risk Management / HIRADC / JSA sebaiknya di-split menjadi **12 sequence**:

```text
01 Foundation & Master Data
02 Risk Register Core
03 Hazard Identification & Consequence Library
04 Risk Matrix & Risk Calculation Engine
05 HIRADC / HIRARC Builder
06 JSA / JHA Builder
07 Control Management & Hierarchy of Control
08 Residual Risk, Action Plan & Control Effectiveness
09 Risk Review, Approval Workflow & Change History
10 Cross-Module Integration
11 Dashboard, Heatmap, KPI & Reporting
12 QA, Test, Permission & Stabilization
```

## Cara Pakai

1. Extract ZIP ke project.
2. Baca `00_PROMPT_AWAL_RISK_MANAGEMENT.md`.
3. Baca `01_RISK_MANAGEMENT_MASTER_BLUEPRINT.md`.
4. Baca `02_RISK_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_foundation_master_data.md`.
6. Kerjakan satu sequence sampai selesai.
7. Setelah selesai tulis `SELESAI RISK SEQUENCE XX`.
8. Jangan lanjut sequence berikutnya sebelum diminta.
9. Setelah sequence 12 lulus, tulis `RISK MANAGEMENT STABILIZED: GO`.
