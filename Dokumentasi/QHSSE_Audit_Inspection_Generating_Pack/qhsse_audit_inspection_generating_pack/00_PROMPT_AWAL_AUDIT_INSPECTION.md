# 00 — PROMPT AWAL AUDIT & INSPECTION UNTUK AI AGENT

Core Platform sudah stabil. Incident Management dan Risk Management / HIRADC / JSA sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Audit & Inspection**.

Baca seluruh file dalam folder `qhsse_audit_inspection_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core yang sudah ada:
   - Company / tenant
   - Site / department / location
   - Role & permission
   - Module ON/OFF
   - Master data
   - Workflow
   - Checklist builder
   - Form builder jika tersedia
   - Action tracking
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Dashboard
   - API/webhook
4. Semua data wajib tenant-safe.
5. Semua API wajib permission-guarded.
6. Semua action penting wajib audit log.
7. Semua finding harus bisa menghasilkan action.
8. Checklist execution harus menyimpan versi checklist yang digunakan.
9. Audit dan inspection harus bisa berjalan terpisah tetapi memakai engine finding/action yang sama.
10. Setelah sequence selesai, tulis:
   `SELESAI AUDIT INSPECTION SEQUENCE XX: <nama sequence>`
11. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.
