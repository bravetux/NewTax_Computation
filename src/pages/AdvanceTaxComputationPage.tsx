import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdvanceTaxResult {
  totalTax: number;
  netTaxLiability: number;
  breakdown: Record<string, number>;
  installments: {
    date: string;
    amount: number;
    cumulativePercentage: string;
  }[];
}

const BreakdownRow: React.FC<{ label: string; value: number; isNegative?: boolean; className?: string }> = ({ label, value, isNegative = false, className = "" }) => (
  <div className={`flex justify-between text-sm ${className}`}>
    <span>{label}</span>
    <span className="font-mono">{isNegative ? '-' : ''} ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  </div>
);

const AdvanceTaxComputationPage: React.FC = () => {
  // Inputs
  const [salaryIncome, setSalaryIncome] = useState<string>('');
  const [otherIncome, setOtherIncome] = useState<string>('');
  const [stcgIncome, setStcgIncome] = useState<string>('');
  const [ltcgIncome, setLtcgIncome] = useState<string>('');
  const [tdsDeducted, setTdsDeducted] = useState<string>('');

  // Result
  const [result, setResult] = useState<AdvanceTaxResult | null>(null);

  const calculateNewRegimeSlabTax = (income: number): number => {
    let tax = 0;
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 600000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 900000) {
      tax = 15000 + (income - 600000) * 0.10;
    } else if (income <= 1200000) {
      tax = 45000 + (income - 900000) * 0.15;
    } else if (income <= 1500000) {
      tax = 90000 + (income - 1200000) * 0.20;
    } else {
      tax = 150000 + (income - 1500000) * 0.30;
    }
    // Rebate under Section 87A
    if (income <= 700000) {
      return 0;
    }
    return tax;
  };

  const handleCalculate = () => {
    const salary = parseFloat(salaryIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const stcg = parseFloat(stcgIncome) || 0;
    const ltcg = parseFloat(ltcgIncome) || 0;
    const tds = parseFloat(tdsDeducted) || 0;

    const grossSlabIncome = salary + other;
    const standardDeduction = salary > 0 ? 50000 : 0;
    const taxableSlabIncome = Math.max(0, grossSlabIncome - standardDeduction);
    
    const slabTax = calculateNewRegimeSlabTax(taxableSlabIncome);
    
    // Updated capital gains tax rates as per user request
    const stcgTax = stcg * 0.20;
    const taxableLtcg = Math.max(0, ltcg - 125000);
    const ltcgTax = taxableLtcg * 0.125;
    
    const totalTaxBeforeCess = slabTax + stcgTax + ltcgTax;
    const cess = totalTaxBeforeCess * 0.04;
    const totalTax = totalTaxBeforeCess + cess;
    
    const netTaxLiability = Math.max(0, totalTax - tds);

    const breakdown = {
      grossSlabIncome,
      standardDeduction,
      taxableSlabIncome,
      slabTax,
      stcgTax,
      ltcgTax,
      totalTaxBeforeCess,
      cess,
      totalTax,
      tds,
      netTaxLiability,
    };

    if (netTaxLiability < 10000) {
      setResult({
        totalTax,
        netTaxLiability: 0,
        breakdown,
        installments: [],
      });
      return;
    }

    setResult({
      totalTax,
      netTaxLiability,
      breakdown,
      installments: [
        { date: 'On or before 15th June', amount: netTaxLiability * 0.15, cumulativePercentage: '15%' },
        { date: 'On or before 15th September', amount: netTaxLiability * 0.30, cumulativePercentage: '45%' },
        { date: 'On or before 15th December', amount: netTaxLiability * 0.30, cumulativePercentage: '75%' },
        { date: 'On or before 15th March', amount: netTaxLiability * 0.25, cumulativePercentage: '100%' },
      ],
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Advance Tax Calculator
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Estimate your advance tax liability for the financial year. This calculator uses the New Tax Regime and standard capital gains rates for computation.
        </p>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>What is Advance Tax?</AlertTitle>
          <AlertDescription>
            Advance tax is income tax paid in advance instead of a lump sum at year-end. It is payable if your total tax liability is ₹10,000 or more in a financial year. It must be paid in installments on specified due dates.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Estimated Financials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salary-income">Salary / Pension Income</Label>
                <Input id="salary-income" type="number" value={salaryIncome} onChange={(e) => setSalaryIncome(e.target.value)} placeholder="e.g., 1200000" />
              </div>
              <div>
                <Label htmlFor="other-income">Income from Other Sources</Label>
                <Input id="other-income" type="number" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} placeholder="FD, Dividends, etc." />
              </div>
              <div>
                <Label htmlFor="stcg-income">Short-Term Capital Gains (Equity)</Label>
                <Input id="stcg-income" type="number" value={stcgIncome} onChange={(e) => setStcgIncome(e.target.value)} placeholder="Taxed at 20%" />
              </div>
              <div>
                <Label htmlFor="ltcg-income">Long-Term Capital Gains (Equity)</Label>
                <Input id="ltcg-income" type="number" value={ltcgIncome} onChange={(e) => setLtcgIncome(e.target.value)} placeholder="Taxed at 12.5% over 1.25 Lakh" />
              </div>
              <Separator />
              <div>
                <Label htmlFor="tds-deducted">Total TDS/TCS Already Deducted</Label>
                <Input id="tds-deducted" type="number" value={tdsDeducted} onChange={(e) => setTdsDeducted(e.target.value)} placeholder="e.g., 100000" />
              </div>
              <Button onClick={handleCalculate} className="w-full">
                <Calculator className="mr-2 h-4 w-4" /> Calculate Advance Tax
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle>Tax Calculation Breakdown</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <BreakdownRow label="Gross Slab Income" value={result.breakdown.grossSlabIncome} />
                  <BreakdownRow label="Standard Deduction" value={result.breakdown.standardDeduction} isNegative />
                  <Separator />
                  <BreakdownRow label="Taxable Slab Income" value={result.breakdown.taxableSlabIncome} className="font-medium" />
                  <BreakdownRow label="Tax on Slab Income" value={result.breakdown.slabTax} />
                  <Separator />
                  <BreakdownRow label="Tax on STCG @ 20%" value={result.breakdown.stcgTax} />
                  <BreakdownRow label="Tax on LTCG @ 12.5%" value={result.breakdown.ltcgTax} />
                  <Separator />
                  <BreakdownRow label="Total Tax before Cess" value={result.breakdown.totalTaxBeforeCess} className="font-medium" />
                  <BreakdownRow label="Health & Edu Cess @ 4%" value={result.breakdown.cess} />
                  <Separator />
                  <BreakdownRow label="Total Tax Liability" value={result.breakdown.totalTax} className="font-bold" />
                  <BreakdownRow label="Less: TDS/TCS" value={result.breakdown.tds} isNegative />
                  <Separator />
                  <div className="flex justify-between text-base font-bold pt-2">
                    <span>Net Advance Tax Payable</span>
                    <span>₹{result.netTaxLiability.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Advance Tax Installments</CardTitle>
            </CardHeader>
            <CardContent>
              {result.netTaxLiability === 0 ? (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                  <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">No Advance Tax Payable</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Your estimated tax liability is less than ₹10,000, so advance tax is not required.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {result.installments.map((inst, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">{inst.date}</div>
                        <div className="text-sm text-muted-foreground">Cumulative: {inst.cumulativePercentage}</div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm">Amount to be paid:</span>
                        <span className="text-xl font-bold">₹{inst.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default AdvanceTaxComputationPage;