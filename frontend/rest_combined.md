You are a senior frontend engineer working inside Antigravity using Claude Opus 4.6.

We are building the frontend for a Loan Management System assignment.

Frontend stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- React

Backend is already completed and tested.

Backend runs at:
http://localhost:5000

Backend API base URL:
http://localhost:5000/api

Previous frontend jobs are completed:
1. Frontend Project Setup + Styling Base
2. API Client + Auth State Layer
3. Login + Signup Pages
4. Route Guards + Role-Based Layouts
5. Shared UI Components
6. Borrower Home + Profile/BRE Page

Now implement ONLY Jobs 7, 8, 9, and 10.

Strict rule:
Do not use emojis anywhere in code, comments, UI text, logs, README content, console output, error messages, or final summaries.

UI direction:
Simple, slick, minimal, responsive.
No extravagant features.
No charts.
No analytics.
No heavy animations.
No mock data.
Do not fake backend responses.
Use backend APIs only.
Do not modify backend code.

==================================================
JOB 7: SALARY SLIP UPLOAD + LOAN APPLY PAGE
==================================================

Objective:
Build borrower salary slip upload and loan configuration/apply pages.

Backend APIs:
POST /api/borrower/upload-salary-slip
POST /api/borrower/loan/quote
POST /api/borrower/apply-loan
GET /api/borrower/profile
GET /api/borrower/my-loan

Pages:
app/borrower/upload-slip/page.tsx
app/borrower/apply/page.tsx

Create:
types/loan.types.ts
types/upload.types.ts
lib/upload-api.ts
lib/loan-api.ts
components/borrower/SalarySlipUploadForm.tsx
components/borrower/SalarySlipStatusCard.tsx
components/borrower/LoanAmountSlider.tsx
components/borrower/TenureSlider.tsx
components/borrower/LoanQuoteCard.tsx
components/borrower/LoanApplyForm.tsx

Rules:
- Upload accepts PDF/JPG/PNG only.
- Max file size: 5 MB.
- FormData field name must be salarySlip.
- Do not manually set Content-Type for FormData.
- Loan amount range: 50000 to 500000.
- Tenure range: 30 to 365 days.
- Interest rate fixed at 12 percent p.a.
- Backend quote API is source of truth.
- Do not calculate final quote only on frontend.
- Apply success redirects to /borrower/my-loan.
- Active duplicate loan error should display clearly.

Acceptance:
- upload page works
- invalid file type blocked
- large file blocked
- backend upload works
- apply page works
- sliders work
- quote updates from backend
- apply loan works
- npm run build passes

==================================================
JOB 8: BORROWER LOAN STATUS + PAYMENT HISTORY
==================================================

Objective:
Build borrower tracking pages.

Backend APIs:
GET /api/borrower/my-loan
GET /api/borrower/my-loans
GET /api/borrower/my-payments

Pages:
app/borrower/my-loan/page.tsx
app/borrower/payments/page.tsx

Create:
types/payment.types.ts
lib/payment-api.ts
components/borrower/LoanStatusTimeline.tsx
components/borrower/LoanDetailsCard.tsx
components/borrower/RepaymentSummaryCard.tsx
components/borrower/PaymentHistoryTable.tsx
components/borrower/NoLoanState.tsx

Rules:
- show latest loan status
- show APPLIED, SANCTIONED, REJECTED, DISBURSED, CLOSED
- show rejection reason if rejected
- show repayment values
- show payment history
- borrower cannot record payments
- no mock data

Acceptance:
- /borrower/my-loan works
- no-loan empty state works
- loan timeline works
- repayment summary works
- /borrower/payments works
- npm run build passes

==================================================
JOB 9: DASHBOARD SALES, SANCTION, AND DISBURSEMENT MODULES
==================================================

Objective:
Build internal dashboard pages for Sales, Sanction, and Disbursement.

Backend APIs:
GET /api/dashboard/sales/leads
GET /api/dashboard/sales/leads/:borrowerId
GET /api/dashboard/sanction/loans
GET /api/dashboard/sanction/loans/:loanId
PATCH /api/dashboard/sanction/loans/:loanId/approve
PATCH /api/dashboard/sanction/loans/:loanId/reject
GET /api/dashboard/disbursement/loans
GET /api/dashboard/disbursement/loans/:loanId
PATCH /api/dashboard/disbursement/loans/:loanId/disburse

Pages:
app/dashboard/sales/page.tsx
app/dashboard/sanction/page.tsx
app/dashboard/disbursement/page.tsx

Create:
types/dashboard.types.ts
lib/dashboard-api.ts
components/dashboard/DashboardModuleCard.tsx
components/dashboard/SearchBar.tsx
components/dashboard/PaginationControls.tsx
components/dashboard/SalesLeadsTable.tsx
components/dashboard/LeadDetailsPanel.tsx
components/dashboard/SanctionLoansTable.tsx
components/dashboard/SanctionActionModal.tsx
components/dashboard/DisbursementLoansTable.tsx
components/dashboard/DisbursementActionModal.tsx
components/dashboard/LoanDetailPanel.tsx

Rules:
- Sales module shows registered borrowers who have not applied.
- Sanction module shows APPLIED loans.
- Sanction can approve or reject.
- Reject requires reason.
- Disbursement module shows SANCTIONED loans.
- Disbursement can mark loan as DISBURSED.
- Admin can access all.
- Each executive can access only own module.
- Collection module is not part of this job.

Acceptance:
- Sales table works
- Sanction table works
- approve works
- reject works
- disbursement table works
- mark disbursed works
- wrong roles blocked
- npm run build passes

==================================================
JOB 10: COLLECTION MODULE + FINAL END-TO-END POLISH
==================================================

Objective:
Build Collection dashboard and polish complete evaluator flow.

Backend APIs:
GET /api/dashboard/collection/loans
GET /api/dashboard/collection/loans/:loanId
POST /api/dashboard/collection/loans/:loanId/payments
GET /api/dashboard/collection/loans/:loanId/payments
GET /api/borrower/my-payments
GET /api/borrower/my-loan

Page:
app/dashboard/collection/page.tsx

Create:
components/dashboard/CollectionLoansTable.tsx
components/dashboard/RecordPaymentModal.tsx
components/dashboard/LoanPaymentsTable.tsx
components/dashboard/CollectionLoanDetailPanel.tsx
components/dashboard/OutstandingAmountCard.tsx

Update:
lib/dashboard-api.ts
types/payment.types.ts
types/dashboard.types.ts
app/dashboard/page.tsx
app/borrower/my-loan/page.tsx
app/borrower/payments/page.tsx

Payment form fields:
- UTR Number
- Amount
- Payment Date

Rules:
- UTR required
- UTR uppercase
- UTR regex: ^[A-Z0-9-]{6,50}$
- amount > 0
- amount must not exceed outstanding amount
- payment date required
- payment date should not be future
- backend is source of truth for loan closure
- re-fetch data after payment
- duplicate UTR error displays
- overpayment error displays

Acceptance:
- collection page works
- collection user can record payment
- admin can access collection
- wrong roles blocked
- partial payment works
- final payment closes loan through backend
- borrower sees CLOSED status
- borrower sees payment history
- full evaluator demo flow works
- npm run build passes

==================================================
FINAL OUTPUT REQUIRED
==================================================

After implementation, provide:
1. Files created.
2. Files modified.
3. Commands run.
4. How to test borrower upload/apply.
5. How to test borrower loan status/payments.
6. How to test Sales/Sanction/Disbursement modules.
7. How to test Collection module.
8. Full end-to-end demo checklist.
9. Confirmation that npm run build passes.
10. Any remaining cleanup suggestions.

Do not use emojis anywhere.