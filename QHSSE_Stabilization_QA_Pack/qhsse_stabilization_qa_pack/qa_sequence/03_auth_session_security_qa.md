# 03 — Authentication & Session Security QA

## Tujuan

Menguji login, logout, refresh token, reset password, session expiry, force logout, dan keamanan dasar autentikasi.

## Checklist QA

- [ ] Login valid berhasil.
- [ ] Login invalid gagal dan tercatat.
- [ ] Inactive user tidak bisa login.
- [ ] Suspended company tidak bisa login.
- [ ] Refresh token berjalan.
- [ ] Logout mencabut session.
- [ ] Force logout mencabut semua session user.
- [ ] Forgot/reset password berjalan dan token expire.
- [ ] Password policy diterapkan.
- [ ] Account lock setelah gagal login berulang jika fitur tersedia.
- [ ] Session expired diarahkan ke login.

## Expected Result

- Tidak ada session/token yang tetap valid setelah logout/force logout.
- Password tersimpan hashed.
- Failed login tercatat.
- Auth error message aman dan tidak membocorkan informasi sensitif.

## Command / Test yang Disarankan

```bash
npm run test -- auth
npm run test:e2e -- auth
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
SELESAI QA STEP: 03 — Authentication & Session Security QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
