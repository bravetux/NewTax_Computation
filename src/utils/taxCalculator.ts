export interface DetailedIncome {
  salary: number;
  rentalIncome: number;
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
  originalStcg: number;
  originalLtcg: number;

  // Slab Tax Calculation
  standardDeduction: number;
  netTaxableSlabIncome: number;
  isRebateApplicable: boolean;
  slabTaxBeforeRebate: number;

  // Capital Gains Tax Calculation
  stclSetOff: number;
  postSetOffStcg: number;
  postSetOffLtcg: number;
  ltcgExemption: number;
  taxableLtcg: number;
  ltcgTax: number;
  stcgTax: number;
  totalCapitalGainsTax: number;

  // Combined Final Calculation
  totalTaxBeforeSurcharge: number;
  surcharge: number;
  cess: number;
  totalTaxPayable: number;
}

export const calculateTax = (details: DetailedIncome): TaxCalculationResult => {
  // 1. Calculate tax on income other than capital gains
  const grossSlabIncome = details.salary + details.rentalIncome + details.fdIncome + details.bondIncome + details.dividendIncome;
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
  
  // 2. Handle Capital Gains, including loss set-off
  const { stcg: originalStcg, ltcg: originalLtcg } = details;
  let stclSetOff = 0;
  let postSetOffStcg = originalStcg;
  let postSetOffLtcg = originalLtcg;

  if (originalStcg < 0 && originalLtcg > 0) {
    stclSetOff = Math.min(Math.abs(originalStcg), originalLtcg);
    postSetOffLtcg = originalLtcg - stclSetOff;
    postSetOffStcg = originalStcg + stclSetOff;
  }

  const stcgForTax = Math.max(0, postSetOffStcg);
  const ltcgForTax = Math.max(0, postSetOffLtcg);

  const ltcgExemption = 125000;
  const taxableLtcg = Math.max(0, ltcgForTax - ltcgExemption);
  const ltcgTax = taxableLtcg * 0.125;
  const stcgTax = stcgForTax * 0.20;
  const totalCapitalGainsTax = ltcgTax + stcgTax;

  // 3. Combined final calculation
  const totalTaxBeforeSurcharge = slabTaxBeforeRebate + totalCapitalGainsTax;
  
  const totalIncomeForSurcharge = netTaxableSlabIncome + stcgForTax + ltcgForTax;
  let surcharge = 0;
  if (totalIncomeForSurcharge > 5000000) {
    surcharge = totalTaxBeforeSurcharge * 0.10;
  }

  const taxBeforeCess = totalTaxBeforeSurcharge + surcharge;
  const cess = taxBeforeCess * 0.04;
  const totalTaxPayable = taxBeforeCess + cess;

  return {
    grossSlabIncome,
    originalStcg,
    originalLtcg,
    standardDeduction,
    netTaxableSlabIncome,
    isRebateApplicable,
    slabTaxBeforeRebate,
    stclSetOff,
    postSetOffStcg,
    postSetOffLtcg,
    ltcgExemption,
    taxableLtcg,
    ltcgTax,
    stcgTax,
    totalCapitalGainsTax,
    totalTaxBeforeSurcharge,
    surcharge,
    cess,
    totalTaxPayable,
  };
};