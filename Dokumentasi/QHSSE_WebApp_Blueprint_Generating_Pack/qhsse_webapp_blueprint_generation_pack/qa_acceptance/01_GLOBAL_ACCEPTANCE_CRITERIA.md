# Global Acceptance Criteria

Sistem dianggap siap jika:

## Core

- Multi-company berjalan.
- Tenant isolation terbukti melalui test.
- Role dan permission berjalan di backend.
- Scope company/site/department/own/assigned berjalan.
- Module ON/OFF mempengaruhi UI dan API.
- Master data dinamis.
- Workflow bisa dipakai lintas modul.
- Attachment aman dan tidak public.
- Audit log tercatat dan immutable.
- Notification bekerja.
- Action tracking bekerja.
- Dashboard basic/custom sesuai phase.

## Security

- Password hashed.
- API key hashed.
- Token expire.
- Refresh token revocable.
- File access protected.
- Input tervalidasi.
- Upload tervalidasi.
- No cross-company data leak.
- Sensitive operations audited.

## Frontend

- UI konsisten.
- List/create/detail/edit tersedia.
- Loading/empty/error state tersedia.
- Permission-aware UI.
- Mobile responsive.
- Table filter/search/pagination tersedia.

## Backend

- DTO validation.
- Permission guard.
- Tenant guard.
- Audit log interceptor/service.
- Error format konsisten.
- Pagination/filter/sort.
- Test minimal.

## DevOps

- Docker Compose berjalan.
- Migration dan seed tersedia.
- .env.example tersedia.
- README development tersedia.
- Lint/test/build berjalan.
