# Test Matrix Minimal

## Tenant Isolation

- User Company A tidak bisa lihat data Company B.
- API direct access record company lain harus 403/404.
- Search tidak menampilkan data company lain.
- Dashboard tidak menghitung data company lain.

## Permission

- User tanpa permission view tidak bisa akses list/detail.
- User tanpa create tidak bisa create.
- User tanpa update tidak bisa edit.
- User tanpa approve tidak bisa approve.
- UI menyembunyikan tombol sesuai permission.

## Workflow

- Submit mengubah status.
- Approver benar menerima notification.
- Approve lanjut step berikutnya.
- Reject wajib comment.
- History tercatat.
- Audit log tercatat.

## Attachment

- Upload file allowed sukses.
- Upload file terlarang gagal.
- Download butuh permission.
- File company lain tidak bisa diakses.
- Delete attachment soft delete.

## Audit Log

- Create tercatat.
- Update menyimpan old/new value.
- Delete/archive tercatat.
- Export tercatat.
- Permission change tercatat.

## Notification

- Approval request terkirim.
- Mention comment terkirim.
- Action overdue terkirim.
- Read/unread berjalan.

## Import/Export

- Template bisa didownload.
- Import invalid menghasilkan error row.
- Import valid masuk database.
- Export sesuai filter dan permission.
