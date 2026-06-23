# 10 — Audit Log QA

## Tujuan

Memastikan semua aktivitas penting tercatat dan audit log tidak bisa dimodifikasi sembarangan.

## Checklist QA

- [ ] Create record tercatat.
- [ ] Update record menyimpan old/new value.
- [ ] Delete/archive tercatat.
- [ ] Login/logout/failed login tercatat.
- [ ] Approve/reject workflow tercatat.
- [ ] Upload/download file tercatat jika diwajibkan.
- [ ] Permission change tercatat.
- [ ] Module setting change tercatat.
- [ ] Master data change tercatat.
- [ ] Export audit log tercatat.
- [ ] Audit log tidak bisa diedit.
- [ ] Hanya role tertentu bisa melihat audit log.

## Expected Result

- Audit log lengkap dan immutable.
- Tidak ada critical action tanpa log.
- Export audit log juga dilog.

## Command / Test yang Disarankan

```bash
npm run test -- audit
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
SELESAI QA STEP: 10 — Audit Log QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
