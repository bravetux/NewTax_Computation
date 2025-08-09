export const calculateTax = (income: number, isSalaried: boolean = false): number => {
  const standardDeduction = isSalaried ? 75000 : 0;
  const netTaxableIncome = Math.max(0, income - standardDeduction);

  const rebateIncomeLimit = 1200000;
  if (netTaxableIncome <= rebateIncomeLimit) {
    return 0;
  }

  let tax = 0;
  if (netTaxableIncome > 400000) tax += (Math.min(netTaxableIncome, 800000) - 400000) * 0.05;
  if (netTaxableIncome > 800000) tax += (Math.min(netTaxableIncome, 1200000) - 800000) * 0.10;
  if (netTaxableIncome > 1200000) tax += (Math.min(netTaxableIncome, 1600000) - 1200000) * 0.15;
  if (netTaxableIncome > 1600000) tax += (Math.min(netTaxableIncome, 2000000) - 1600000) * 0.20;
  if (netTaxableIncome > 2000000) tax += (Math.min(netTaxableIncome, 2400000) - 2000000) * 0.25;
  if (netTaxableIncome > 2400000) tax += (netTaxableIncome - 2400000) * 0.30;

  const surcharge = netTaxableIncome > 5000000 ? tax * 0.10 : 0;
  const taxBeforeCess = tax + surcharge;

  const cess = taxBeforeCess * 0.04;
  
  return taxBeforeCess + cess;
};