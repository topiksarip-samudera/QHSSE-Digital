# PHASE 3 — CORE ENTERPRISE — Sequence Generating

## Aturan

Jangan generate semua core sekaligus. Kerjakan sesuai urutan.

## Urutan Core

1. `01_sso_single_sign_on.md` — SSO / Single Sign-On
2. `02_mfa_multi_factor_authentication.md` — MFA / Multi-Factor Authentication
3. `03_advanced_permission.md` — Advanced Permission
4. `04_subscription_billing_package_management.md` — Subscription, Billing & Package Management
5. `05_backup_restore_ui.md` — Backup & Restore UI
6. `06_system_health_monitoring.md` — System Health Monitoring
7. `07_ai_governance.md` — AI Governance
8. `08_offline_pwa.md` — Offline PWA
9. `09_advanced_integration_center.md` — Advanced Integration Center
10. `10_data_retention_archive_legal_hold.md` — Data Retention, Archive & Legal Hold
11. `11_compliance_control_center.md` — Compliance & Control Center
12. `12_enterprise_reporting.md` — Enterprise Reporting

## Cara Kerja

Untuk setiap core:

1. Baca file core.
2. Implementasikan database.
3. Implementasikan backend.
4. Implementasikan frontend.
5. Tambahkan permission.
6. Tambahkan audit log.
7. Tambahkan test.
8. Jalankan lint/test/build.
9. Cocokkan acceptance criteria.
10. Tulis `SELESAI CORE: <nama core>`.
11. Stop dan tunggu instruksi lanjut.

## Prompt Continue

Gunakan prompt ini setiap ingin lanjut:

```text
Continue Sequence. Kerjakan core berikutnya sesuai file sequence. Jika core selesai, jangan lanjut core berikutnya. Berikan keterangan selesai.
```
