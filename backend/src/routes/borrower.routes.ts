import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireBorrower } from '../middleware/rbac.middleware';
import { eligibilityCheck, updateProfile, getProfile } from '../controllers/borrower.controller';
import { uploadSingleSalarySlip } from '../middleware/upload.middleware';
import { uploadSalarySlip } from '../controllers/upload.controller';
import { loanQuote, applyLoan, getMyLoan, getMyLoans } from '../controllers/loan.controller';
import { getMyPaymentsHandler } from '../controllers/collection.controller';

const router = Router();

// All borrower routes require authentication + BORROWER role
router.use(authenticate, requireBorrower);

// Profile and eligibility routes
router.post('/eligibility-check', eligibilityCheck);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);

// Salary slip upload route
router.post('/upload-salary-slip', uploadSingleSalarySlip, uploadSalarySlip);

// Loan routes
router.post('/loan/quote', loanQuote);
router.post('/apply-loan', applyLoan);
router.get('/my-loan', getMyLoan);
router.get('/my-loans', getMyLoans);

// Payment history
router.get('/my-payments', getMyPaymentsHandler);

export default router;
