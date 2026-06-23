# 14 — Database Integrity & Migration QA

## Tujuan

Memastikan schema database, migration, index, constraint, seed, dan soft delete benar.

## Checklist QA

- [ ] Migration fresh database berhasil.
- [ ] Migration existing database berhasil.
- [ ] Seed default berhasil.
- [ ] Foreign key benar.
- [ ] Unique constraint benar.
- [ ] Index untuk company_id/status/search field tersedia.
- [ ] Soft delete diterapkan pada record penting.
- [ ] No orphan records.
- [ ] No cross-company relation invalid.
- [ ] Enum/status konsisten.
- [ ] Rollback strategy terdokumentasi jika tersedia.

## Expected Result

- Database bisa dibuat dari nol.
- Schema stabil untuk modul berikutnya.
- Integrity terjaga.

## Command / Test yang Disarankan

```bash
npx prisma migrate reset --force
npx prisma migrate deploy
npm run seed
npm run test -- db
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
SELESAI QA STEP: 14 — Database Integrity & Migration QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
