# 00 — PROMPT AWAL DOCUMENT CONTROL UNTUK AI AGENT

Core Platform sudah stabil. Incident Management, Risk Management / HIRADC / JSA, Audit & Inspection, dan Permit to Work sudah selesai atau siap integrasi.

Sekarang mulai generate QHSSE Operational Module: **Document Control**.

Baca seluruh file dalam folder `qhsse_document_control_generating_pack`.

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
   - Attachment/evidence
   - Audit log
   - Notification
   - Numbering
   - Search
   - QR code engine jika tersedia
   - API/webhook
4. Document Control tidak boleh hanya upload file.
5. Harus ada revision control.
6. Harus ada review dan approval workflow.
7. Harus ada publish dan obsolete/archive.
8. Harus ada distribution dan acknowledgement.
9. Harus ada controlled copy.
10. Dokumen published harus immutable; perubahan harus melalui revision baru.
11. Download/view dokumen harus permission-aware.
12. Semua download, publish, revision, obsolete, dan export penting harus audit logged.
13. Setelah sequence selesai, tulis:
   `SELESAI DOCUMENT CONTROL SEQUENCE XX: <nama sequence>`
14. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.
