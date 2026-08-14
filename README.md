# SEMS / EPMS — Suryadhi Education Management System

SEMS (Suryadhi Education Management System) is a comprehensive, multi-tenant enterprise resource planning (ERP) platform designed for school and coaching-center franchise networks. It manages student admissions, fee structures, financial statement of accounts (SOA), attendance, academic reporting, and franchise operations across a distributed school network.

---

## 🏗️ Tech Stack Overview

### Frontend (`/client`)
- **Core**: React 19 + TypeScript + Vite 6
- **Routing**: React Router v7
- **State Management**: Zustand (Global state) + TanStack Query v5 (Server state caching)
- **Forms**: React Hook Form + Zod resolvers
- **Styling**: Tailwind CSS + Radix UI primitives + `class-variance-authority` + `framer-motion`
- **Tables & Charts**: TanStack Table v8, Recharts
- **HTTP Client**: Axios (Consolidated in `client/src/lib/api-client.ts` with auto-JWT refresh)

### Backend (`/server`)
- **Core**: Node.js + Express + TypeScript (`tsx watch` in dev, `tsc` for build)
- **ORM & Database**: Prisma ORM v6 with PostgreSQL (Neon Serverless or Docker Postgres)
- **Authentication**: JWT Access & Refresh Token rotation + `cookie-parser`
- **Security**: Helmet, CORS, Rate Limiting (`express-rate-limit` + `ioredis` / Redis)
- **Background Jobs**: BullMQ backed by Redis
- **File Storage & PDF**: Multer + Cloudinary, PDFKit for invoices/SOA receipts
- **Logging**: Pino / Pino-pretty, Morgan

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL (v15+) or Docker
- Redis (v7+) or Docker

### 1. Environment Configuration
Copy environment templates in both root and server directories:

```bash
# Root env (for docker-compose & client defaults)
cp .env.example .env

# Server env
cp .env.example server/.env
```

Ensure sensitive credentials (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`) are configured in your local `.env` files and **never** committed to version control.

### 2. Local Infrastructure (Docker option)
To spin up local PostgreSQL and Redis instances:

```bash
docker-compose up -d
```

### 3. Backend Setup (`/server`)
```bash
cd server
npm install

# Run database migrations & generate Prisma client
npm run db:generate
npm run db:migrate

# Seed database with default roles & initial data (Dev mode only)
npm run db:seed

# Start development server
npm run dev
```
Backend API will run on `http://localhost:4000`.

### 4. Frontend Setup (`/client`)
```bash
cd client
npm install
npm run dev
```
Frontend app will run on `http://localhost:5173`.

---

## 📁 Repository Structure

```
Suryadhi-ERP/
├── client/                     # React 19 Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Shared UI components (Radix + Tailwind)
│   │   ├── features/           # Domain feature components & hooks
│   │   ├── pages/              # Route pages
│   │   ├── lib/api-client.ts   # Central Axios HTTP client
│   │   └── store/              # Zustand global state stores
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express TypeScript Backend API
│   ├── prisma/
│   │   └── schema.prisma       # Database schema definition
│   ├── src/
│   │   ├── modules/            # Modular domain services/controllers
│   │   │   ├── auth/           # Authentication & token endpoints
│   │   │   ├── students/       # Student master records
│   │   │   ├── fees/           # Fee structures & collections
│   │   │   ├── soa/            # Statement of Accounts & Royalty
│   │   │   ├── attendance/     # Student & teacher attendance
│   │   │   └── ...
│   │   ├── middleware/         # Auth, Error handling, Rate limits
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml          # Local Postgres & Redis services
└── README.md                   # This documentation
```

---

## 🔒 Security & Data Scoping Rules

1. **School-Level Scoping**: Every non-`SUPER_ADMIN` query must strictly filter by `schoolId` to guarantee strict data isolation across franchisees.
2. **Authentication**: All protected endpoints require a valid Bearer JWT. Automatic token refresh is handled via HTTP-only cookies and `/api/auth/refresh`.
3. **Audit Trails**: All state-changing transactions (Fee Receipts, Admissions, SOA Entries, User status changes) automatically append entries to `AuditLog`.

---

## 🧪 Testing & Verification

```bash
# Server Unit & Integration Tests
cd server
npm run test

# Type-checking & Build Verification
cd server && npm run build
cd client && npm run build
```
