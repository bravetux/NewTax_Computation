import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Local storage keys
const salaryIncomeSource = "dyad-salary-income";
const rentalIncomeSource = "dyad-rental-income";
const fdIncomeSource = "dyad-fd-income";
const bondIncomeSource = "dyad-bonds-income";
const dividendSources = ["dyad-pms-dividends", "dyad-broker1-dividends", "dyad-broker2-dividends"];
const DEMAT_KEY = "dyad-demat-gains";
const MF_KEY = "dyad-mutual-fund-gains";

// Interfaces for data types
interface CapitalGainsItem { stcg: number | string; ltcg: number | string; }
interface DividendItem { amount: number; }
interface BondItem { income: number | string; }
interface FdItem { interest: number | string; }
interface RentalProperty { monthlyRent: number | string; monthsRented: number | string; propertyTax: number | string; }

const TaxComputationPage: React.FC = () => {
  const [income, setIncome] = useState({
    salary: 0,
    rental: 0,
    fd: 0,
    bond: 0,
    dividend: 0,
  });
  const [capitalGains, setCapitalGains] = useState({ stcg: 0, ltcg: 0 });

  useEffect(() => {
    const calculateTotals = () => {
      // --- Income from other sources ---
      const salary = JSON.parse(localStorage.getItem(salaryIncomeSource) || "0");
      
      const rentalData: RentalProperty[] = JSON.parse(localStorage.getItem(rentalIncomeSource) || "[]");
      const rental = rentalData.reduce((total, prop) => {
        const gav = (Number(prop.monthlyRent) || 0) * (Number(prop.monthsRented) || 0);
        const propertyTax = Number(prop.propertyTax) || 0;
        const nav = gav - propertyTax;
        const standardDeduction = nav > 0 ? nav * 0.3 : 0;
        return total + (nav - standardDeduction);
      }, 0);

      const fdData: FdItem[] = JSON.parse(localStorage.getItem(fdIncomeSource) || "[]");
      const fd = fdData.reduce((sum, item) => sum + (Number(item.interest) || 0), 0);

      const bondData: BondItem[] = JSON.parse(localStorage.getItem(bondIncomeSource) || "[]");
      const bond = bondData.reduce((sum, item) => sum + (Number(item.income) || 0), 0);

      const dividend = dividendSources.reduce((total, key) => {
        const data: DividendItem[] = JSON.parse(localStorage.getItem(key) || "[]");
        return total + data.reduce((sum, item) => sum + (item.amount || 0), 0);
      }, 0);

      setIncome({ salary, rental, fd, bond, dividend });

      // --- Capital Gains ---
      const dematData: CapitalGainsItem[] = JSON.parse(localStorage.getItem(DEMAT_KEY) || "[]");
      const mfData: CapitalGainsItem[] = JSON.parse(localStorage.getItem(MF_KEY) || "[]");
      const totalStcg = [...dematData, ...mfData].reduce((sum, item) => sum + (Number(item.stcg) || 0), 0);
      const totalLtcg = [...dematData, ...mfData].reduce((sum, item) => sum + (Number(item.ltcg) || 0), 0);
      setCapitalGains({ stcg: totalStcg, ltcg: totalLtcg });
    };

    calculateTotals();
    window.addEventListener("storage", calculateTotals);
    window.addEventListener("focus", calculateTotals);
    return () => {
      window.removeEventListener("storage", calculateTotals);
      window.removeEventListener("focus", calculateTotals);
    };
  }, []);

  // --- Tax Calculation Logic ---
  const grossTotalIncome = Object.values(income).reduce((sum, val) => sum + val, 0);
  const standardDeduction = income.salary > 0 ? 50000 : 0;
  const netTaxableIncome = Math.max(0, grossTotalIncome - standardDeduction);

  const hasRebate = netTaxableIncome <= 700000;

  const calculateSlabTax = (inc: number) => {
    if (inc <= 300000) return 0;
    let tax = 0;
    if (inc > 1500000) tax += (inc - 1500000) * 0.30;
    if (inc > 1200000) tax += Math.min(inc, 1500000) > 1200000 ? (Math.min(inc, 1500000) - 1200000) * 0.20 : 0;
    if (inc > 900000) tax += Math.min(inc, 1200000) > 900000 ? (Math.min(inc, 1200000) - 900000) * 0.15 : 0;
    if (inc > 600000) tax += Math.min(inc, 900000) > 600000 ? (Math.min(inc, 900000) - 600000) * 0.10 : 0;
    if (inc > 300000) tax += Math.min(inc, 600000) > 300000 ? (Math.min(inc, 600000) - 300000) * 0.05 : 0;
    return tax;
  };

  const incomeTaxBeforeRebate = hasRebate ? 0 : calculateSlabTax(netTaxableIncome);
  const surcharge = netTaxableIncome > 5000000 ? incomeTaxBeforeRebate * 0.10 : 0; // Simplified surcharge
  const taxBeforeCess = incomeTaxBeforeRebate + surcharge;
  const cess = taxBeforeCess * 0.04;
  const totalIncomeTax = taxBeforeCess + cess;

  // Capital Gains Tax
  const ltcgExemption = 100000; // Note: This is for equity. For simplicity, we use it for all LTCG.
  const taxableLtcg = Math.max(0, capitalGains.ltcg - ltcgExemption);
  const ltcgTax = taxableLtcg * 0.10; // Simplified rate
  const stcgTax = capitalGains.stcg * 0.15; // Simplified rate
  const totalCapitalGainsTax = ltcgTax + stcgTax;

  const totalTaxPayable = totalIncomeTax + totalCapitalGainsTax;

  const f = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Tax Computation (New Regime)
        </h1>

        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>1. Income Calculation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Salary Income:</span> <span className="font-mono">₹{f(income.salary)}</span></div>
              <div className="flex justify-between"><span>Rental Income:</span> <span className="font-mono">₹{f(income.rental)}</span></div>
              <div className="flex justify-between"><span>FD & Bond Interest:</span> <span className="font-mono">₹{f(income.fd + income.bond)}</span></div>
              <div className="flex justify-between"><span>Dividend Income:</span> <span className="font-mono">₹{f(income.dividend)}</span></div>
              <hr />
              <div className="flex justify-between font-bold"><span>Gross Total Income:</span> <span className="font-mono">₹{f(grossTotalIncome)}</span></div>
              <div className="flex justify-between"><span>Less: Standard Deduction:</span> <span className="font-mono">- ₹{f(standardDeduction)}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>Net Taxable Income:</span> <span className="font-mono">₹{f(netTaxableIncome)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. Income Tax Calculation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {hasRebate && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                  <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">Rebate under Section 87A Applicable</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Your taxable income is ₹7,00,000 or less, so your income tax liability is zero.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between"><span>Tax on Income (as per slabs):</span> <span className="font-mono">₹{f(incomeTaxBeforeRebate)}</span></div>
              <div className="flex justify-between"><span>Surcharge:</span> <span className="font-mono">+ ₹{f(surcharge)}</span></div>
              <hr />
              <div className="flex justify-between"><span>Tax Before Cess:</span> <span className="font-mono">₹{f(taxBeforeCess)}</span></div>
              <div className="flex justify-between"><span>Health & Education Cess (4%):</span> <span className="font-mono">+ ₹{f(cess)}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>Total Income Tax Payable:</span> <span className="font-mono">₹{f(totalIncomeTax)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>3. Final Tax Liability</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Total Income Tax:</span> <span className="font-mono">₹{f(totalIncomeTax)}</span></div>
              <div className="flex justify-between"><span>Total Capital Gains Tax:</span> <span className="font-mono">+ ₹{f(totalCapitalGainsTax)}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-2xl"><span>Total Tax Payable:</span> <span className="font-mono">₹{f(totalTaxPayable)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TaxComputationPage;