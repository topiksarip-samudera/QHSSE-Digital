# 18 — Bug Fix & Regression

## Tujuan

Memperbaiki semua bug P0/P1 dan menjalankan regression sebelum release gate.

## Checklist QA

- [ ] Review BUG_REGISTER.md.
- [ ] Prioritaskan P0 lalu P1.
- [ ] Fix bug satu per satu.
- [ ] Tulis root cause.
- [ ] Tulis file yang diubah.
- [ ] Jalankan test terkait.
- [ ] Jalankan regression core critical.
- [ ] Pastikan bug tidak muncul lagi.
- [ ] Update status bug.

## Expected Result

- P0 = 0.
- P1 = 0.
- Regression lulus.
- Fix log lengkap.

## Command / Test yang Disarankan

```bash
npm run lint
npm run test
npm run test:e2e
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
SELESAI QA STEP: 18 — Bug Fix & Regression
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
