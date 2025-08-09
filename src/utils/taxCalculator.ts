export interface DetailedIncome {
  salary: number;
  fdIncome: number;
  bondIncome: number;
  dividendIncome: number;
  stcg: number;
  ltcg: number;
  isSalaried: boolean;
}

export const calculateTax = (details: DetailedIncome): number => {
  // 1. Calculate tax on income other than capital gains
  const slabIncome = details.salary + details.fdIncome + details.bondIncome + details.dividendIncome;
  const standardDeduction = details.isSalaried ? 75000 : 0;
  const netTaxableSlabIncome = Math.max(0, slabIncome - standardDeduction);

  const rebateIncomeLimit = 1200000;
  const hasRebate = netTaxableSlabIncome <= rebateIncomeLimit;

  let slabTax = 0;
  if (!hasRebate) {
    if (netTaxableSlabIncome > 400000) slabTax += (Math.min(netTaxableSlabIncome, 800000) - 400000) * 0.05;
    if (netTaxableSlabIncome > 800000) slabTax += (Math.min(netTaxableSlabIncome, 1200000) - 800000) * 0.10;
    if (netTaxableSlabIncome > 1200000) slabTax += (Math.min(netTaxableSlabIncome, 1600000) - 1200000) * 0.15;
    if (netTaxableSlabIncome > 1600000) slabTax += (Math.min(netTaxableSlabIncome, 2000000) - 1600000) * 0.20;
    if (netTaxableSlabIncome > 2000000) slabTax += (Math.min(netTaxableSlabIncome, 2400000) - 2000000) * 0.25;
    if (netTaxableSlabIncome > 2400000) slabTax += (netTaxableSlabIncome - 2400000) * 0.30;
  }
  
  const surchargeOnSlabTax = netTaxableSlabIncome > 5000000 ? slabTax * 0.10 : 0;
  const incomeTaxBeforeCess = slabTax + surchargeOnSlabTax;
  const incomeTaxCess = incomeTaxBeforeCess * 0.04;
  const totalIncomeTax = incomeTaxBeforeCess + incomeTaxCess;

  // 2. Calculate tax on capital gains
  const ltcgExemption = 150000;
  const taxableLtcg = Math.max(0, details.ltcg - ltcgExemption);
  const ltcgTax = taxableLtcg * 0.125;

  const stcgTax = details.stcg * 0.20;

  const totalCapitalGainsTax = ltcgTax + stcgTax;

  // 3. Total tax payable
  return totalIncomeTax + totalCapitalGainsTax;
};