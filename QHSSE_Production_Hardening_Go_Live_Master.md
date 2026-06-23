# START HERE — QHSSE Production Hardening & Go-Live Preparation Generating Pack

Paket ini dibuat untuk generate tahap **Production Hardening & Go-Live Preparation** pada WebApp/SaaS QHSSE.

## Rekomendasi Split

Production Hardening & Go-Live Preparation sebaiknya di-split menjadi **14 sequence**.

```text
01 Production Architecture & Environment Strategy
02 Docker Compose Production Hardening
03 Kubernetes / Scalable Deployment Preparation
04 CI/CD Pipeline & Release Automation
05 Database Backup, Restore & Migration Safety
06 File Storage, MinIO/S3 Backup & Retention
07 Monitoring, Logging, Metrics & Alerting
08 Error Tracking, Audit Review & Incident Response
09 Security Hardening, Secrets & Access Control
10 Performance Optimization, Cache & Load Testing
11 Disaster Recovery, Failover & Business Continuity
12 Production Checklist, UAT & Go-Live Gate
13 Documentation, Demo Tenant & Admin Manual
14 Pricing Page, Sales Material & Launch Preparation
```

## Kenapa 14 Sequence?

Tahap ini bukan membuat fitur baru, tetapi memastikan produk siap production dan siap dijual:

```text
Production architecture
Docker production hardening
Kubernetes / scalable deployment
CI/CD release automation
Database backup & restore
File storage backup
Monitoring
Logging
Alerting
Error tracking
Security hardening
Performance optimization
Load testing
Disaster recovery
UAT
Go-live gate
Documentation
Demo tenant
Pricing page
Sales material
Launch preparation
```

Jika tahap ini dilewati, sistem bisa terlihat lengkap tetapi belum aman untuk user real.

## Platform yang Disiapkan

```text
Core Platform
Stabilization & QA
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
AI Assistant
Mobile/PWA Field Optimization
SaaS Commercialization
```

## Cara Pakai

1. Extract ZIP.
2. Baca `00_PROMPT_AWAL_PRODUCTION_HARDENING_GO_LIVE.md`.
3. Baca `01_PRODUCTION_HARDENING_MASTER_BLUEPRINT.md`.
4. Baca `02_PRODUCTION_HARDENING_GENERATING_RULES.md`.
5. Mulai dari `sequence/01_production_architecture_environment_strategy.md`.
6. Kerjakan satu sequence saja.
7. Setelah selesai tulis status sequence.
8. Jangan lanjut sebelum diminta continue.

## Status Akhir

```text
PRODUCTION HARDENING GO-LIVE STABILIZED: GO
```


---

# 00 — PROMPT AWAL PRODUCTION HARDENING & GO-LIVE UNTUK AI AGENT

Core Platform, seluruh QHSSE Operational Modules, Reports & Analytics, AI Assistant, Mobile/PWA Field Optimization, dan SaaS Commercialization sudah selesai atau siap integrasi.

Platform yang harus disiapkan untuk production:

```text
Core Platform
Stabilization & QA
Incident Management
Risk Management / HIRADC / JSA
Audit & Inspection
Permit to Work
Document Control
Training & Competency
Legal & Compliance Register
Environment Management
Quality Management
Security Management
Contractor Management
Emergency Response
Asset & Equipment
Reports & Analytics
AI Assistant
Mobile/PWA Field Optimization
SaaS Commercialization
```

Sekarang generate tahap **Production Hardening & Go-Live Preparation** berdasarkan folder `qhsse_production_hardening_go_live_generating_pack`.

Aturan wajib:

1. Jangan generate semua sequence sekaligus.
2. Mulai dari `sequence/01_production_architecture_environment_strategy.md`.
3. Tahap ini tidak boleh hanya membuat checklist umum.
4. Harus menghasilkan konfigurasi, struktur file, script, runbook, checklist, dan test plan yang bisa dipakai production.
5. Harus mencakup Docker Compose production hardening.
6. Harus mencakup Kubernetes/scalable deployment preparation.
7. Harus mencakup CI/CD release automation.
8. Harus mencakup backup/restore database.
9. Harus mencakup backup/restore file storage.
10. Harus mencakup monitoring, logging, metrics, alerting.
11. Harus mencakup error tracking dan incident response.
12. Harus mencakup security hardening, secrets, access control, tenant isolation review.
13. Harus mencakup performance optimization dan load testing.
14. Harus mencakup disaster recovery dan business continuity.
15. Harus mencakup UAT, go-live gate, documentation, demo tenant, pricing page, dan sales material.
16. Semua production change wajib audit-friendly dan terdokumentasi.
17. Setelah sequence selesai, tulis:
   `SELESAI PRODUCTION GO-LIVE SEQUENCE XX: <nama sequence>`
18. Jangan lanjut sequence berikutnya sebelum user meminta continue.

Mulai dari sequence pertama saja.


---

# 01 — MASTER BLUEPRINT PRODUCTION HARDENING & GO-LIVE PREPARATION

## Tujuan

Tahap **Production Hardening & Go-Live Preparation** memastikan WebApp/SaaS QHSSE siap digunakan oleh user real, aman, stabil, dapat dipantau, bisa backup/restore, bisa rollback, dan siap diluncurkan secara komersial.

## Prinsip Desain

1. Production bukan development server.
2. Semua service harus healthcheck.
3. Semua secret harus aman.
4. Semua deployment harus repeatable.
5. Semua release harus bisa rollback.
6. Semua database migration harus punya safety gate.
7. Backup harus diuji restore.
8. Monitoring dan alert harus aktif sebelum go-live.
9. Tenant isolation dan permission harus diuji ulang.
10. Payment webhook dan billing harus diuji ulang.
11. AI usage dan quota harus dipantau.
12. Mobile/PWA offline sync harus diuji di kondisi field.
13. Dokumentasi, demo tenant, dan launch material harus siap.

## Target Output

```text
Production Architecture
Environment Strategy
Production Docker Compose
Kubernetes Deployment Preparation
CI/CD Pipeline
Release Automation
Rollback Runbook
Database Backup Script
Database Restore Runbook
File Storage Backup
Monitoring Dashboard
Logging Pipeline
Alerting Rule
Error Tracking
Incident Response Runbook
Security Hardening Checklist
Secrets Management
Performance Report
Load Test Report
Disaster Recovery Plan
Business Continuity Plan
UAT Checklist
Go-Live Checklist
Admin Manual
User Manual
API Documentation
Demo Tenant
Pricing Page
Sales Material
Launch Checklist
```

## Environment Target

```text
local
development
staging
uat
production
demo
```

## Go-Live Gate

```text
Architecture approved
Production deployment tested
Backup tested
Restore tested
Monitoring active
Alerting active
Security test passed
Tenant isolation passed
Permission test passed
Billing test passed
AI usage control passed
Mobile field test passed
Load test passed
UAT passed
Documentation ready
Demo tenant ready
Launch material ready
```


---

# 02 — PRODUCTION HARDENING GENERATING RULES

## Aturan Utama

1. Jangan membuat checklist kosong tanpa implementasi.
2. Setiap sequence harus menghasilkan file nyata: config, script, runbook, checklist, atau test matrix.
3. Jangan menyimpan secret asli di repo.
4. Gunakan `.env.example`, bukan `.env` production.
5. Semua container wajib healthcheck.
6. Semua service penting wajib restart policy.
7. Migration production harus punya backup gate.
8. Backup harus punya restore test.
9. Monitoring harus mencakup app, API, DB, Redis, queue, storage, worker, billing, AI usage, mobile sync.
10. Alerting harus punya severity.
11. Security harus mencakup tenant isolation, RBAC, CORS, CSP, rate limit, secret, dependency scan.
12. Load testing harus punya target dan baseline.
13. Go-live harus punya rollback plan.
14. Dokumentasi harus bisa digunakan admin, user, dan developer.

## Production Acceptance

```text
No hardcoded secret
No debug mode
No public admin endpoint
TLS enforced
Backup automated
Restore tested
Monitoring active
Alerting active
Healthcheck active
Rollback tested
Tenant isolation passed
Permission passed
Billing webhook idempotent
AI quota enforced
Mobile sync stable
```

## Audit & Evidence

Simpan evidence untuk:
```text
Deployment test
Backup test
Restore test
Security test
Load test
UAT signoff
Go-live approval
Rollback drill
DR drill
```


---

# 03 — DEPLOYMENT ARCHITECTURE GUIDE

## Recommended Production Components

```text
Reverse Proxy / Load Balancer
Frontend Web
Backend API
Worker Queue
Scheduler / Cron Worker
PostgreSQL
Redis
MinIO / S3
Object Storage Backup
Monitoring
Logging
Error Tracking
SMTP / Notification
AI Provider Gateway
Payment Webhook Endpoint
```

## Minimum Production Strategy

```text
Single VM Production:
- Docker Compose hardened
- Nginx/Caddy reverse proxy
- TLS
- automated backup
- monitoring agent
- external object backup

Scalable Production:
- Kubernetes
- managed PostgreSQL
- managed Redis
- S3-compatible storage
- ingress controller
- HPA
- centralized logging
```

## Network Zones

```text
Public:
- reverse proxy
- frontend
- webhook endpoint

Private:
- backend API
- workers
- database
- redis
- storage

Restricted:
- admin console
- backup storage
- secrets
```


---

# 04 — ENVIRONMENT CONFIGURATION GUIDE

## File Environment

```text
.env.example
.env.staging.example
.env.production.example
.env.demo.example
```

## Required Variables

```text
NODE_ENV
APP_URL
API_URL
DATABASE_URL
REDIS_URL
S3_ENDPOINT
S3_BUCKET
S3_ACCESS_KEY
S3_SECRET_KEY
JWT_SECRET
ENCRYPTION_KEY
SMTP_HOST
SMTP_USER
SMTP_PASS
PAYMENT_WEBHOOK_SECRET
AI_PROVIDER_BASE_URL
AI_PROVIDER_API_KEY
LOG_LEVEL
SENTRY_DSN
PROMETHEUS_ENABLED
```

## Rules

- Jangan commit `.env` asli.
- Semua secret production harus digenerate kuat.
- Semua key harus bisa dirotasi.
- Gunakan secret manager jika tersedia.
- Pisahkan staging dan production.


---

# 05 — BACKUP & RESTORE RUNBOOK

## Database Backup

```bash
pg_dump "$DATABASE_URL" --format=custom --file=backup_$(date +%Y%m%d_%H%M%S).dump
```

## Database Restore

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" backup.dump
```

## File Storage Backup

```bash
mc mirror minio/qhsse ./backup/minio/qhsse
```

## Restore Test Requirement

```text
Backup file exists
Backup checksum verified
Restore to staging success
App boots after restore
Tenant data verified
Attachment verified
Audit log verified
```

## Frequency

```text
Database: daily minimum
File storage: daily minimum
Critical backup: before production migration
Retention: 7 daily, 4 weekly, 12 monthly
```


---

# 06 — MONITORING, LOGGING & ALERTING GUIDE

## Metrics

```text
API uptime
API latency p95/p99
Frontend uptime
Database connection
Slow query
Redis memory
Queue waiting/failed
Worker status
Storage usage
File upload failure
AI token usage
AI cost
Payment webhook failure
Mobile sync failure
Error rate
CPU/RAM/disk
```

## Alerts

```text
P0: app down, database down, payment webhook broken, backup failed
P1: high error rate, queue stuck, disk > 85%, latency high
P2: AI cost high, mobile sync failure, storage near limit
```

## Logs

```text
Application log
Access log
Error log
Audit log
Security log
Billing/payment log
AI usage log
Mobile sync log
```


---

# 07 — SECURITY HARDENING CHECKLIST

## Application

```text
Debug disabled
CORS restricted
CSP enabled
Security headers enabled
Rate limit enabled
CSRF strategy reviewed
JWT/session expiry configured
Password policy configured
MFA admin recommended
Admin endpoint protected
File upload validation enabled
```

## Tenant & Permission

```text
Tenant isolation test passed
RBAC test passed
Scope access test passed
Module entitlement test passed
Report export permission passed
AI context permission passed
Mobile offline permission passed
Billing access permission passed
```

## Infrastructure

```text
TLS enabled
Firewall configured
Database not public
Redis not public
MinIO/S3 not public except signed URL
Secrets not committed
Backup encrypted
Dependency scan passed
Container image scan passed
```


---

# 08 — LOAD TEST & PERFORMANCE GUIDE

## Target Baseline

```text
API p95 latency < 500ms for common requests
Dashboard p95 load < 3s
Report export async for large data
Queue processing not stuck
DB CPU stable
No memory leak in 30-minute load test
```

## Test Scenarios

```text
Login
Dashboard load
Incident create
Inspection checklist submit
Permit approval
Report analytics load
Export report
AI request
Mobile sync push/pull
File upload
Payment webhook
```

## Tools

```text
k6
Artillery
Locust
JMeter
Playwright performance smoke
```

## Output

```text
Load Test Report
Bottleneck List
Optimization Action
Retest Result
Go/No-Go Decision
```


---

# 09 — RELEASE & ROLLBACK RUNBOOK

## Release Steps

```text
1. Freeze release branch
2. Run lint/test/build
3. Backup database
4. Backup storage metadata
5. Run migration dry-run on staging
6. Deploy staging
7. Smoke test staging
8. Approve production deployment
9. Deploy production
10. Run smoke test production
11. Monitor metrics and logs
12. Announce release complete
```

## Rollback Triggers

```text
P0 bug
Login failure
Tenant isolation failure
Payment failure
Data corruption
Migration failure
Critical performance degradation
```

## Rollback Steps

```text
1. Stop new deployment rollout
2. Revert app image
3. Restore previous config if needed
4. Apply DB rollback or restore if required
5. Validate app
6. Communicate incident
7. Create post-release review
```


---

# Production Hardening & Go-Live Preparation Sequence

```text
01 Production Architecture & Environment Strategy
02 Docker Compose Production Hardening
03 Kubernetes / Scalable Deployment Preparation
04 CI/CD Pipeline & Release Automation
05 Database Backup, Restore & Migration Safety
06 File Storage, MinIO/S3 Backup & Retention
07 Monitoring, Logging, Metrics & Alerting
08 Error Tracking, Audit Review & Incident Response
09 Security Hardening, Secrets & Access Control
10 Performance Optimization, Cache & Load Testing
11 Disaster Recovery, Failover & Business Continuity
12 Production Checklist, UAT & Go-Live Gate
13 Documentation, Demo Tenant & Admin Manual
14 Pricing Page, Sales Material & Launch Preparation
```

## Prompt Continue

```text
Continue Production Hardening & Go-Live Sequence. Kerjakan sequence berikutnya sesuai sequence/00_PRODUCTION_GO_LIVE_SEQUENCE.md. Jika sequence selesai, jangan lanjut sequence berikutnya. Berikan keterangan selesai.
```

## Status Akhir

```text
PRODUCTION HARDENING GO-LIVE STABILIZED: GO
```
