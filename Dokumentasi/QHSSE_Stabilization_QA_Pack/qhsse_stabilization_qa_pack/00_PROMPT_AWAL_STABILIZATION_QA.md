# 00 — PROMPT AWAL STABILIZATION & QA UNTUK AI AGENT

Core Platform sudah selesai dibuat.

Sekarang lakukan tahap Stabilization & QA sebelum lanjut ke QHSSE Operational Modules.

Baca seluruh file dalam folder `qhsse_stabilization_qa_pack`.

Aturan wajib:

1. Jangan membuat modul QHSSE operational dulu.
2. Jangan lanjut ke Incident, Risk, Audit, Permit, Document, Training, Legal, Environment, Quality, Security, Contractor, atau Emergency.
3. Fokus hanya menstabilkan Core Platform.
4. Ikuti `01_STABILIZATION_QA_MASTER_PLAN.md`.
5. Kerjakan sequence di folder `qa_sequence/` satu per satu.
6. Jika menemukan bug, perbaiki bug tersebut.
7. Setelah perbaikan, jalankan regression test.
8. Buat QA report.
9. Jika semua gate lulus, tulis `CORE PLATFORM STABILIZED: GO`.
10. Jika belum lulus, tulis `CORE PLATFORM STABILIZED: NO-GO` disertai daftar masalah yang harus diperbaiki.

Mulai dari mengecek:

- Tenant isolation
- Authentication/session
- Role/permission/scope
- Module ON/OFF
- Master data
- Workflow
- Notification
- Attachment/evidence
- Audit log
- Action tracking
- Form/checklist builder jika sudah ada
- API contract
- Database integrity
- Frontend UX
- Test coverage
- Performance baseline
