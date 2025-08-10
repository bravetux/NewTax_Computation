import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { calculateTax, TaxCalculationResult } from "@/utils/taxCalculator";
import { Separator } from "@/components/ui/separator";

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

const BreakdownRow: React.FC<{ label: string; value: number; isNegative?: boolean; className?: string }> = ({ label, value, isNegative = false, className = "" }) => (
  <div className={`flex justify-between text-sm ${className}`}>
    <span>{label}</span>
    <span className="font-mono">{isNegative ? '-' : ''} ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  </div>
);

const TaxComputationPage: React.FC = () => {
  const [taxDetails, setTaxDetails] = useState<TaxCalculationResult | null>(null);

  useEffect(() => {
    const calculateTotals = () => {
      const salary = Number(JSON.parse(localStorage.getItem(salaryIncomeSource) || "0"));
      
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

      const dematData: CapitalGainsItem[] = JSON.parse(localStorage.getItem(DEMAT_KEY) || "[]");
      const mfData: CapitalGainsItem[] = JSON.parse(localStorage.getItem(MF_KEY) || "[]");
      const stcg = [...dematData, ...mfData].reduce((sum, item) => sum + (Number(item.stcg) || 0), 0);
      const ltcg = [...dematData, ...mfData].reduce((sum, item) => sum + (Number(item.ltcg) || 0), 0);

      const result = calculateTax({
        salary,
        rentalIncome: rental,
        fdIncome: fd,
        bondIncome: bond,
        dividendIncome: dividend,
        stcg,
        ltcg,
        isSalaried: salary > 0,
      });
      setTaxDetails(result);
    };

    calculateTotals();
    window.addEventListener("storage", calculateTotals);
    window.addEventListener("focus", calculateTotals);
    return () => {
      window.removeEventListener("storage", calculateTotals);
      window.removeEventListener("focus", calculateTotals);
    };
  }, []);

  if (!taxDetails) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>Loading tax computation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Tax Computation (New Regime)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle>1. Capital Gains Tax Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {taxDetails.stclSetOff > 0 && (
                  <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 mb-4">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Loss Set-Off Applied</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                      A short-term loss of ₹{taxDetails.stclSetOff.toLocaleString("en-IN")} has been set off against long-term gains.
                    </AlertDescription>
                  </Alert>
              )}
              <BreakdownRow label="Taxable STCG" value={Math.max(0, taxDetails.postSetOffStcg)} />
              <BreakdownRow label="Tax on STCG @ 20%" value={taxDetails.stcgTax} />
              <Separator />
              <BreakdownRow label="Taxable LTCG (after set-off)" value={Math.max(0, taxDetails.postSetOffLtcg)} />
              <BreakdownRow label="Exemption" value={taxDetails.ltcgExemption} isNegative />
              <BreakdownRow label="Tax on LTCG @ 12.5%" value={taxDetails.ltcgTax} />
              <Separator />
              <BreakdownRow label="Total Capital Gains Tax" value={taxDetails.totalCapitalGainsTax} className="font-bold text-base" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. Income Tax Calculation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {taxDetails.isRebateApplicable && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 mb-4">
                  <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">Rebate under Section 87A Applicable</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Your taxable income is ₹12,00,000 or less, so your income tax liability on slab income is zero.
                  </AlertDescription>
                </Alert>
              )}
              <BreakdownRow label="Gross Income (excl. Capital Gains)" value={taxDetails.grossSlabIncome} />
              <BreakdownRow label="Standard Deduction" value={taxDetails.standardDeduction} isNegative />
              <Separator />
              <BreakdownRow label="Net Taxable Slab Income" value={taxDetails.netTaxableSlabIncome} className="font-medium" />
              <Separator />
              <BreakdownRow label="Tax on Slab Income" value={taxDetails.slabTaxBeforeRebate} className="font-bold text-base" />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
            <CardHeader><CardTitle>3. Final Tax Calculation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <BreakdownRow label="Tax on Slab Income" value={taxDetails.slabTaxBeforeRebate} />
              <BreakdownRow label="Tax on Capital Gains" value={taxDetails.totalCapitalGainsTax} />
              <Separator />
              <BreakdownRow label="Total Tax (before surcharge)" value={taxDetails.totalTaxBeforeSurcharge} className="font-medium" />
              <BreakdownRow label="Surcharge" value={taxDetails.surcharge} />
              <BreakdownRow label="Cess (4%)" value={taxDetails.cess} />
            </CardContent>
        </Card>

        <Card className="bg-primary/5 dark:bg-primary/10">
          <CardHeader><CardTitle>4. Final Tax Liability</CardTitle></CardHeader>
          <CardContent>
            <div className="flex justify-between text-xl font-bold pt-2">
              <span>Total Tax Payable</span>
              <span className="font-mono">₹{taxDetails.totalTaxPayable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TaxComputationPage;