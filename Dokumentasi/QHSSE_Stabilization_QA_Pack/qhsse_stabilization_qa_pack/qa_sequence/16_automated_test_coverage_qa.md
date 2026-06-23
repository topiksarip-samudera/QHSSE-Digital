# 16 — Automated Test Coverage QA

## Tujuan

Menentukan coverage minimal agar bug core tidak mudah muncul kembali.

## Checklist QA

- [ ] Unit test service utama tersedia.
- [ ] API integration test tersedia.
- [ ] Tenant isolation test tersedia.
- [ ] Permission test tersedia.
- [ ] Workflow test tersedia.
- [ ] Attachment security test tersedia.
- [ ] Audit log test tersedia.
- [ ] Frontend smoke test tersedia.
- [ ] E2E login-dashboard basic tersedia.
- [ ] Test berjalan di CI jika ada.

## Expected Result

- Test suite bisa dijalankan otomatis.
- Core critical path terlindungi.
- Coverage gap tercatat.

## Command / Test yang Disarankan

```bash
npm run test
npm run test:e2e
npm run test:coverage
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
SELESAI QA STEP: 16 — Automated Test Coverage QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
