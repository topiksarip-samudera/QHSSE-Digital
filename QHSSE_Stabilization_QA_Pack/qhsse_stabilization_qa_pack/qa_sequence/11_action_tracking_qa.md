# 11 — Action Tracking QA

## Tujuan

Menguji action tracking sebagai engine follow-up untuk semua modul QHSSE.

## Checklist QA

- [ ] Create action manual berhasil.
- [ ] Assign PIC wajib.
- [ ] Due date wajib.
- [ ] Priority/status berjalan.
- [ ] PIC bisa update progress.
- [ ] PIC bisa upload evidence.
- [ ] Submit for verification berjalan.
- [ ] Verifier bisa approve close.
- [ ] Verifier bisa reject close.
- [ ] Overdue dihitung otomatis.
- [ ] Notification assigned/overdue berjalan.
- [ ] User tanpa permission tidak bisa close/verify.
- [ ] Action dari modul lain bisa linked jika sudah tersedia.

## Expected Result

- Action lifecycle berjalan end-to-end.
- Overdue akurat.
- Evidence dan comment terhubung.
- Permission berjalan.

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
SELESAI QA STEP: 11 — Action Tracking QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
