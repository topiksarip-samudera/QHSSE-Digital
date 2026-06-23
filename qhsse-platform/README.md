# QHSSE Platform

QHSSE Integrated Management System — Multi-tenant SaaS Platform for Quality, Health, Safety, Security & Environment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Cache | Redis 7 |
| Storage | MinIO (S3-compatible) |
| Auth | JWT + Refresh Token |
| Monorepo | pnpm workspaces + Turborepo |

## Project Structure

```
qhsse-platform/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared types, constants, schemas
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.ts       # Seed data
├── docker/
│   └── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start Infrastructure

```bash
pnpm docker:up
```

This starts PostgreSQL, Redis, and MinIO.

### 4. Setup Database

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed initial data
```

### 5. Start Development

```bash
pnpm dev            # Start all apps
# OR
pnpm dev:api        # Start API only (port 4000)
pnpm dev:web        # Start Web only (port 3000)
```

### 6. Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| MinIO Console | http://localhost:9001 |

### Default Credentials

```
Email: admin@qhsse.com
Password: Admin123!
```

## Development Commands

```bash
pnpm dev              # Start all in dev mode
pnpm build            # Build all
pnpm lint             # Lint all
pnpm test             # Test all
pnpm format           # Format with Prettier
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database
```

## Architecture

See `docs/` for detailed architecture documentation.

## License

Proprietary — All rights reserved.
