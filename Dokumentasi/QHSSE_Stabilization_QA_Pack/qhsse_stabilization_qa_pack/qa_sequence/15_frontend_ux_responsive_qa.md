# 15 — Frontend UX & Responsive QA

## Tujuan

Memastikan UI core nyaman, konsisten, permission-aware, dan mobile responsive.

## Checklist QA

- [ ] Sidebar mengikuti module ON/OFF.
- [ ] Company/site switcher berjalan.
- [ ] List page memiliki search/filter/pagination.
- [ ] Create/edit form validasi jelas.
- [ ] Detail page punya tab yang konsisten.
- [ ] Loading state ada.
- [ ] Empty state ada.
- [ ] Error state ada.
- [ ] Permission-aware button berjalan.
- [ ] Responsive desktop/tablet/mobile.
- [ ] Form panjang tetap nyaman digunakan.
- [ ] Toast/alert konsisten.

## Expected Result

- UI siap dipakai user admin dan lapangan.
- Tidak ada halaman kosong membingungkan.
- Mobile browser layak digunakan.

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
SELESAI QA STEP: 15 — Frontend UX & Responsive QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
