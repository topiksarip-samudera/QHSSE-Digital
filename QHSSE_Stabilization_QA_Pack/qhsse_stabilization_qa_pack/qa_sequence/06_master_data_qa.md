# 06 — Master Data QA

## Tujuan

Memastikan master data global, company-specific, active/inactive, parent-child, dan penggunaan di dropdown berjalan benar.

## Checklist QA

- [ ] Buat master data global.
- [ ] Clone/copy ke company jika fitur tersedia.
- [ ] Buat master data khusus company.
- [ ] Pastikan Company A tidak melihat master data custom Company B.
- [ ] Set item inactive dan pastikan tidak muncul di pilihan baru.
- [ ] Pastikan item yang sudah dipakai tidak hard delete.
- [ ] Cek parent-child data.
- [ ] Cek color/code/sort order.
- [ ] Cek import/export master data jika tersedia.

## Expected Result

- Master data tenant-safe.
- Inactive item tidak dipakai untuk record baru.
- Data lama tetap valid walau item inactive.
- Soft delete/inactive berjalan.

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
SELESAI QA STEP: 06 — Master Data QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
