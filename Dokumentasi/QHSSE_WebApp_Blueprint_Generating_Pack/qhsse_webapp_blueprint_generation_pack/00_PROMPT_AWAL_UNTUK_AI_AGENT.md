# PROMPT AWAL SINGKAT UNTUK AI AGENT

Ekstrak dan baca seluruh file dalam folder `qhsse_webapp_blueprint_generation_pack`.

Tugas kamu adalah membangun WebApp QHSSE sesuai blueprint secara sequence.

Aturan wajib:
1. Jangan langsung generate semua sekaligus.
2. Mulai dari `01_MASTER_BLUEPRINT.md`, lalu `02_REKOMENDASI_STACK_DAN_ARSITEKTUR.md`, lalu `03_GENERATING_RULES_GLOBAL.md`.
3. Setelah memahami blueprint, mulai Phase 1 dari `phase_1_core_wajib/00_PHASE_1_SEQUENCE.md`.
4. Selesaikan satu core sampai database, backend API, frontend UI, permission, audit log, test, dan acceptance criteria terpenuhi.
5. Setelah satu core selesai, berikan status `SELESAI CORE: <nama core>` dan jangan lanjut core berikutnya sebelum diminta.
6. Gunakan prinsip modular, multi-tenant, secure-by-default, audit-log-by-default, dan permission-check-in-backend.
7. Jangan hardcode workflow, master data, checklist, form, role, dan module access jika bisa dibuat dinamis.
8. Semua fitur harus siap ON/OFF per company, role, package, dan module jika relevan.
9. Buat kode production-grade, bukan prototype kosong.
10. Jika ada pilihan teknis, gunakan rekomendasi dalam file stack dan arsitektur.

Mulai dengan membuat rencana implementasi Phase 1 dan scaffold project sesuai blueprint.
