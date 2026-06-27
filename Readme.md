<div align="center">

<br />

<img src="https://img.shields.io/badge/Manara-B2B%20Lifecycle%20Platform-0f172a?style=for-the-badge&logoColor=white" alt="Manara" />

<h1>Manara</h1>
<p><strong>Service. Structured. Scaled.</strong></p>

<p>
  A B2B Service Project Lifecycle Management platform that unifies commercial workflows<br />
  and project execution into a single, structured system.
</p>

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go&logoColor=white)](https://go.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

<br />

[Overview](#overview) · [Architecture](#architecture) · [Features](#features) · [Getting Started](#getting-started) · [Environment Variables](#environment-variables) · [API Reference](#api-reference) · [Contributing](#contributing)

<br />

</div>

---

## Overview

Manara bridges the operational gap between **commercial approval** and **execution delivery** — giving organizations that provide software services, professional services, or physical goods a structured end-to-end system to manage the complete project lifecycle:

```
RFQ → Internal Review → Quotation → Client Approval →
Project Breakdown → Milestone Completion → Invoice → Payment Tracking → Lifecycle Analytics
```

Rather than stitching together disconnected tools — CRMs, spreadsheets, invoice software — Manara gives every stakeholder (sales, delivery, finance) a single source of truth with role-appropriate views and controls.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│                  Next.js · Port 3000                    │
└────────────────────────┬────────────────────────────────┘
                         │ REST / JSON
┌────────────────────────▼────────────────────────────────┐
│                      API Server                         │
│                  Go (net/http) · Port 8080              │
│          JWT Auth · RBAC · Request Validation           │
└────────────────────────┬────────────────────────────────┘
                         │ Prisma ORM
┌────────────────────────▼────────────────────────────────┐
│                     PostgreSQL                          │
│                 Containerised · Port 5432               │
└─────────────────────────────────────────────────────────┘
```

**Tech Stack**

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Go 1.21+, REST API |
| ORM | Prisma (via `prisma-client-go`) |
| Database | PostgreSQL 16 |
| Auth | JWT — Access + Refresh token strategy |
| Access Control | Role-Based Access Control (RBAC) |
| Containerisation | Docker + Docker Compose |

---

## Features

### Commercial Workflow
- **RFQ Management** — Capture and track incoming client requests with structured metadata
- **Internal Review** — Route RFQs through an internal approval workflow before quoting
- **Quotation Builder** — Create and version itemised quotations tied to RFQs
- **Client Approval** — Track client acceptance/rejection with audit log

### Project Execution
- **Project Breakdown** — Break approved work into structured workstreams and tasks
- **Milestone Tracking** — Define, assign, and complete milestones with progress visibility
- **Document Management** — Attach supporting documents at every lifecycle stage

### Financial Control
- **Invoice Generation** — Auto-generate invoices on milestone completion
- **Payment Tracking** — Record partial and full payments, track outstanding balances
- **Lifecycle Analytics** — Revenue pipeline, project health, and payment dashboards

### Platform
- **RBAC** — Granular roles: Admin, Sales, Delivery, Finance, Client
- **JWT Auth** — Stateless, secure authentication with refresh token rotation
- **Audit Trail** — Immutable event log across every lifecycle transition

---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

| Tool | Minimum Version |
|---|---|
| Node.js | v18.x |
| npm | v9.x |
| Go | v1.21 |
| PostgreSQL | v15+ (skip if using Docker) |
| Docker | Latest stable |
| Docker Compose | v2.x |

---

### 1. Clone the Repository

```bash
git clone https://github.com/DevPatel1023/Manara.git
cd Manara
```

---

### 2. Configure Environment Variables

Manara requires `.env` files for both services. Templates are provided — never commit actual secrets.

#### Backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values. See [Environment Variables → Backend](#backend-1) for the full reference.

#### Frontend

```bash
cd frontend
cp .env.local.example .env.local
```

Open `frontend/.env.local` and fill in your values. See [Environment Variables → Frontend](#frontend-1) for the full reference.

---

### 3. Start with Docker (Recommended)

From the project root:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | `localhost:5432` (internal to Docker network) |

To run in detached mode:

```bash
docker-compose up --build -d
```

To stop all services:

```bash
docker-compose down
```

To stop and remove volumes (resets the database):

```bash
docker-compose down -v
```

---

### 4. Start without Docker (Manual)

#### Database

Ensure PostgreSQL is running locally and create the database:

```sql
CREATE DATABASE manara;
```

#### Backend

```bash
cd backend
go mod download
go run main.go
```

The API will be available at `http://localhost:8080`.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/manara` |
| `JWT_SECRET` | Secret key for signing JWTs | `a-long-random-secret-string` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `another-long-random-secret` |
| `JWT_EXPIRY` | Access token TTL | `15m` |
| `REFRESH_EXPIRY` | Refresh token TTL | `7d` |
| `PORT` | Port the API listens on | `8080` |
| `APP_ENV` | Environment (`development`/`production`) | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

### Frontend

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_APP_ENV`  | Environment label | `development` |

> **Security Note:** Never commit `.env` or `.env.local` files. Both are listed in `.gitignore` by default.

---

## API Reference

All API routes are prefixed with `/api/v1`.

Authentication uses **Bearer tokens** — include the JWT in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

### Core Endpoints (Summary)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate and receive tokens |
| `POST` | `/auth/refresh` | Rotate access token using refresh token |
| `GET` | `/rfq` | List all RFQs (paginated) |
| `POST` | `/rfq` | Create a new RFQ |
| `GET` | `/rfq/:id` | Get a single RFQ |
| `PATCH` | `/rfq/:id/status` | Advance RFQ lifecycle status |
| `GET` | `/quotations` | List all quotations |
| `POST` | `/quotations` | Create a quotation |
| `GET` | `/projects` | List all projects |
| `POST` | `/projects/:id/milestones` | Add a milestone to a project |
| `PATCH` | `/milestones/:id/complete` | Mark a milestone as complete |
| `POST` | `/invoices` | Generate an invoice |
| `GET` | `/payments` | List payments |
| `POST` | `/payments` | Record a payment |
| `GET` | `/analytics/lifecycle` | Lifecycle analytics summary |

> Full API documentation with request/response schemas is available in [`/docs/api.md`](./docs/api.md).

---

## Project Structure

```
Manara/
├── backend/
│   ├── cmd/                  # Entrypoints
│   ├── internal/
│   │   ├── handlers/         # HTTP handlers
│   │   ├── middleware/       # Auth, RBAC, logging
│   │   ├── models/           # Domain models
│   │   ├── repository/       # Database layer
│   │   └── services/         # Business logic
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env.example
│   └── main.go
│
├── frontend/
│   ├── app/                  # Next.js App Router
│   ├── components/           # Shared UI components
│   ├── lib/                  # API client, utilities
│   ├── types/                # TypeScript types
│   └── .env.local.example
│
├── docker-compose.yml
└── README.md
```

---

## Contributing

Contributions are welcome. Please follow the guidelines below to keep the codebase consistent.

### Workflow

1. Fork the repository
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add milestone completion webhook
   fix: resolve RFQ status transition bug
   docs: update API reference for invoices
   ```
4. Open a Pull Request against `main` with a clear description of changes

### Standards

- Go: run `gofmt` and `golangci-lint` before committing
- TypeScript: run `npm run lint` and `npm run type-check`
- All new API endpoints must have corresponding handler tests
- Database schema changes must include a migration file

---

## Roadmap

- [ ] Email notifications on lifecycle transitions
- [ ] Client portal (read-only external view)
- [ ] PDF invoice generation
- [ ] Multi-currency support
- [ ] Webhook integrations (Slack, Teams)
- [ ] Advanced analytics with chart exports

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with clarity and purpose by [Dev Patel](https://github.com/DevPatel1023)

</div>
