# 00 — PROMPT AWAL PERMIT TO WORK UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management / HIRADC / JSA, dan Audit & Inspection sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Permit to Work / PTW**.

Baca seluruh file dalam folder `qhsse_permit_to_work_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_foundation_master_data.md`.
3. Gunakan core yang sudah ada:
   - Company / tenant
   - Site / project / department / location
   - Role & permission
   - Module ON/OFF
   - Master data
   - Workflow
   - Action tracking
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Dashboard
   - QR code engine jika sudah tersedia
   - API/webhook
4. Integrasikan dengan modul:
   - Risk Management / HIRADC / JSA
   - Training & Competency
   - Contractor Management
   - Asset & Equipment
   - Audit & Inspection
   - Document Control
5. Semua data wajib tenant-safe.
6. Semua API wajib permission-guarded.
7. Semua approval, activation, extension, suspension, dan close-out wajib masuk audit log.
8. PTW tidak boleh hanya menjadi form biasa. PTW harus punya lifecycle operasional.
9. Permit aktif harus bisa dilihat di Active Permit Board.
10. QR Permit harus bisa digunakan untuk verifikasi lapangan.
11. Setelah sequence selesai, tulis:
   `SELESAI PTW SEQUENCE XX: <nama sequence>`
12. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.
