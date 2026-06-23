# 03 — GENERATING RULES GLOBAL UNTUK AI AGENT

## Aturan Umum

1. Jangan membuat kode dummy kosong.
2. Jangan membuat fitur hanya UI tanpa backend.
3. Jangan membuat backend tanpa permission guard.
4. Jangan membuat tabel tanpa company_id jika data tenant-specific.
5. Jangan membuat action destructive tanpa audit log.
6. Jangan hardcode data yang harusnya master data.
7. Jangan hardcode approval yang harusnya workflow.
8. Jangan membuat file upload public tanpa proteksi.
9. Jangan mengabaikan test.
10. Jangan lanjut core berikutnya sebelum core sekarang selesai.

## Urutan Implementasi Setiap Core

Untuk setiap core, lakukan urutan ini:

```text
1. Baca file panduan core.
2. Buat/update database schema.
3. Buat migration.
4. Buat seed data jika perlu.
5. Buat backend DTO/validation.
6. Buat backend service.
7. Buat backend controller/API.
8. Tambahkan permission.
9. Tambahkan audit log.
10. Tambahkan notification jika relevan.
11. Buat frontend page.
12. Buat table/list/detail/form.
13. Tambahkan error/loading/empty state.
14. Tambahkan test.
15. Jalankan lint/test/build.
16. Cocokkan dengan acceptance criteria.
17. Tulis status selesai.
```

## Pola Status yang Wajib Dipakai AI Agent

Setelah menyelesaikan core:

```text
SELESAI CORE: <nama core>
Yang dibuat:
- Database:
- Backend:
- Frontend:
- Permission:
- Audit log:
- Test:
- Catatan:

Jangan lanjut core berikutnya sebelum user meminta continue.
```

## Permission Minimum

Setiap modul minimal punya permission:

```text
<module>.view
<module>.create
<module>.update
<module>.delete
<module>.export
```

Jika workflow:

```text
<module>.submit
<module>.approve
<module>.reject
<module>.close
```

## Audit Log Minimum

Catat:

```text
create
update
delete
restore
submit
approve
reject
close
export
import
upload
download
permission_change
settings_change
```

## Frontend Minimum

Setiap fitur minimal punya:

```text
List page
Create page
Detail page
Edit page
Delete/archive confirmation
Filter/search basic
Pagination
Loading state
Empty state
Error state
Permission-aware UI
```

## Backend Minimum

Setiap fitur minimal punya:

```text
DTO validation
Service layer
Controller/API
Permission guard
Tenant filter
Audit log
Error handling
Pagination
Search/filter
Soft delete jika record penting
```

## Testing Minimum

Untuk setiap core:

```text
Unit test service utama
API test minimal happy path
Permission test minimal
Tenant isolation test minimal
```

## Larangan Penting

- Jangan menyimpan API key plaintext.
- Jangan menyimpan password plaintext.
- Jangan bypass company_id.
- Jangan membuat Super Admin sebagai satu-satunya role yang bisa pakai fitur.
- Jangan delete hard record compliance.
- Jangan expose internal id sensitif di UI jika tidak perlu.
