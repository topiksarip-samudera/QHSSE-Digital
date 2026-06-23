# 02 — REKOMENDASI STACK DAN ARSITEKTUR

## Rekomendasi Utama

Gunakan stack berikut untuk WebApp QHSSE SaaS serius:

```text
Frontend     : Next.js + TypeScript
Backend      : NestJS + TypeScript
Database     : PostgreSQL
ORM          : Prisma
Cache/Queue  : Redis + BullMQ
Storage      : MinIO untuk self-hosted, S3-compatible untuk cloud
Auth         : JWT + Refresh Token, Phase 3 bisa tambah SSO/OIDC/SAML
Search       : PostgreSQL FTS awal, Meilisearch/OpenSearch untuk scale
UI           : Tailwind CSS + shadcn/ui
Validation   : Zod di frontend, class-validator/Zod di backend
Testing      : Vitest/Jest + Playwright
Deployment   : Docker Compose awal, Kubernetes jika enterprise
Reverse Proxy: Nginx atau Traefik
Monitoring   : OpenTelemetry + Prometheus/Grafana optional
```

## Alternatif Lebih Cepat

Jika ingin MVP cepat:

```text
Laravel + Filament + PostgreSQL + Redis + MinIO
```

Namun untuk SaaS modular enterprise, rekomendasi utama tetap:

```text
Next.js + NestJS + PostgreSQL + Prisma + Redis + MinIO
```

## Arsitektur Tingkat Tinggi

```text
Browser / PWA
   ↓
Next.js Frontend
   ↓
NestJS API Gateway / Backend
   ├── Auth Module
   ├── Core Platform Modules
   ├── QHSSE Modules
   ├── Workflow Engine
   ├── Notification Service
   ├── File Service
   ├── AI Governance Service
   └── Integration Service
   ↓
PostgreSQL + Redis + MinIO
```

## Struktur Monorepo Rekomendasi

```text
qhsse-platform/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── shared/              # shared types, constants, schemas
│   ├── ui/                  # shared UI components optional
│   └── config/              # eslint, tsconfig, prettier
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docs/
├── docker/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Backend Module Pattern

Setiap module backend minimal memiliki:

```text
module/
├── dto/
├── entities or prisma mapping
├── module.controller.ts
├── module.service.ts
├── module.repository.ts optional
├── module.policy.ts
├── module.audit.ts optional
├── module.spec.ts
└── index.ts
```

## Frontend Module Pattern

Setiap module frontend minimal memiliki:

```text
app/(dashboard)/module-name/
├── page.tsx
├── create/page.tsx
├── [id]/page.tsx
├── [id]/edit/page.tsx
components/module-name/
hooks/use-module-name.ts
lib/api/module-name.ts
schemas/module-name.schema.ts
```

## Konvensi API

Gunakan prefix:

```text
/api/v1
```

Format response sukses:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Format error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

## Multi-Tenant Enforcement

Wajib buat middleware/guard yang membaca:

```text
current_user
current_company_id
current_scope
current_permissions
```

Semua query bisnis wajib filter:

```text
company_id = current_company_id
```

Super Admin boleh override tetapi tetap harus masuk audit log.

## Event-Driven Internal

Gunakan event internal untuk:

```text
record.created
record.updated
workflow.approval_requested
workflow.approved
workflow.rejected
action.assigned
action.overdue
file.uploaded
notification.sent
```

Event memudahkan notification, audit log, webhook, dan AI governance.
