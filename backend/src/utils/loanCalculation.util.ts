export const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  tenureDays: number;
}

export interface SimpleInterestResult {
  principal: number;
  annualRate: number;
  tenureDays: number;
  interestAmount: number;
  totalRepayment: number;
}

export const calculateSimpleInterest = (input: SimpleInterestInput): SimpleInterestResult => {
  const { principal, annualRate, tenureDays } = input;
  const interestAmount = roundToTwoDecimals(
    (principal * annualRate * tenureDays) / (365 * 100),
  );
  const totalRepayment = roundToTwoDecimals(principal + interestAmount);

  return {
    principal,
    annualRate,
    tenureDays,
    interestAmount,
    totalRepayment,
  };
};
