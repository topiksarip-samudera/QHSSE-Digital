# RISK GENERATING RULES

## Aturan Global

1. Jangan membuat risk module sebagai CRUD sederhana.
2. Risk matrix harus dynamic/configurable.
3. Severity, likelihood, risk level, hazard, consequence, control harus configurable.
4. HIRADC dan JSA harus punya model data sendiri.
5. JSA harus berbasis job steps, bukan textarea panjang.
6. Semua risk record wajib tenant-safe.
7. Semua API wajib permission guard.
8. Semua critical changes wajib audit log.
9. High/extreme risk wajib action plan atau approval tambahan sesuai setting.
10. Jangan lanjut sequence berikutnya sebelum sequence sekarang selesai.

## Urutan Kerja Setiap Sequence

```text
1. Baca file sequence.
2. Update database schema.
3. Buat migration.
4. Buat seed data.
5. Buat backend DTO/validation.
6. Buat service.
7. Buat controller/API.
8. Tambahkan permission guard.
9. Tambahkan tenant guard.
10. Tambahkan audit log.
11. Tambahkan notification/action jika relevan.
12. Buat frontend page/component.
13. Tambahkan loading/empty/error state.
14. Tambahkan test.
15. Jalankan lint/test/build.
16. Cocokkan acceptance criteria.
17. Tulis status selesai.
```

## Permission Minimal

```text
risk.view
risk.view_all
risk.create
risk.update
risk.delete
risk.submit
risk.approve
risk.reject
risk.archive
risk.export
risk.import
risk.manage_settings
hiradc.view
hiradc.create
hiradc.update
hiradc.submit
hiradc.approve
hiradc.export
jsa.view
jsa.create
jsa.update
jsa.submit
jsa.approve
jsa.export
risk_matrix.manage
risk_control.manage
```

## Audit Log Wajib

```text
risk.create
risk.update
risk.submit
risk.approve
risk.reject
risk.rating_changed
risk.control_added
risk.control_removed
risk.action_created
risk.review_completed
hiradc.created
hiradc.updated
jsa.created
jsa.updated
risk_matrix.changed
risk.exported
```
