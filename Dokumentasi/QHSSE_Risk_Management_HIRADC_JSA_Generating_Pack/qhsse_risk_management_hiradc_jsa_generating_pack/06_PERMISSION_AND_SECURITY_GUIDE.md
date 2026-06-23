# PERMISSION & SECURITY GUIDE

## Scope

```text
Global
Company
Site
Project
Department
Own Data
Assigned Data
```

## Security Rule

- User tanpa permission view tidak bisa lihat list/detail.
- User tanpa create tidak bisa create.
- User tanpa update tidak bisa update.
- User tanpa approve tidak bisa approve.
- User hanya bisa melihat data sesuai company/scope.
- Direct API cross-company harus 403/404.
- Risk matrix setting hanya untuk role tertentu.
- Export harus sesuai permission dan scope.
- Semua risk rating changes harus audit log.
- Attachment evidence mengikuti file security core.

## Backend Guard Wajib

```text
AuthGuard
TenantGuard
PermissionGuard
ModuleEnabledGuard
RiskScopeGuard
```
