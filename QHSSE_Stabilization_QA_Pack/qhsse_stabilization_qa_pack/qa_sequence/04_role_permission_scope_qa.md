# 04 — Role, Permission & Scope QA

## Tujuan

Memastikan permission backend, role, dan scope company/site/department/own/assigned berjalan benar.

## Checklist QA

- [ ] User tanpa permission view tidak bisa akses list/detail.
- [ ] User tanpa create tidak bisa create.
- [ ] User tanpa update tidak bisa update.
- [ ] User tanpa delete tidak bisa delete/archive.
- [ ] User tanpa approve tidak bisa approve workflow.
- [ ] Scope site hanya melihat data site tersebut.
- [ ] Scope department hanya melihat data department tersebut jika diterapkan.
- [ ] Own data hanya melihat data sendiri.
- [ ] Assigned data hanya melihat data yang ditugaskan.
- [ ] Contractor tidak bisa melihat internal note/data internal.
- [ ] UI menyembunyikan tombol sesuai permission.
- [ ] Direct API tetap ditolak walau tombol UI disembunyikan.

## Expected Result

- Permission backend tidak bisa dibypass.
- UI dan backend konsisten.
- Scope tidak bocor antar site/department/company.
- Perubahan role/permission tercatat audit log.

## Command / Test yang Disarankan

```bash
npm run test -- permission
npm run test:e2e -- permission
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
SELESAI QA STEP: 04 — Role, Permission & Scope QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
