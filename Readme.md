<div align="center">

# Manara

### Service. Structured. Scaled.

</div>

---

## Overview

Manara is a B2B Service Lifecycle Management platform that unifies commercial workflows and project execution into a single structured system.

It enables organizations providing software services, professional services, or physical goods to manage the complete lifecycle:

RFQ → Internal Review → Quotation → Client Approval → Project Breakdown → Milestone Completion → Invoice → Payment Tracking → Lifecycle Analytics

Manara bridges the operational gap between commercial approval and execution delivery, ensuring structured processes, financial control, and scalable growth.

---

## Build with -

- Next.js
- Go
- PostgreSQL
- Prisma ORM
- Docker
- REST API Architecture
- JWT-based Authentication
- Role-Based Access Control (RBAC)

---



---

## Getting Started

### Prerequisites

Ensure the following tools are installed:

- Node.js (v18 or later)
- npm
- Go (v1.21 or later)
- PostgreSQL
- Docker (optional)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DevPatel1023/Manara
```

### 2. Go to the project folder

```bash
cd manara
```
### 3. setup .env files

#### a. backend .env file

-- create .env file 
```bash
cd backend
touch .env
```
-- copy .env.example to .env
```bash
cp .env.example .env
```

#### b. frontend .env file

-- create .env.local 
```bash
cd frontend
touch .env.local
```
-- copy .env.local.example to .env.local
```bash
cp .env.local.example .env.local
```

### 4. Run the Application

```bash
docker-compose up --build
```

Services will start:

Frontend → http://localhost:3000

Backend → http://localhost:8080

PostgreSQL → running inside Docker

## License

This project is licensed under the MIT License – see the LICENSE file for details.