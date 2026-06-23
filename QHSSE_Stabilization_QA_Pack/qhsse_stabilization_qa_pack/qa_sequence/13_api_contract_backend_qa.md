# 13 — API Contract & Backend QA

## Tujuan

Memastikan API konsisten, tervalidasi, dan siap dipakai frontend serta integrasi.

## Checklist QA

- [ ] Semua API memakai prefix standar.
- [ ] Response success konsisten.
- [ ] Response error konsisten.
- [ ] Pagination konsisten.
- [ ] Filter/search/sort konsisten.
- [ ] DTO validation berjalan.
- [ ] Unauthorized return 401.
- [ ] Forbidden return 403.
- [ ] Not found return 404.
- [ ] Validation error return 400.
- [ ] Rate limit jika ada berjalan.
- [ ] API docs/OpenAPI jika ada update.

## Expected Result

- API contract stabil.
- Frontend tidak perlu handle banyak format berbeda.
- Error mudah dibaca dan aman.

## Command / Test yang Disarankan

```bash
npm run test -- api
npm run test:e2e -- api
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
SELESAI QA STEP: 13 — API Contract & Backend QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
