# 07 — Workflow Engine QA

## Tujuan

Menguji workflow submit, approve, reject, revision, history, SLA, dan perubahan template.

## Checklist QA

- [ ] Buat workflow sederhana 2-3 step.
- [ ] Assign approver by role.
- [ ] Assign approver by user.
- [ ] Submit record test.
- [ ] Approver menerima notification.
- [ ] Approve step pertama lanjut ke step berikutnya.
- [ ] Reject wajib comment.
- [ ] Request revision mengembalikan ke creator.
- [ ] Workflow history lengkap.
- [ ] Audit log approval/reject tercatat.
- [ ] Ubah workflow template lalu pastikan instance lama tidak rusak.
- [ ] Cek user tidak bisa approve tanpa permission.
- [ ] Cek user tidak bisa approve jika bukan approver.

## Expected Result

- Workflow reusable dan tidak hardcoded.
- Status transition benar.
- History lengkap.
- Instance lama aman setelah template berubah.

## Command / Test yang Disarankan

```bash
npm run test -- workflow
npm run test:e2e -- workflow
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
SELESAI QA STEP: 07 — Workflow Engine QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
