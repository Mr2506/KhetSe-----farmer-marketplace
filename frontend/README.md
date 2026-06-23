# KhetSe — Farmer-to-Consumer Marketplace

Single phone number login with three role-based dashboards: **Buyer**, **Farmer**, and **Admin**.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Prisma 6 + PostgreSQL
- NextAuth.js (phone credentials provider)
- Zustand (client cart state)

## Quick start

1. **Start PostgreSQL**

   ```bash
   docker compose up -d
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Update `AUTH_SECRET` (e.g. `openssl rand -base64 32`).

3. **Install & set up database**

   ```bash
   npm install
   npm run db:setup
   ```

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

| Phone        | Roles              |
|-------------|---------------------|
| 9825012345  | Farmer + Buyer      |
| 9099087654  | Buyer               |
| 9712054321  | Farmer              |
| 9000000000  | Admin               |

Use any demo phone number above to log in directly.

## Route structure

```
app/
  (buyer)/buyer/     → /buyer/browse, /buyer/cart, …
  (farmer)/farmer/   → /farmer/listings, /farmer/orders, …
  (admin)/admin/     → /admin/dashboard, /admin/analytics, …
  login/             → Phone login
  role-select/       → Multi-role switcher
```

Middleware enforces role-based access. Active role is stored in an HTTP-only cookie (`khetse-active-role`).

## Scripts

| Command           | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Development server             |
| `npm run build`  | Production build               |
| `npm run db:setup` | Generate, push schema, seed  |
| `npm run db:seed`  | Re-seed demo data            |
