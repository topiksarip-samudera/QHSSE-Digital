# 17 — Performance & Reliability Baseline

## Tujuan

Membuat baseline performa sebelum modul QHSSE ditambahkan.

## Checklist QA

- [ ] Cek waktu login.
- [ ] Cek waktu load dashboard.
- [ ] Cek list pagination 1k/10k record dummy jika memungkinkan.
- [ ] Cek upload/download file.
- [ ] Cek queue job notification.
- [ ] Cek database slow query.
- [ ] Cek memory API saat test.
- [ ] Cek error rate.
- [ ] Cek build size frontend.
- [ ] Cek Docker Compose restart recovery.

## Expected Result

- Ada angka baseline performa.
- Query lambat terdeteksi.
- Bottleneck awal diperbaiki atau dicatat.

## Command / Test yang Disarankan

```bash
npm run build
npm run test:performance
# Sesuaikan dengan tool load test yang tersedia
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
SELESAI QA STEP: 17 — Performance & Reliability Baseline
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
