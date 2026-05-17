You are a senior backend engineer working inside Antigravity using Claude Opus 4.8.

We are building the backend for a Loan Management System assignment.

Current backend stack:
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Role-based access control
- multer for file uploads

Previous jobs are already completed and working:
1. Backend Project Setup + TypeScript Architecture
2. Dockerized MongoDB + Local Backend Environment
3. Mongoose Database Connection Setup
4. User Model + Role System
5. Authentication System: Signup, Login, JWT
6. Auth Middleware + RBAC Middleware
7. Business Rule Engine Service
8. Borrower Profile + Eligibility API
9. Salary Slip Upload System

Now implement ONLY Jobs 10, 11, and 12.

Strict rule:
Do not use emojis anywhere in code, comments, logs, API responses, README updates, console output, seed data, error messages, or final summaries.

Do not implement future jobs.
Do not create Sanction module yet.
Do not create Disbursement module yet.
Do not create Collection module yet.
Do not create Payment model yet.
Do not create frontend code.

The assignment requires loan configuration, simple interest calculation, loan application creation, and a Sales dashboard module for users who registered but have not applied yet.

==================================================
JOB 10: LOAN MODEL + INTEREST CALCULATION SERVICE
==================================================

Objective:
Create the Loan model and backend loan calculation service.

Loan configuration rules:
- Loan amount minimum: INR 50000
- Loan amount maximum: INR 500000
- Tenure minimum: 30 days
- Tenure maximum: 365 days
- Interest rate: fixed at 12 percent per annum

Formula:
SI = (P * R * T) / (365 * 100)
Total Repayment = P + SI

Where:
- P = loan amount
- R = annual interest rate
- T = tenure in days

Required loan statuses:
- APPLIED
- SANCTIONED
- REJECTED
- DISBURSED
- CLOSED

Expected files:
- src/constants/loan.constants.ts
- src/types/loan.types.ts
- src/models/Loan.model.ts
- src/utils/loanCalculation.util.ts
- src/validators/loan.validator.ts
- src/services/loanCalculation.service.ts
- src/scripts/testLoanCalculation.ts

Required constants:
MIN_LOAN_AMOUNT = 50000
MAX_LOAN_AMOUNT = 500000
MIN_TENURE_DAYS = 30
MAX_TENURE_DAYS = 365
FIXED_INTEREST_RATE = 12
DAYS_IN_YEAR = 365

Loan model required fields:
- borrowerId
- fullName
- pan
- dob
- monthlySalary
- employmentMode
- salarySlipUrl
- salarySlipOriginalName
- salarySlipMimeType
- salarySlipSize
- loanAmount
- tenureDays
- interestRate
- interestAmount
- totalRepayment
- totalPaid
- outstandingAmount
- status
- rejectionReason
- sanctionedBy
- sanctionedAt
- rejectedBy
- rejectedAt
- disbursedBy
- disbursedAt
- closedAt
- createdAt
- updatedAt

Rules:
- borrowerId must reference User.
- status default should be APPLIED.
- totalPaid default should be 0.
- outstandingAmount initially equals totalRepayment.
- interestRate should be fixed at 12.
- Store money values as numbers.
- Round interestAmount and totalRepayment to 2 decimal places.
- Do not trust frontend-calculated values.
- Do not create APIs in Job 10 except local test script.

Create pure utility:
calculateSimpleInterest(input)

Input:
{
  principal: number;
  annualRate: number;
  tenureDays: number;
}

Output:
{
  principal: number;
  annualRate: number;
  tenureDays: number;
  interestAmount: number;
  totalRepayment: number;
}

Create service:
calculateLoanQuote(input)

Input:
{
  loanAmount: number;
  tenureDays: number;
}

Output if valid:
{
  valid: true;
  data: {
    loanAmount: number;
    tenureDays: number;
    interestRate: 12;
    interestAmount: number;
    totalRepayment: number;
    outstandingAmount: number;
  };
}

Output if invalid:
{
  valid: false;
  errors: [...]
}

Validation rules:
- loanAmount required
- loanAmount must be number
- loanAmount between 50000 and 500000
- tenureDays required
- tenureDays must be number
- tenureDays must be integer
- tenureDays between 30 and 365

Validation error codes:
- LOAN_AMOUNT_REQUIRED
- LOAN_AMOUNT_INVALID
- LOAN_AMOUNT_BELOW_MINIMUM
- LOAN_AMOUNT_ABOVE_MAXIMUM
- TENURE_REQUIRED
- TENURE_INVALID
- TENURE_BELOW_MINIMUM
- TENURE_ABOVE_MAXIMUM

Add local test script:
npm run test:loan-calc

Test cases:
1. 50000 for 30 days
2. 100000 for 180 days
3. 500000 for 365 days
4. Amount below 50000
5. Amount above 500000
6. Tenure below 30
7. Tenure above 365
8. Decimal tenure should fail
9. Non-number input should fail
10. Zero amount should fail

Acceptance criteria:
- Loan model compiles.
- Loan constants are centralized.
- Loan calculation is correct.
- Invalid loan inputs return structured errors.
- npm run test:loan-calc works.
- npm run type-check passes.
- npm run build passes.

==================================================
JOB 11: BORROWER LOAN APPLICATION API
==================================================

Objective:
Create borrower APIs for loan quote, loan application, and borrower loan retrieval.

Required base route:
/api/borrower

Required endpoints:
1. POST /api/borrower/loan/quote
2. POST /api/borrower/apply-loan
3. GET /api/borrower/my-loan
4. GET /api/borrower/my-loans

All routes require:
- valid JWT
- role BORROWER only

Expected behavior:
- No token: 401 Unauthorized
- Invalid token: 401 Unauthorized
- Wrong role: 403 Forbidden
- Borrower token: allowed

POST /api/borrower/loan/quote:
Purpose:
Return backend-calculated loan quote without saving anything.

Request:
{
  "loanAmount": 100000,
  "tenureDays": 180
}

Success:
{
  "success": true,
  "message": "Loan quote calculated successfully.",
  "data": {
    "loanAmount": 100000,
    "tenureDays": 180,
    "interestRate": 12,
    "interestAmount": 5917.81,
    "totalRepayment": 105917.81,
    "outstandingAmount": 105917.81
  }
}

Rules:
- Do not create loan.
- Do not save quote.
- Do not accept interestRate from request.
- Use backend calculation service from Job 10.

POST /api/borrower/apply-loan:
Purpose:
Create a loan with APPLIED status.

Request:
{
  "loanAmount": 100000,
  "tenureDays": 180
}

Before creating loan, verify:
1. User exists.
2. User role is BORROWER.
3. Borrower profile is complete.
4. Borrower profile has fullName, pan, dob, monthlySalary, employmentMode.
5. Borrower still passes BRE.
6. Borrower has uploaded salary slip.
7. loanAmount and tenureDays are valid.
8. Borrower does not already have an active loan.

Active loan statuses:
- APPLIED
- SANCTIONED
- DISBURSED

If active loan exists:
Return 409 Conflict.

Rejected and closed loans should not block future applications.

Loan creation rules:
- borrowerId must come from JWT user, not request body.
- Copy borrower profile into loan snapshot.
- Copy salary slip metadata into loan snapshot.
- Calculate interest on backend.
- Set status to APPLIED.
- Set totalPaid to 0.
- Set outstandingAmount to totalRepayment.

GET /api/borrower/my-loan:
Purpose:
Return latest loan for logged-in borrower.

Sort:
createdAt descending

If no loan exists:
Return 404 Not Found.

GET /api/borrower/my-loans:
Purpose:
Return all loans for logged-in borrower.

Sort:
createdAt descending

Expected files:
- src/controllers/loan.controller.ts
- src/services/loan.service.ts
- src/types/loanApplication.types.ts

Modify:
- src/routes/borrower.routes.ts
- src/app.ts only if borrower route mounting is missing

Recommended service functions:
- getLoanQuote(input)
- applyForLoan(borrowerId, input)
- getLatestBorrowerLoan(borrowerId)
- getBorrowerLoans(borrowerId)
- hasActiveLoan(borrowerId)

Security rules:
- Borrower can only create loan for self.
- Do not accept borrowerId from body.
- Do not return passwordHash.
- Do not expose another borrower's loans.
- Re-run BRE before loan creation.
- Backend recalculates all loan math.

Acceptance criteria:
- Quote API works.
- Apply API works.
- Borrower latest loan API works.
- Borrower all loans API works.
- Borrower without profile cannot apply.
- Borrower without salary slip cannot apply.
- BRE failure blocks application.
- Active duplicate loan is blocked.
- Loan starts with APPLIED status.
- npm run type-check passes.
- npm run build passes.

==================================================
JOB 12: SALES MODULE BACKEND
==================================================

Objective:
Create backend APIs for the Sales dashboard module.

Sales module definition:
Sales handles the pre-application stage. It shows registered borrowers who have not applied for a loan yet.

Required base route:
/api/dashboard

Required Sales routes:
1. GET /api/dashboard/sales/leads
2. GET /api/dashboard/sales/leads/:borrowerId

Access:
Allowed roles:
- ADMIN
- SALES

Blocked roles:
- SANCTION
- DISBURSEMENT
- COLLECTION
- BORROWER

Expected behavior:
- No token: 401 Unauthorized
- Invalid token: 401 Unauthorized
- Wrong role: 403 Forbidden
- Admin token: allowed
- Sales token: allowed

Lead definition:
A Sales lead is a user with role BORROWER who has no loan document at all.

Important:
If borrower has APPLIED, SANCTIONED, REJECTED, DISBURSED, or CLOSED loan, they should not appear in Sales leads.

GET /api/dashboard/sales/leads:
Purpose:
Return registered borrowers who have not applied yet.

Query params:
- page
- limit
- search
- profileStatus
- sortBy
- sortOrder

Defaults:
page = 1
limit = 10
sortBy = createdAt
sortOrder = desc

Search should match:
- fullName
- email
- pan

profileStatus:
- complete
- incomplete

Returned lead fields:
- id
- fullName
- email
- pan
- dob
- monthlySalary
- employmentMode
- isProfileComplete
- salarySlipUploaded
- salarySlipUrl
- createdAt
- updatedAt

Never return:
- passwordHash
- password
- reset tokens
- sensitive auth fields

GET /api/dashboard/sales/leads/:borrowerId:
Purpose:
Return detail for one borrower lead if they have no loan.

Return 404 if:
- borrower does not exist
- user is not borrower
- borrower already has a loan

Expected files:
- src/routes/dashboard.routes.ts
- src/routes/sales.routes.ts
- src/controllers/sales.controller.ts
- src/services/sales.service.ts
- src/types/sales.types.ts
- src/validators/pagination.validator.ts
- src/utils/pagination.util.ts

Modify:
- src/app.ts

Recommended route mounting:
app.use("/api/dashboard", dashboardRoutes)

dashboard.routes.ts:
router.use("/sales", salesRoutes)

sales.routes.ts:
GET /leads with authMiddleware and requireRoles("ADMIN", "SALES")
GET /leads/:borrowerId with authMiddleware and requireRoles("ADMIN", "SALES")

Query strategy:
Use either aggregation or two-query approach.

Acceptable two-query approach:
1. Get borrowerIds from Loan collection.
2. Find Users with role BORROWER and _id not in borrowerIds.
3. Apply search/filter/pagination.
4. Return safe fields only.

Acceptance criteria:
- Sales leads list API works.
- Sales lead detail API works.
- Sales/Admin can access.
- Borrower cannot access.
- Sanction/Disbursement/Collection cannot access.
- Borrowers with any loan are excluded.
- Pagination works.
- Search works.
- passwordHash is never returned.
- npm run type-check passes.
- npm run build passes.

==================================================
FINAL OUTPUT REQUIRED AFTER IMPLEMENTATION
==================================================

After implementing Jobs 10, 11, and 12, provide:

1. List of files created.
2. List of files modified.
3. Commands to run.
4. How to test Job 10.
5. How to test Job 11.
6. How to test Job 12.
7. Curl commands for new APIs.
8. Confirmation that npm run test:loan-calc passes.
9. Confirmation that npm run type-check passes.
10. Confirmation that npm run build passes.
11. Any assumptions made.
12. TODOs for Job 13.

Do not implement Job 13.
Do not implement Sanction approval or rejection.
Do not implement Disbursement.
Do not implement Collection.
Do not implement Payment model.
Do not implement frontend code.
Use no emojis anywhere.