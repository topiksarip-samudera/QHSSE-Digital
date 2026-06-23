# 02 — INCIDENT MANAGEMENT GENERATING RULES

## Aturan Wajib

1. Jangan membuat modul Incident berdiri sendiri tanpa Core Platform.
2. Semua record Incident harus punya `company_id`.
3. Semua API harus memakai tenant guard.
4. Semua API harus memakai permission guard.
5. Semua perubahan status harus masuk audit log.
6. Semua attachment harus memakai attachment service core.
7. Semua CAPA harus memakai action tracking core.
8. Semua approval harus memakai workflow engine core.
9. Semua notification harus memakai notification core.
10. Semua numbering harus memakai numbering core.
11. Semua master data harus configurable.
12. Jangan hardcode severity, type, category, atau root cause.
13. Jangan lanjut sequence berikutnya sebelum sequence sekarang lulus acceptance criteria.

## Definition of Done per Sequence

Setiap sequence dianggap selesai jika:

```text
Database/migration selesai
Backend API selesai
DTO validation selesai
Permission guard selesai
Tenant isolation selesai
Audit log selesai
Frontend page/component selesai
Test minimal selesai
Acceptance criteria terpenuhi
```

## Backend Minimal per Sequence

```text
DTO
Service
Controller
Policy/Permission
Tenant filter
Audit log integration
Validation
Error handling
Test
```

## Frontend Minimal per Sequence

```text
List/detail/form jika relevan
Tab jika relevan
Loading state
Empty state
Error state
Permission-aware UI
Responsive layout
```

## Testing Minimal

```text
Create/read/update
Permission denied
Tenant isolation
Validation error
Audit log created
Workflow status if relevant
Notification if relevant
```

## Status Akhir per Sequence

AI Agent wajib menutup dengan format:

```text
SELESAI INCIDENT SEQUENCE XX: <nama sequence>

Yang dibuat:
- Database:
- Backend:
- Frontend:
- Permission:
- Audit log:
- Test:
- Catatan:

Jangan lanjut sequence berikutnya sebelum diminta.
```
