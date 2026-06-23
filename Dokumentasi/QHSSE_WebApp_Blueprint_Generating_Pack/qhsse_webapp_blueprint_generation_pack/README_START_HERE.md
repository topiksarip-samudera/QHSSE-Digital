# START HERE — QHSSE WebApp Blueprint & Generating Pack

Tanggal: 2026-06-21  
Project: QHSSE Integrated Management System WebApp

Paket ini dibuat untuk membantu AI Agent di VS Code menghasilkan WebApp QHSSE secara terstruktur, tidak lompat-lompat, dan tidak meninggalkan core penting.

## Rekomendasi Cara Pakai

Gunakan **mode sequence**. Jangan langsung generate semua modul sekaligus.

Urutan terbaik:

1. Baca `00_PROMPT_AWAL_UNTUK_AI_AGENT.md`
2. Baca `01_MASTER_BLUEPRINT.md`
3. Baca `02_REKOMENDASI_STACK_DAN_ARSITEKTUR.md`
4. Baca `03_GENERATING_RULES_GLOBAL.md`
5. Generate project foundation.
6. Lanjutkan `phase_1_core_wajib/00_PHASE_1_SEQUENCE.md`
7. Selesaikan satu core, jalankan test, baru lanjut core berikutnya.
8. Setelah Phase 1 selesai dan stabil, lanjut Phase 2.
9. Setelah Phase 2 selesai dan stabil, lanjut Phase 3.
10. Setelah semua phase selesai, gunakan folder `qa_acceptance/` untuk validasi akhir.

## Kenapa Harus Split

Project QHSSE terlalu besar jika digenerate sekaligus. Risiko jika tidak split:

- Struktur database berantakan.
- Permission tidak konsisten.
- Workflow tidak reusable.
- Modul QHSSE jadi hardcoded.
- Multi-tenant mudah bocor data.
- AI agent lupa acceptance criteria.
- UI tidak konsisten.
- Testing tidak lengkap.

## Strategi Terbaik

Gunakan struktur:

```text
Phase 1 = Core wajib agar sistem bisa dipakai
Phase 2 = Core advanced agar sistem bisa dikustom
Phase 3 = Core enterprise agar sistem siap SaaS besar
```

## Output yang Ditargetkan

WebApp QHSSE modular dengan:

- Multi-company / multi-tenant
- Multi-site / multi-project
- Role, permission, dan scope access
- Module ON/OFF
- Master data dinamis
- Workflow approval engine
- Form builder
- Checklist builder
- Action tracking
- Attachment evidence
- Audit trail
- Notification
- API key
- Webhook
- Dashboard builder
- SSO, MFA, advanced permission
- Billing SaaS
- AI Governance
- Offline PWA
- Integration center
- Enterprise reporting
