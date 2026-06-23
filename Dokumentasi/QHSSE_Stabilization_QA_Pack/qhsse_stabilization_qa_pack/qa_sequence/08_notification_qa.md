# 08 — Notification QA

## Tujuan

Menguji notifikasi in-app/email/event/reminder agar user menerima informasi yang tepat.

## Checklist QA

- [ ] Approval request mengirim notification.
- [ ] Action assigned mengirim notification.
- [ ] Action overdue mengirim reminder.
- [ ] Mention comment mengirim notification jika comment tersedia.
- [ ] Read/unread berjalan.
- [ ] Unread count benar.
- [ ] Notification hanya diterima user relevan.
- [ ] Template notification bisa diedit.
- [ ] Delivery log tercatat.
- [ ] Email failure tercatat jika SMTP gagal.

## Expected Result

- Notification event berjalan.
- Tidak ada user tidak relevan menerima notification.
- Read/unread akurat.
- Failure bisa dilacak.

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
SELESAI QA STEP: 08 — Notification QA
Status: PASS / FAIL / BLOCKED
Catatan:
- ...
```
