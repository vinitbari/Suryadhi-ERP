# SEMS / EPMS — Production Deployment Runbook

This guide covers step-by-step production deployment procedures for the **Suryadhi Education Management System (SEMS / EPMS)**.

---

## 📋 Pre-Deployment Checklist

- [ ] All environment secrets (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`) generated and configured in hosting provider environment settings.
- [ ] Production database (Neon Serverless Postgres / Managed Postgres) provisioned with SSL connection enabled.
- [ ] Managed Redis provisioned for rate limiting & BullMQ queues.
- [ ] SSL/TLS certificates configured for both frontend domain (e.g. `https://sems.suryadhi.in`) and backend API domain (e.g. `https://api-sems.suryadhi.in`).
- [ ] Dev seed endpoint (`/api/create-rahul`, `/api/seed`) confirmed disabled (`NODE_ENV=production`).

---

## 🚀 Environment Variable Reference

### Server (`/server/.env`)
```ini
PORT=4000
NODE_ENV=production
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require"
REDIS_URL="redis://:<password>@<redis-host>:6379"

JWT_SECRET="<generate-random-64-char-hex-secret>"
JWT_REFRESH_SECRET="<generate-random-64-char-hex-secret>"
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN="https://sems.suryadhi.in"
FRONTEND_URL="https://sems.suryadhi.in"

CLOUDINARY_CLOUD_NAME="<your-cloudinary-name>"
CLOUDINARY_API_KEY="<your-cloudinary-key>"
CLOUDINARY_API_SECRET="<your-cloudinary-secret>"

SENTRY_DSN="https://<key>@sentry.io/<project>"
```

### Client (`/client/.env`)
```ini
VITE_API_URL="https://api-sems.suryadhi.in/api"
```

---

## 🗄️ Database Migration & Deployment

In production, **never** execute `prisma db push` on live database schemas. Use `prisma migrate deploy`:

```bash
cd server

# Apply pending Prisma migrations to production database
npx prisma migrate deploy

# Verify Prisma client code matches schema
npx prisma generate
```

---

## 🐳 Containerized Deployment Guide (Docker)

### 1. Build Production Images
```bash
# Build Backend Express API
docker build -t sems-server:latest ./server

# Build Frontend Vite + Nginx SPA
docker build -t sems-client:latest ./client
```

### 2. Deploy Containers via Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🧪 Post-Deployment Verification (Smoke Test)

Execute these checks immediately after deployment:

1. **Health Check**:
   ```bash
   curl -i https://api-sems.suryadhi.in/api/health
   ```
   Expect HTTP 200 OK with `status: "ok"`.

2. **CORS Lock Verification**:
   ```bash
   curl -i -H "Origin: https://unauthorized-domain.com" https://api-sems.suryadhi.in/api/health
   ```
   Confirm CORS headers reject unauthorized origins.

3. **Frontend Application Test**:
   - Open `https://sems.suryadhi.in` in browser.
   - Perform user login with test account.
   - Verify JWT storage and navigation across Student Records, Admissions, Fee Receipt generation, and SOA Reports.

---

## 🔄 Rollback Procedure

If a critical issue occurs post-deployment:

1. Revert container image tags to prior stable commit hash.
2. If database schema migrations were applied, run down migration or restore Neon point-in-time database snapshot.
3. Restart backend service & clear Redis cache (`redis-cli FLUSHDB`).
