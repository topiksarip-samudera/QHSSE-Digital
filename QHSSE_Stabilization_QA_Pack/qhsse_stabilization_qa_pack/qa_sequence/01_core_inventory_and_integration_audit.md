# 01 — Core Inventory & Integration Audit

## Tujuan

Memastikan semua Core Platform yang sudah dibuat benar-benar ada, terhubung, dan tidak hanya berupa scaffold kosong.

## Checklist QA

- [ ] Buat daftar semua core yang sudah dibuat.
- [ ] Cek setiap core memiliki database, backend, frontend, permission, audit log, dan test.
- [ ] Cek dependency antar core: user-role-company-site-workflow-notification-attachment-audit log-action.
- [ ] Cek tidak ada modul yang hanya UI tanpa API.
- [ ] Cek tidak ada API tanpa permission guard.
- [ ] Cek naming convention konsisten.
- [ ] Cek semua route memakai `/api/v1` jika standar itu dipakai.
- [ ] Cek .env.example lengkap.
- [ ] Cek Docker Compose bisa menjalankan DB, Redis, MinIO, Web, API.

## Expected Result

- Semua core terdaftar jelas.
- Gap/core yang belum lengkap terdeteksi.
- Tidak ada core critical yang kosong.
- Ada daftar dependency dan integrasi antar core.

## Command / Test yang Disarankan

```bash
npm run lint
npm run test
npm run build
```

## Bug Rules

- Jika ada P0/P1, perbaiki sebelum lanjut.
- Setelah fix, jalankan regression test.
- Catat bug di BUG_REGISTER.md.
- Catat fix di FIX_LOG.md.

## Output Wajib

Buat/update report:

```text
QA_SUMMARY.md
BUG_REGISTER.md
FIX_LOG.md jika ada fix
```

## Format Status Akhir

```text
SELESAI QA STEP: 01 — Core Inventory & Integration Audit
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
