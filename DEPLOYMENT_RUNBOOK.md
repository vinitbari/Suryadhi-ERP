# SEMS / EPMS — Production Deployment Runbook (Render + Vercel)

This runbook documents the step-by-step production deployment instructions for **Suryadhi ERP (SEMS/EPMS)** onto **Render** (Backend API) and **Vercel** (Frontend Client).

---

## 🔒 Security & Environment Secrets Setup

> [!IMPORTANT]
> All sensitive environment variables MUST be entered exclusively in the Render and Vercel dashboard UI. Never commit `.env` files to Git.

### 1. Render Environment Variables (Backend API)

| Variable | Value / Format | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production error handling & disables dev endpoints |
| `PORT` | `10000` | Render assigned HTTP port |
| `DATABASE_URL` | `postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require` | Production Neon Serverless Postgres DB |
| `REDIS_URL` | `redis://:<password>@<redis-host>:6379` | Managed Redis instance |
| `JWT_SECRET` | `<64-char-hex-string>` | Production JWT signing secret |
| `JWT_REFRESH_SECRET` | `<64-char-hex-string>` | Production Refresh Token signing secret |
| `JWT_EXPIRES_IN` | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifespan |
| `CORS_ORIGIN` | `https://sems-epms.vercel.app` (or custom domain) | Locked CORS origin |
| `CLOUDINARY_CLOUD_NAME` | `<your-cloud-name>` | Media asset storage |
| `CLOUDINARY_API_KEY` | `<your-api-key>` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `<your-api-secret>` | Cloudinary API Secret |

### 2. Vercel Environment Variables (Frontend SPA)

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://sems-api.onrender.com/api` (or custom domain) | Backend API endpoint |

---

## 🛠️ Render Web Service Deployment Guide

1. Log into [Render Dashboard](https://dashboard.render.com/) and click **New + -> Web Service**.
2. Connect your private GitHub repository containing `Suryadhi-ERP`.
3. Configure service properties:
   - **Name**: `sems-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
4. Expand **Advanced** and add Pre-Deploy Command:
   - `npx prisma migrate deploy`
5. Paste all Backend Environment Variables into the Environment section.
6. Click **Create Web Service**.

---

## ⚡ Vercel Deployment Guide

1. Log into [Vercel Dashboard](https://vercel.com/) and click **Add New... -> Project**.
2. Import the `Suryadhi-ERP` repository.
3. Configure build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add `VITE_API_URL` set to your Render service URL (e.g. `https://sems-api.onrender.com/api`).
5. Click **Deploy**.

---

## 🔐 Post-Deploy Security Locking & Smoke Test

1. **CORS Lock Verification**:
   - Once Vercel deploys, copy your Vercel URL (e.g. `https://sems-epms.vercel.app`).
   - Go to Render -> `sems-api` -> **Environment** and update `CORS_ORIGIN` to your exact Vercel URL.
   - Trigger a redeploy on Render so CORS is strictly locked down.

2. **Live Health Check**:
   ```bash
   curl -i https://sems-api.onrender.com/api/health
   ```
   Confirm HTTP 200 response with `{"status":"ok"}`.

3. **Dev Endpoint Inaccessibility Audit**:
   ```bash
   curl -i https://sems-api.onrender.com/api/auth/create-rahul
   ```
   Confirm HTTP 404 response.

4. **Live E2E Smoke Test**:
   - Access `https://sems-epms.vercel.app`.
   - Log in with school admin credentials.
   - Verify student listing, enquiry conversion, fee calculation, and receipt generation operate without errors.
