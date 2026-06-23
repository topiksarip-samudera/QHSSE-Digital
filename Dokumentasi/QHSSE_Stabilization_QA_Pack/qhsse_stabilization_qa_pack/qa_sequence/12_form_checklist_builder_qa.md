# 12 — Form & Checklist Builder QA

## Tujuan

Menguji form builder dan checklist builder jika sudah masuk Core Platform.

## Checklist QA

- [ ] Buat form dengan text/number/date/dropdown/file/signature/user picker.
- [ ] Cek required field frontend dan backend.
- [ ] Cek conditional field.
- [ ] Cek repeatable field.
- [ ] Publish form dan pastikan versi terkunci.
- [ ] Submit form dan simpan form version.
- [ ] Buat checklist dengan section/item/answer type.
- [ ] Cek scoring/weighting.
- [ ] Cek mandatory evidence/comment.
- [ ] Cek critical item auto action jika ada.
- [ ] Ubah template dan pastikan response lama tidak rusak.

## Expected Result

- Form/checklist configurable dan version-safe.
- Submission menyimpan versi.
- Validasi backend lengkap.
- Tidak hardcoded.

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
SELESAI QA STEP: 12 — Form & Checklist Builder QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
