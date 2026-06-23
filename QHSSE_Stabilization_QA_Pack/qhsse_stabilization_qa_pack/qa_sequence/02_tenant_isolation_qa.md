# 02 — Tenant Isolation QA

## Tujuan

Memastikan data antar company/tenant tidak bocor di UI, API, search, dashboard, file, dan export.

## Checklist QA

- [ ] Buat minimal Company A dan Company B.
- [ ] Buat user admin untuk masing-masing company.
- [ ] Buat site, department, master data, action, attachment di masing-masing company.
- [ ] Login sebagai user Company A dan coba akses data Company B via UI.
- [ ] Coba akses data Company B via direct API ID.
- [ ] Cek dashboard Company A tidak menghitung data Company B.
- [ ] Cek search Company A tidak menampilkan data Company B.
- [ ] Cek export Company A tidak mengekspor data Company B.
- [ ] Cek file attachment Company B tidak bisa didownload user Company A.
- [ ] Cek Super Admin cross-company access tercatat audit log.

## Expected Result

- User Company A tidak bisa melihat/mengubah/mengunduh data Company B.
- Direct API harus return 403 atau 404.
- Dashboard/search/export aman.
- Super Admin override tercatat.

## Command / Test yang Disarankan

```bash
npm run test -- tenant
npm run test:e2e -- tenant
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
SELESAI QA STEP: 02 — Tenant Isolation QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
