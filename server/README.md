# EcoSphere ESG Platform Backend

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **Validation**: Zod
- **Logging**: Winston
- **API Docs**: Swagger / OpenAPI

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Setup Instructions

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your database URL and secrets
```

### 3. Generate Prisma client
```bash
npx prisma generate
```

### 4. Run migrations
```bash
npx prisma migrate dev --name init
```

### 5. Seed the database
```bash
npx ts-node prisma/seed.ts
```

### 6. Start the development server
```bash
npm run dev
```

Server runs on **http://localhost:5000**

## API Documentation
Once running, visit **http://localhost:5000/api/docs**

## Default Admin Credentials (after seeding)
- **Email**: admin@ecosphere.com
- **Password**: Admin@123

## Environment Variables
See `.env.example` for all required environment variables.

## API Endpoints Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### Environment Module
- `/api/emission-factors` - Full CRUD
- `/api/carbon-transactions` - Full CRUD
- `/api/product-profiles` - Full CRUD
- `/api/sustainability-goals` - Full CRUD

### Social Module
- `/api/csr-activities` - Full CRUD
- `/api/employee-participation` - Full CRUD
- `/api/training-programs` - Full CRUD
- `GET /api/diversity/stats`

### Governance Module
- `/api/policies` - Full CRUD
- `/api/policy-acknowledgements` - Full CRUD
- `/api/audits` - Full CRUD
- `/api/compliance-issues` - Full CRUD

### Gamification Module
- `/api/challenges` - Full CRUD
- `/api/challenge-participation` - Full CRUD
- `/api/badges` - Full CRUD
- `/api/rewards` - Full CRUD
- `/api/reward-redemptions` - Full CRUD
- `GET /api/leaderboard`

### Reports
- `GET /api/reports/environmental`
- `GET /api/reports/social`
- `GET /api/reports/governance`
- `GET /api/reports/esg-summary`

### Settings
- `/api/departments` - Full CRUD
- `/api/categories` - Full CRUD

### Notifications
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`
- `DELETE /api/notifications/:id`
