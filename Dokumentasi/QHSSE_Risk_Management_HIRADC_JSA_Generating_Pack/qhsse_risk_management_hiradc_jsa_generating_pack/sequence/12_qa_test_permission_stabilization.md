# RISK SEQUENCE 12 — QA, Test, Permission & Stabilization

## Tujuan

Menjalankan tenant isolation, permission, risk calculation, HIRADC/JSA, workflow, audit log, dashboard, export, dan release gate.

## Fitur Wajib

- Database schema/migration.
- Backend DTO validation.
- Backend service and API.
- Permission guard.
- Tenant guard.
- Audit log.
- Notification/action integration jika relevan.
- Frontend list/create/detail/edit/settings jika relevan.
- Loading, empty, error state.
- Unit/API/permission/tenant tests.

## Detail Implementasi

### Database

Gunakan tabel yang relevan dari `03_DATABASE_MODEL_GUIDE.md`. Semua data tenant-specific wajib menggunakan `company_id` dan tidak boleh cross-company reference.

### Backend

Gunakan API pattern dari `04_API_CONTRACT_GUIDE.md`. Semua calculation penting, terutama risk score, initial risk, residual risk, dan matrix mapping, wajib diproses backend.

### Frontend

Gunakan UI pattern dari `05_UI_UX_GUIDE.md`. Pastikan table memiliki search, filter, pagination, status badge, dan permission-aware button.

### Permission

Terapkan permission sesuai `06_PERMISSION_AND_SECURITY_GUIDE.md`.

### Audit Log

Catat create, update, submit, approve, reject, rating change, control change, export, dan settings change jika terjadi.

## Acceptance Criteria

- [ ] Sequence ini selesai secara database, backend, frontend, permission, audit log, dan test.
- [ ] Tenant isolation aman.
- [ ] Permission backend tidak bisa dibypass.
- [ ] UI permission-aware.
- [ ] Lint/test/build lulus.
- [ ] Tidak ada hardcode untuk data yang harus configurable.

## Prompt untuk AI Agent

```text
Implementasikan Risk Sequence 12: QA, Test, Permission & Stabilization.
Ikuti panduan dalam file ini dan generating rules global.
Setelah selesai tulis:
SELESAI RISK SEQUENCE 12: QA, Test, Permission & Stabilization
Jangan lanjut sequence berikutnya.
```
