export interface DetailedIncome {
  salary: number;
  fdIncome: number;
  bondIncome: number;
  dividendIncome: number;
  stcg: number;
  ltcg: number;
  isSalaried: boolean;
}

export interface TaxCalculationResult {
  // Inputs
  grossSlabIncome: number;
  stcg: number;
  ltcg: number;

  // Slab Tax Calculation
  standardDeduction: number;
  netTaxableSlabIncome: number;
  isRebateApplicable: boolean;
  slabTaxBeforeRebate: number;
  surcharge: number;
  taxBeforeCess: number;
  cess: number;
  totalIncomeTax: number;

  // Capital Gains Tax Calculation
  ltcgExemption: number;
  taxableLtcg: number;
  ltcgTax: number;
  stcgTax: number;
  totalCapitalGainsTax: number;

  // Final
  totalTaxPayable: number;
}

export const calculateTax = (details: DetailedIncome): TaxCalculationResult => {
  // 1. Calculate tax on income other than capital gains
  const grossSlabIncome = details.salary + details.fdIncome + details.bondIncome + details.dividendIncome;
  const standardDeduction = details.isSalaried ? 75000 : 0;
  const netTaxableSlabIncome = Math.max(0, grossSlabIncome - standardDeduction);

  const rebateIncomeLimit = 1200000;
  const isRebateApplicable = netTaxableSlabIncome <= rebateIncomeLimit;

  let slabTaxBeforeRebate = 0;
  if (!isRebateApplicable) {
    if (netTaxableSlabIncome > 400000) slabTaxBeforeRebate += (Math.min(netTaxableSlabIncome, 800000) - 400000) * 0.05;
    if (netTaxableSlabIncome > 800000) slabTaxBeforeRebate += (Math.min(netTaxableSlabIncome, 1200000) - 800000) * 0.10;
    if (netTaxableSlabIncome > 1200000) slabTaxBeforeRebate += (Math.min(netTaxableSlabIncome, 1600000) - 1200000) * 0.15;
    if (netTaxableSlabIncome > 1600000) slabTaxBeforeRebate += (Math.min(netTaxableSlabIncome, 2000000) - 1600000) * 0.20;
    if (netTaxableSlabIncome > 2000000) slabTaxBeforeRebate += (Math.min(netTaxableSlabIncome, 2400000) - 2000000) * 0.25;
    if (netTaxableSlabIncome > 2400000) slabTaxBeforeRebate += (netTaxableSlabIncome - 2400000) * 0.30;
  }
  
  const surcharge = netTaxableSlabIncome > 5000000 ? slabTaxBeforeRebate * 0.10 : 0;
  const taxBeforeCess = slabTaxBeforeRebate + surcharge;
  const cess = taxBeforeCess * 0.04;
  const totalIncomeTax = taxBeforeCess + cess;

  // 2. Calculate tax on capital gains
  const ltcgExemption = 150000;
  const taxableLtcg = Math.max(0, details.ltcg - ltcgExemption);
  const ltcgTax = taxableLtcg * 0.125;
  const stcgTax = details.stcg * 0.20;
  const totalCapitalGainsTax = ltcgTax + stcgTax;

  // 3. Total tax payable
  const totalTaxPayable = totalIncomeTax + totalCapitalGainsTax;

  return {
    grossSlabIncome,
    stcg: details.stcg,
    ltcg: details.ltcg,
    standardDeduction,
    netTaxableSlabIncome,
    isRebateApplicable,
    slabTaxBeforeRebate,
    surcharge,
    taxBeforeCess,
    cess,
    totalIncomeTax,
    ltcgExemption,
    taxableLtcg,
    ltcgTax,
    stcgTax,
    totalCapitalGainsTax,
    totalTaxPayable,
  };
};