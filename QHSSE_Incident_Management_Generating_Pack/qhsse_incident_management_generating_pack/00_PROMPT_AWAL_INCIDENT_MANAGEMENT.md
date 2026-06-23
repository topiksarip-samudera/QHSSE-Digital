# 00 — PROMPT AWAL INCIDENT MANAGEMENT UNTUK AI AGENT

Core Platform sudah selesai dan Stabilization & QA sudah GO.

Sekarang mulai generate QHSSE Operational Module pertama: **Incident Management**.

Baca seluruh file dalam folder `qhsse_incident_management_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Selesaikan satu sequence sampai database, backend, frontend, permission, audit log, test, dan acceptance criteria terpenuhi.
4. Setelah sequence selesai, tulis `SELESAI INCIDENT SEQUENCE <nomor>`.
5. Jangan lanjut sequence berikutnya sebelum diminta.
6. Gunakan Core Platform yang sudah tersedia:
   - tenant/company
   - site/department/location
   - role & permission
   - module ON/OFF
   - master data
   - workflow
   - action tracking
   - attachment/evidence
   - audit log
   - notification
   - numbering
   - dashboard
   - comments
7. Jangan hardcode master data, workflow, severity matrix, numbering, atau permission.
8. Semua API harus dicek permission dan tenant isolation.
9. Semua critical action harus masuk audit log.
10. Semua file evidence harus aman dan tidak public tanpa permission.
11. Semua status perubahan penting harus memicu workflow/audit log/notification jika relevan.
12. Setelah sequence 12 selesai dan QA lulus, tulis `INCIDENT MANAGEMENT STABILIZED: GO`.

Mulai sekarang hanya kerjakan sequence pertama: Foundation & Master Data.
