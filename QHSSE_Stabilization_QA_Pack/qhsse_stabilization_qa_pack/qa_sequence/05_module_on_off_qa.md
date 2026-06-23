# 05 — Module ON/OFF QA

## Tujuan

Memastikan module dan feature flag benar-benar mempengaruhi UI dan API.

## Checklist QA

- [ ] Matikan module Incident/Risk dummy atau module test.
- [ ] Pastikan menu module hilang dari sidebar.
- [ ] Pastikan direct route frontend ditolak/redirect.
- [ ] Pastikan API module OFF mengembalikan error yang benar.
- [ ] Pastikan core modules tidak bisa dimatikan jika diset mandatory.
- [ ] Pastikan subfeature OFF menyembunyikan UI dan menolak API terkait.
- [ ] Pastikan perubahan module setting tercatat audit log.
- [ ] Pastikan package/plan gating jika sudah ada tidak bisa dibypass.

## Expected Result

- Module OFF berlaku di UI dan API.
- Tidak ada endpoint module OFF yang tetap bisa dipakai.
- Mandatory core tetap aktif.
- Audit log tercatat.

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
SELESAI QA STEP: 05 — Module ON/OFF QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
