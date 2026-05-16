import { calculateLoanQuote } from '../services/loanCalculation.service';

interface TestCase {
  label: string;
  input: { loanAmount: unknown; tenureDays: unknown };
}

const cases: TestCase[] = [
  { label: 'Case 01: INR 50000 for 30 days', input: { loanAmount: 50000, tenureDays: 30 } },
  { label: 'Case 02: INR 100000 for 180 days', input: { loanAmount: 100000, tenureDays: 180 } },
  { label: 'Case 03: INR 500000 for 365 days', input: { loanAmount: 500000, tenureDays: 365 } },
  { label: 'Case 04: Amount below 50000', input: { loanAmount: 10000, tenureDays: 60 } },
  { label: 'Case 05: Amount above 500000', input: { loanAmount: 600000, tenureDays: 60 } },
  { label: 'Case 06: Tenure below 30', input: { loanAmount: 100000, tenureDays: 10 } },
  { label: 'Case 07: Tenure above 365', input: { loanAmount: 100000, tenureDays: 400 } },
  { label: 'Case 08: Decimal tenure', input: { loanAmount: 100000, tenureDays: 90.5 } },
  { label: 'Case 09: Non-number input', input: { loanAmount: 'abc', tenureDays: 'xyz' } },
  { label: 'Case 10: Zero amount', input: { loanAmount: 0, tenureDays: 60 } },
];

const run = (): void => {
  let validCount = 0;
  let invalidCount = 0;

  for (const c of cases) {
    const result = calculateLoanQuote(c.input);
    console.log(`\n${c.label}`);

    if (result.valid) {
      validCount++;
      console.log('  Status: valid');
      console.log(`  Loan Amount:     ${result.data.loanAmount}`);
      console.log(`  Tenure:          ${result.data.tenureDays} days`);
      console.log(`  Interest Rate:   ${result.data.interestRate}% per annum`);
      console.log(`  Interest Amount: ${result.data.interestAmount}`);
      console.log(`  Total Repayment: ${result.data.totalRepayment}`);
      console.log(`  Outstanding:     ${result.data.outstandingAmount}`);
    } else {
      invalidCount++;
      console.log('  Status: invalid');
      for (const err of result.errors) {
        console.log(`  [${err.code}] ${err.field}: ${err.message}`);
      }
    }
  }

  console.log(
    `\nSummary: ${validCount} valid, ${invalidCount} invalid out of ${cases.length} cases`,
  );
};

run();
