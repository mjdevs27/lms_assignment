# Loan Management System -- Backend

> Backend API for a Loan Management System built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Mongoose**.

---

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Runtime     | Node.js                             |
| Framework   | Express.js                          |
| Language    | TypeScript                          |
| Database    | MongoDB 7 (Docker)                  |
| ODM         | Mongoose                            |
| Auth        | JWT (jsonwebtoken) + bcrypt         |
| Dev Tools   | ts-node-dev, Docker Compose         |

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                        # Express app configuration
│   ├── server.ts                     # Server entry point
│   ├── config/
│   │   ├── env.ts                    # Environment variable loader
│   │   └── db.ts                     # Mongoose connection
│   ├── constants/
│   │   ├── roles.ts                  # User role constants
│   │   └── employmentModes.ts        # Employment mode constants
│   ├── controllers/
│   │   ├── health.controller.ts      # Health check handler
│   │   └── auth.controller.ts        # Signup / Login / Me handlers
│   ├── middleware/
│   │   ├── error.middleware.ts       # Global error handler
│   │   ├── auth.middleware.ts        # JWT authentication middleware
│   │   └── rbac.middleware.ts        # Role-based access control
│   ├── models/
│   │   └── User.model.ts            # Mongoose User schema
│   ├── routes/
│   │   ├── health.routes.ts          # /health route
│   │   ├── auth.routes.ts            # /api/auth routes
│   │   └── debug.routes.ts           # Dev-only middleware test routes
│   ├── services/
│   │   └── auth.service.ts           # Auth business logic
│   ├── types/
│   │   ├── user.types.ts             # IUser interface
│   │   └── express.d.ts              # Express Request augmentation
│   ├── utils/
│   │   ├── ApiError.ts               # Custom error class
│   │   ├── ApiResponse.ts            # Response wrapper
│   │   ├── password.ts               # bcrypt hash/compare
│   │   └── jwt.ts                    # JWT sign/verify
│   └── validators/
│       └── user.validator.ts         # Email and PAN validators
├── docker-compose.yml                # MongoDB + Mongo Express
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MongoDB)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` to set a strong `JWT_SECRET` for production.

### 3. Start MongoDB (Docker)

```bash
docker compose up -d
```

This starts:
- **MongoDB** on `localhost:27017`
- **Mongo Express** (admin UI) on `http://localhost:8081`

### 4. Start the development server

```bash
npm run dev
```

The API starts on `http://localhost:5000`.

---

## Docker Commands

| Command                    | Description                 |
| -------------------------- | --------------------------- |
| `docker compose up -d`    | Start MongoDB in background |
| `docker compose down`     | Stop all services           |
| `docker compose down -v`  | Stop and delete volumes     |
| `docker compose logs -f`  | Stream service logs         |
| `docker compose ps`       | List running containers     |

---

## NPM Scripts

| Script             | Command              | Description                    |
| ------------------ | --------------------- | ------------------------------ |
| `npm run dev`      | `ts-node-dev`         | Start dev server with hot-reload |
| `npm run build`    | `tsc`                 | Compile TypeScript to `dist/`  |
| `npm start`        | `node dist/server.js` | Run production build           |
| `npm run type-check` | `tsc --noEmit`      | Type-check without emitting    |

---

## API Endpoints

### Health Check

```
GET /health
```

**Response (200):**

```json
{
  "success": true,
  "message": "LMS backend is running",
  "data": {
    "service": "loan-management-backend",
    "status": "healthy",
    "database": "connected",
    "uptime": 12.345,
    "timestamp": "2026-06-06T12:00:00.000Z"
  }
}
```

### Signup (Borrower Only)

```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "Test Borrower",
  "email": "borrower@example.com",
  "password": "Password@123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Test Borrower",
      "email": "borrower@example.com",
      "role": "BORROWER",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "borrower@example.com",
  "password": "Password@123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "user": { ... }
  }
}
```

### Unknown Route (404)

```
GET /any-unknown-path
```

**Response (404):**

```json
{
  "success": false,
  "message": "Route not found: GET /any-unknown-path"
}
```

### Debug Routes (Development Only)

These routes are only available when `NODE_ENV=development`:

```
GET /api/debug/authenticated     # Test: any authenticated user
GET /api/debug/borrower-only     # Test: BORROWER role only
GET /api/debug/admin-only        # Test: ADMIN role only
GET /api/debug/dashboard-only    # Test: dashboard-eligible roles
```

---

## User Roles

| Role         | Access                          |
| ------------ | ------------------------------- |
| ADMIN        | All dashboard modules           |
| SALES        | Sales dashboard module          |
| SANCTION     | Sanction dashboard module       |
| DISBURSEMENT | Disbursement dashboard module   |
| COLLECTION   | Collection dashboard module     |
| BORROWER     | Borrower portal only            |

---

## Environment Variables

| Variable             | Description                | Default / Required                                              |
| -------------------- | -------------------------- | --------------------------------------------------------------- |
| `PORT`               | Server port                | `5000`                                                          |
| `NODE_ENV`           | Environment mode           | `development`                                                   |
| `MONGO_URI`          | MongoDB connection string  | **Required**                                                    |
| `CORS_ORIGIN`        | Allowed CORS origin        | `http://localhost:3000`                                         |
| `JWT_SECRET`         | JWT signing secret         | **Required**                                                    |
| `JWT_EXPIRES_IN`     | Token expiry duration      | `7d`                                                            |
| `BCRYPT_SALT_ROUNDS` | bcrypt salt rounds         | `10`                                                            |

---

## Seed Users and Evaluator Credentials

Run the seed script to create one account per role:

```bash
npm run seed
```

The script is idempotent. Running it multiple times will not create duplicates.

| Role         | Email                  | Password     |
| ------------ | ---------------------- | ------------ |
| Admin        | admin@lms.com          | Password@123 |
| Sales        | sales@lms.com          | Password@123 |
| Sanction     | sanction@lms.com       | Password@123 |
| Disbursement | disbursement@lms.com   | Password@123 |
| Collection   | collection@lms.com     | Password@123 |
| Borrower     | borrower@lms.com       | Password@123 |

The borrower seed account is pre-filled with a valid profile (PAN, salary, employment mode) and marked eligible.

### RBAC Authorization Test

Make sure the backend is running before executing:

```bash
npm run test:rbac
```

This script logs in as each seed user, tests all protected routes, and prints a pass/fail table verifying role-based access control.

---

## Roadmap

- [x] Job 01 -- Project setup + TypeScript architecture
- [x] Job 02 -- Dockerized MongoDB + local environment
- [x] Job 03 -- Database connection + Mongoose base setup
- [x] Job 04 -- User model + role system
- [x] Job 05 -- Authentication system (signup, login, JWT)
- [x] Job 06 -- Auth middleware + RBAC middleware
- [x] Job 07 -- Business Rule Engine service
- [x] Job 08 -- Borrower profile + eligibility API
- [x] Job 09 -- Salary slip upload system
- [x] Job 10 -- Loan model + interest calculation service
- [x] Job 11 -- Borrower loan application API
- [x] Job 12 -- Sales module backend
- [x] Job 13 -- Sanction module backend
- [x] Job 14 -- Disbursement module backend
- [x] Job 15 -- Collection payment + auto loan closure
- [x] Job 16 -- Seed users + RBAC authorization testing
