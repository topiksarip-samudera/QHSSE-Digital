# PROMPT AWAL RISK MANAGEMENT / HIRADC / JSA

Core Platform sudah stabil dan Incident Management sudah selesai atau siap diintegrasikan.

Sekarang generate module **Risk Management / HIRADC / JSA**.

Baca seluruh folder `qhsse_risk_management_hiradc_jsa_generating_pack`.

Aturan wajib:
1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan Core Platform: tenant, site, department, role permission, module ON/OFF, master data, workflow, action tracking, attachment, notification, audit log, numbering, dashboard, comments.
4. Risk matrix harus dynamic/configurable, bukan hardcode.
5. Severity, likelihood, risk level, hazard, consequence, control type, hierarchy of control harus master data/configurable.
6. HIRADC harus berbasis aktivitas dan hazard row.
7. JSA harus berbasis job step.
8. Semua data wajib tenant-safe dengan `company_id`.
9. Semua API wajib permission guard.
10. Semua perubahan risk rating, matrix, control, approval harus audit log.

Kerjakan sequence pertama saja. Setelah selesai tulis:

```text
SELESAI RISK SEQUENCE 01: Foundation & Master Data
```

Jangan lanjut sequence berikutnya sebelum saya minta continue.
