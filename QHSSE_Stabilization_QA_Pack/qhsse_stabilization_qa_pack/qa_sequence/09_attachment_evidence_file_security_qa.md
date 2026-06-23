# 09 — Attachment, Evidence & File Security QA

## Tujuan

Memastikan upload/download/preview/delete file aman, tervalidasi, dan tenant-safe.

## Checklist QA

- [ ] Upload file allowed type berhasil.
- [ ] Upload file forbidden type gagal.
- [ ] Upload melebihi size limit gagal.
- [ ] Download butuh auth.
- [ ] Download butuh permission.
- [ ] User Company A tidak bisa download file Company B.
- [ ] File URL tidak public tanpa token.
- [ ] Delete attachment soft delete.
- [ ] Attachment metadata benar.
- [ ] Attachment linked ke module/record benar.
- [ ] Virus scan jika ada berjalan.
- [ ] Storage limit package jika ada diterapkan.

## Expected Result

- File aman dari akses publik.
- Tenant isolation file lulus.
- Upload tervalidasi.
- Download tercatat audit log jika disyaratkan.

## Command / Test yang Disarankan

```bash
npm run test -- attachment
npm run test:e2e -- file
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
SELESAI QA STEP: 09 — Attachment, Evidence & File Security QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
