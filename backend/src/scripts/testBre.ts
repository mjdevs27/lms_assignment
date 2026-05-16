/**
 * Local test script for the Business Rule Engine.
 * Run with: npm run test:bre
 */

import { runEligibilityCheck } from '../services/bre.service';
import { BREInput, BREResult } from '../types/bre.types';

const divider = '='.repeat(60);

const runTest = (label: string, input: BREInput): void => {
  console.log(divider);
  console.log(`TEST: ${label}`);
  console.log('Input:', JSON.stringify(input, null, 2));
  const result: BREResult = runEligibilityCheck(input);
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log(`Status: ${result.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`);
  if (result.failures.length > 0) {
    console.log(`Failures (${result.failures.length}):`);
    result.failures.forEach((f, i) => {
      console.log(`  ${i + 1}. [${f.code}] ${f.field}: ${f.message}`);
    });
  }
  console.log('');
};

console.log('');
console.log('Business Rule Engine -- Test Suite');
console.log(divider);
console.log('');

// Test 1: Valid applicant
runTest('Valid applicant', {
  pan: 'ABCDE1234F',
  dob: '1998-05-10',
  monthlySalary: 45000,
  employmentMode: 'SALARIED',
});

// Test 2: Age below 23
runTest('Age below 23', {
  pan: 'ABCDE1234F',
  dob: '2010-01-01',
  monthlySalary: 45000,
  employmentMode: 'SALARIED',
});

// Test 3: Age above 50
runTest('Age above 50', {
  pan: 'ABCDE1234F',
  dob: '1960-01-01',
  monthlySalary: 45000,
  employmentMode: 'SALARIED',
});

// Test 4: Salary below 25000
runTest('Salary below 25000', {
  pan: 'ABCDE1234F',
  dob: '1998-05-10',
  monthlySalary: 15000,
  employmentMode: 'SALARIED',
});

// Test 5: Invalid PAN
runTest('Invalid PAN', {
  pan: '12345',
  dob: '1998-05-10',
  monthlySalary: 45000,
  employmentMode: 'SALARIED',
});

// Test 6: Unemployed applicant
runTest('Unemployed applicant', {
  pan: 'ABCDE1234F',
  dob: '1998-05-10',
  monthlySalary: 45000,
  employmentMode: 'UNEMPLOYED',
});

// Test 7: Multiple failures together
runTest('Multiple failures', {
  pan: 'INVALID',
  dob: '2010-01-01',
  monthlySalary: 5000,
  employmentMode: 'UNEMPLOYED',
});

// Test 8: Lowercase PAN that should pass after normalization
runTest('Lowercase PAN (should normalize and pass)', {
  pan: 'abcde1234f',
  dob: '1998-05-10',
  monthlySalary: 45000,
  employmentMode: 'SELF_EMPLOYED',
});

// Test 9: Future DOB
runTest('Future DOB', {
  pan: 'ABCDE1234F',
  dob: '2099-12-31',
  monthlySalary: 45000,
  employmentMode: 'SALARIED',
});

// Test 10: Invalid DOB
runTest('Invalid DOB', {
  pan: 'ABCDE1234F',
  dob: 'not-a-date',
  monthlySalary: 45000,
  employmentMode: 'SALARIED',
});

console.log(divider);
console.log('All BRE tests completed.');
console.log(divider);
