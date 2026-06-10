# CreditSea LMS

CreditSea LMS is a role-based loan management system designed to manage the complete loan lifecycle from borrower application to sales processing, document verification, and admin-level monitoring.

The system separates workflows across four major roles: **Borrower**, **Sales**, **Verifier**, and **Admin**. Each role gets its own dashboard, permissions, and loan-processing responsibilities.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Objective](#core-objective)
- [Role-Based Workflow](#role-based-workflow)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Running with Docker](#running-with-docker)
- [Running Frontend](#running-frontend)
- [Running Backend](#running-backend)
- [Default Test Users](#default-test-users)
- [Role-Based Routing](#role-based-routing)
- [Backend API Overview](#backend-api-overview)
- [Database Collections](#database-collections)
- [MongoDB Atlas Usage](#mongodb-atlas-usage)
- [Video Demo Flow](#video-demo-flow)
- [Troubleshooting](#troubleshooting)
- [Future Scope](#future-scope)

---

## Project Overview

CreditSea LMS is a full-stack loan management platform where users interact with the system based on their assigned role.

The application solves the problem of mixing borrower, sales, verifier, and admin operations into one common interface. Instead, each role is redirected to a dedicated dashboard after login.

### Main Idea

```txt
Borrower -> Applies for loan
Sales -> Handles borrower/application intake
Verifier -> Verifies documents and borrower details
Admin -> Monitors and manages the full system
```

---

## Core Objective

The objective of this project is to build a clean and efficient role-based LMS where:

- Borrowers can apply for loans and track status.
- Sales users can manage leads and move applications forward.
- Verifiers can validate documents and approve/reject verification.
- Admin users can monitor users, loans, applications, and system-level activity.
- Authentication and routing are controlled by the role stored in MongoDB.
- Each user sees only the pages and actions allowed for their role.

---

## Role-Based Workflow

### Borrower

The borrower is the loan applicant.

Borrower can:

- Register/login.
- Complete profile.
- Apply for loan.
- Upload salary slip or required documents.
- Track loan application status.
- View repayment or payment details.

Expected dashboard:

```txt
/borrower/home
```

### Sales

The sales user handles borrower onboarding and application movement.

Sales can:

- View borrower leads.
- Check borrower profiles.
- View submitted loan applications.
- Move applications forward in the workflow.
- Coordinate borrower intake.

Expected dashboard:

```txt
/sales/dashboard
```

### Verifier

The verifier validates submitted borrower information and uploaded documents.

Verifier can:

- View applications pending verification.
- Check borrower documents.
- Approve or reject verification.
- Add remarks.
- Send applications back for correction.

Expected dashboard:

```txt
/verifier/dashboard
```

### Admin

The admin controls and monitors the full LMS.

Admin can:

- View all users.
- Manage roles.
- View all loan applications.
- Monitor loan pipeline.
- Track approvals, rejections, and pending cases.
- Manage sales and verifier users.

Expected dashboard:

```txt
/admin/dashboard
```

---

## Features

### Authentication

- User login.
- JWT-based authentication.
- Role stored in MongoDB.
- Role returned from backend login API.
- Frontend redirect based on user role.
- Protected role-specific routes.

### Borrower Module

- Borrower dashboard.
- Profile completion.
- Loan application submission.
- Document/salary slip upload.
- Loan status tracking.
- Payment/repayment view.

### Sales Module

- Sales dashboard.
- Borrower lead management.
- Application intake.
- Application status movement.
- Borrower case tracking.

### Verifier Module

- Verifier dashboard.
- Pending verification queue.
- Document checking.
- Approve/reject verification.
- Verification remarks.

### Admin Module

- Admin dashboard.
- User management.
- Role management.
- All applications overview.
- Loan pipeline monitoring.
- System statistics.

---

## Tech Stack

### Frontend

- Next.js / React
- TypeScript
- Tailwind CSS
- Role-based routing
- Protected layouts
- LocalStorage/session-based frontend auth handling

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt password hashing
- Role-based middleware

### DevOps / Tools

- Docker
- Docker Compose
- MongoDB
- Mongo Express
- MongoDB Atlas
- Git / GitHub

---

## System Architecture

```txt
                    ┌────────────────────┐
                    │      Frontend      │
                    │ Next.js / React    │
                    └─────────┬──────────┘
                              │
                              │ API Requests
                              ▼
                    ┌────────────────────┐
                    │      Backend       │
                    │ Node.js + Express  │
                    └─────────┬──────────┘
                              │
                              │ Mongoose
                              ▼
                    ┌────────────────────┐
                    │      MongoDB       │
                    │ Users + Loans      │
                    └────────────────────┘
```

### Authentication Flow

```txt
User enters credentials
        ↓
Frontend sends login request
        ↓
Backend validates email/password
        ↓
Backend fetches user.role from MongoDB
        ↓
Backend returns token + user object
        ↓
Frontend stores token and user
        ↓
Frontend redirects using user.role
        ↓
User lands on correct dashboard
```

---

## Folder Structure

```txt
internship_creditsea/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── seedUsers.js
│   │   └── server.js
│   │
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── borrower/
│   │   │   ├── sales/
│   │   │   ├── verifier/
│   │   │   └── admin/
│   │   │
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## Environment Variables

### Backend `.env`

Create this file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/creditsea
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

For MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/creditsea
```

### Frontend `.env.local`

Create this file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Installation and Setup

Clone the repository:

```bash
git clone <your-repository-url>
cd internship_creditsea
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## Running with Docker

From the backend folder:

```bash
cd backend
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Stop containers:

```bash
docker compose down
```

Remove orphan containers:

```bash
docker compose down --remove-orphans
```

---

## Running Backend

From the backend folder:

```bash
cd backend
npm run dev
```

or:

```bash
npm start
```

Expected backend URL:

```txt
http://localhost:5000
```

Health check endpoint, if available:

```txt
http://localhost:5000/api/health
```

---

## Running Frontend

From the frontend folder:

```bash
cd frontend
npm run dev
```

Expected frontend URL:

```txt
http://localhost:3000
```

---

## Default Test Users

| Role | Email | Password | Expected Route |
|---|---|---|---|
| Admin | `admin@lms.com` | `password123` | `/admin/dashboard` |
| Sales | `sales@lms.com` | `password123` | `/sales/dashboard` |
| Verifier | `verifier@lms.com` | `password123` | `/verifier/dashboard` |
| Borrower | `borrower@lms.com` | `password123` | `/borrower/home` |

---

## Seed Users

Create a seed script to insert/update role-based users.

### File

```txt
backend/src/seedUsers.js
```

### Example Script

```js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/creditsea";

async function seedUsers() {
  await mongoose.connect(MONGO_URI);

  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    { fullName: "Admin User", email: "admin@lms.com", passwordHash, role: "ADMIN", isActive: true, isProfileComplete: true },
    { fullName: "Sales User", email: "sales@lms.com", passwordHash, role: "SALES", isActive: true, isProfileComplete: true },
    { fullName: "Verifier User", email: "verifier@lms.com", passwordHash, role: "VERIFIER", isActive: true, isProfileComplete: true },
    { fullName: "Borrower User", email: "borrower@lms.com", passwordHash, role: "BORROWER", isActive: true, isProfileComplete: true }
  ];

  for (const user of users) {
    await User.updateOne(
      { email: user.email },
      { $set: user },
      { upsert: true }
    );
  }

  console.log("Seed users created/updated successfully");
  process.exit(0);
}

seedUsers().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Run seed script:

```bash
cd backend
node src/seedUsers.js
```

---

## Role-Based Routing

The system should use one central role-route mapping.

### File

```txt
frontend/src/lib/roleRoutes.ts
```

### Code

```ts
export type UserRole = "ADMIN" | "BORROWER" | "SALES" | "VERIFIER";

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  BORROWER: "/borrower/home",
  SALES: "/sales/dashboard",
  VERIFIER: "/verifier/dashboard",
};

export function getDashboardRouteByRole(role?: string): string {
  switch (role) {
    case "ADMIN":
      return ROLE_DASHBOARD_ROUTES.ADMIN;
    case "SALES":
      return ROLE_DASHBOARD_ROUTES.SALES;
    case "VERIFIER":
      return ROLE_DASHBOARD_ROUTES.VERIFIER;
    case "BORROWER":
      return ROLE_DASHBOARD_ROUTES.BORROWER;
    default:
      return "/login";
  }
}
```

### Correct Login Redirect

```ts
const response = await login(values.email, values.password);

const { token, user } = response;

localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

const dashboardRoute = getDashboardRouteByRole(user.role);

router.push(dashboardRoute);
```

Do not hardcode:

```ts
router.push("/borrower/home");
```

---

## Protected Routes

Each dashboard should be protected by role.

### RequireRole Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboardRouteByRole } from "@/lib/roleRoutes";

type RequireRoleProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !rawUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      if (!user?.role) {
        localStorage.clear();
        sessionStorage.clear();
        router.replace("/login");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        router.replace(getDashboardRouteByRole(user.role));
        return;
      }

      setAllowed(true);
    } catch {
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
    }
  }, [allowedRoles, router]);

  if (!allowed) return null;

  return <>{children}</>;
}
```

Example Admin layout:

```tsx
"use client";

import { RequireRole } from "@/components/auth/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole allowedRoles={["ADMIN"]}>{children}</RequireRole>;
}
```

---

## Backend API Overview

Common API structure:

```txt
/api/auth/register
/api/auth/login
/api/auth/me

/api/borrower/profile
/api/borrower/applications
/api/borrower/documents
/api/borrower/payments

/api/sales/leads
/api/sales/applications

/api/verifier/applications
/api/verifier/documents
/api/verifier/verify

/api/admin/users
/api/admin/applications
/api/admin/loans
/api/admin/dashboard
```

---

## Backend Role Middleware

Backend APIs must also check role permissions.

```js
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
};

module.exports = requireRole;
```

Example route usage:

```js
router.get("/admin/users", authMiddleware, requireRole("ADMIN"), getAllUsers);
router.get("/sales/applications", authMiddleware, requireRole("SALES", "ADMIN"), getSalesApplications);
router.get("/verifier/applications", authMiddleware, requireRole("VERIFIER", "ADMIN"), getVerifierApplications);
router.get("/borrower/profile", authMiddleware, requireRole("BORROWER"), getBorrowerProfile);
```

---

## Database Collections

### users

Stores user authentication and role information.

```js
{
  fullName: String,
  email: String,
  passwordHash: String,
  role: "ADMIN" | "BORROWER" | "SALES" | "VERIFIER",
  isActive: Boolean,
  isProfileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### applications

Stores loan applications.

```js
{
  borrowerId: ObjectId,
  amount: Number,
  purpose: String,
  status: String,
  assignedSalesId: ObjectId,
  assignedVerifierId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### documents

Stores document metadata.

```js
{
  borrowerId: ObjectId,
  applicationId: ObjectId,
  documentType: String,
  fileUrl: String,
  verificationStatus: String,
  remarks: String,
  uploadedAt: Date
}
```

### payments

Stores repayment/payment information.

```js
{
  borrowerId: ObjectId,
  applicationId: ObjectId,
  amount: Number,
  dueDate: Date,
  paymentStatus: String,
  paidAt: Date
}
```

---

## MongoDB Atlas Usage

If using MongoDB Atlas:

1. Open MongoDB Atlas.
2. Go to your cluster.
3. Click **Browse Collections**.
4. Open your database, for example `creditsea`.
5. Open the `users` collection.
6. Check the `role` field.

Correct role examples:

```txt
admin@lms.com      -> ADMIN
sales@lms.com      -> SALES
verifier@lms.com   -> VERIFIER
borrower@lms.com   -> BORROWER
```

To manually fix admin role:

```js
db.users.updateOne(
  { email: "admin@lms.com" },
  {
    $set: {
      role: "ADMIN",
      isActive: true,
      isProfileComplete: true
    }
  }
)
```

---

## Video Demo Flow

Recommended 3-5 minute demo order:

```txt
1. Show login page.
2. Explain four roles.
3. Login as borrower and show borrower dashboard.
4. Logout.
5. Login as sales and show sales dashboard.
6. Logout.
7. Login as verifier and show verifier dashboard.
8. Logout.
9. Login as admin and show admin dashboard.
10. Briefly explain MongoDB role as single source of truth.
```

Main demo line:

```txt
CreditSea LMS uses MongoDB user.role as the single source of truth. During login, the backend returns the role, and the frontend redirects each user to the correct protected dashboard.
```

---

## Troubleshooting

### Every user is going to borrower page

Cause:

- Frontend has hardcoded borrower redirect.
- Backend is returning role as `BORROWER`.
- MongoDB user role is wrongly saved as `BORROWER`.
- Old localStorage data still exists.

Fix:

```js
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Search frontend:

```cmd
findstr /S /I "borrower BORROWER_HOME router.push" frontend\src\*.ts frontend\src\*.tsx
```

Search backend:

```cmd
findstr /S /I "BORROWER" backend\src\*.js backend\src\*.ts
```

### Docker pipe error

Error:

```txt
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified
```

Cause:

Docker Desktop Linux Engine is not running.

Fix:

1. Open Docker Desktop manually.
2. Wait until Docker Engine is running.
3. In PowerShell, run:

```powershell
docker info --format "{{.ServerVersion}}"
```

If still broken:

```powershell
wsl --shutdown
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

### Docker service permission issue

Error:

```txt
Cannot open com.docker.service service on computer '.'
```

Cause:

PowerShell is not running as Administrator.

Fix:

- Open PowerShell as Administrator.
- Run Docker commands again.

### Page shows 404 after login

Cause:

The role redirect is working, but the dashboard route does not exist.

Fix:

Create the missing page.

```txt
frontend/src/app/admin/dashboard/page.tsx
frontend/src/app/sales/dashboard/page.tsx
frontend/src/app/verifier/dashboard/page.tsx
frontend/src/app/borrower/home/page.tsx
```

### Mongo Express image issue

Error:

```txt
unable to get image 'mongo-express:latest'
```

Possible cause:

Docker Engine is not running or Docker cannot pull images.

Fix:

```bash
docker compose down
docker compose pull
docker compose up -d
```

---

## Future Scope

- Loan approval automation.
- EMI calculator.
- Email/SMS notification system.
- Admin analytics dashboard.
- Document OCR verification.
- Credit score integration.
- Payment gateway integration.
- Audit logs for every status change.
- Advanced access control.
- Cloud deployment.
- CI/CD pipeline.
- Role-based analytics for admin, sales, and verifier.

---

## Final Summary

CreditSea LMS is a role-based loan management platform that separates loan workflows across Borrower, Sales, Verifier, and Admin dashboards.

The key implementation rule is:

```txt
MongoDB user.role is the single source of truth.
```

The backend reads this role during login, returns it in the login response and JWT, and the frontend redirects the user to the correct protected dashboard.

Expected final behavior:

```txt
Admin login    -> /admin/dashboard
Sales login    -> /sales/dashboard
Verifier login -> /verifier/dashboard
Borrower login -> /borrower/home
```
