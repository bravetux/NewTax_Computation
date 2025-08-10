import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TaxRegimeResult {
  oldRegimeTax: number;
  newRegimeTax: number;
  oldRegimeBreakdown: string[];
  newRegimeBreakdown: string[];
  recommendedRegime: 'Old' | 'New' | 'Both';
}

const TaxRegimeComparisonPage: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [deductions80C, setDeductions80C] = useState<string>('');
  const [deductions80D, setDeductions80D] = useState<string>('');
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>('');
  const [otherDeductions, setOtherDeductions] = useState<string>('');
  const [result, setResult] = useState<TaxRegimeResult | null>(null);

  const calculateTax = (income: number, deductions: {
    c: number;
    d: number;
    hli: number;
    other: number;
  }, regime: 'old' | 'new'): { tax: number; breakdown: string[] } => {
    let taxableIncome = income;
    const breakdown: string[] = [];
    let tax = 0;

    if (regime === 'old') {
      const totalDeductions = Math.min(deductions.c, 150000) + deductions.d + Math.min(deductions.hli, 200000) + deductions.other;
      taxableIncome = Math.max(0, income - totalDeductions);
      breakdown.push(`Gross Income: ₹${income.toLocaleString('en-IN')}`);
      breakdown.push(`Less: Deductions (80C, 80D, HLI, Other): ₹${totalDeductions.toLocaleString('en-IN')}`);
      breakdown.push(`Taxable Income (Old Regime): ₹${taxableIncome.toLocaleString('en-IN')}`);

      // Old Regime Slabs (simplified for example, assuming below 60)
      if (taxableIncome <= 250000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.20;
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.30;
      }
      breakdown.push(`Tax before rebate: ₹${tax.toLocaleString('en-IN')}`);

      // Rebate under Section 87A (for income up to 5 lakhs)
      if (taxableIncome <= 500000) {
        const rebate = Math.min(tax, 12500);
        tax -= rebate;
        breakdown.push(`Less: Rebate u/s 87A: ₹${rebate.toLocaleString('en-IN')}`);
      }
    } else { // New Regime
      const standardDeduction = 50000; // Standard deduction for salaried individuals
      taxableIncome = Math.max(0, income - standardDeduction);
      breakdown.push(`Gross Income: ₹${income.toLocaleString('en-IN')}`);
      breakdown.push(`Less: Standard Deduction: ₹${standardDeduction.toLocaleString('en-IN')}`);
      breakdown.push(`Taxable Income (New Regime): ₹${taxableIncome.toLocaleString('en-IN')}`);

      // New Regime Slabs (simplified for example)
      if (taxableIncome <= 300000) {
        tax = 0;
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.10;
      } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.20;
      } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.30;
      }
      breakdown.push(`Tax before rebate: ₹${tax.toLocaleString('en-IN')}`);

      // Rebate under Section 87A (for income up to 7 lakhs)
      if (taxableIncome <= 700000) {
        const rebate = Math.min(tax, 25000);
        tax -= rebate;
        breakdown.push(`Less: Rebate u/s 87A: ₹${rebate.toLocaleString('en-IN')}`);
      }
    }

    // Health and Education Cess (4%)
    const cess = tax * 0.04;
    tax += cess;
    breakdown.push(`Add: Health & Education Cess (4%): ₹${cess.toLocaleString('en-IN')}`);
    breakdown.push(`Total Tax Payable: ₹${tax.toLocaleString('en-IN')}`);

    return { tax, breakdown };
  };

  const handleCalculate = () => {
    const income = parseFloat(grossIncome) || 0;
    const d80C = parseFloat(deductions80C) || 0;
    const d80D = parseFloat(deductions80D) || 0;
    const hli = parseFloat(homeLoanInterest) || 0;
    const other = parseFloat(otherDeductions) || 0;

    if (income <= 0) {
      setResult(null);
      return;
    }

    const oldRegime = calculateTax(income, { c: d80C, d: d80D, hli: hli, other: other }, 'old');
    const newRegime = calculateTax(income, { c: d80C, d: d80D, hli: hli, other: other }, 'new');

    let recommended: 'Old' | 'New' | 'Both' = 'Both';
    if (oldRegime.tax < newRegime.tax) {
      recommended = 'Old';
    } else if (newRegime.tax < oldRegime.tax) {
      recommended = 'New';
    }

    setResult({
      oldRegimeTax: oldRegime.tax,
      newRegimeTax: newRegime.tax,
      oldRegimeBreakdown: oldRegime.breakdown,
      newRegimeBreakdown: newRegime.breakdown,
      recommendedRegime: recommended,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Tax Regime Comparison
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Compare your tax liability under the Old vs. New Tax Regime based on your income and deductions.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Your Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gross-income">Gross Income (before any deductions)</Label>
              <Input id="gross-income" type="number" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} placeholder="e.g., 1500000" />
            </div>
            <Separator />
            <h3 className="font-semibold text-lg">Deductions (for Old Regime comparison)</h3>
            <div>
              <Label htmlFor="deductions-80c">Section 80C (Max ₹1.5 Lakh)</Label>
              <Input id="deductions-80c" type="number" value={deductions80C} onChange={(e) => setDeductions80C(e.target.value)} placeholder="e.g., 150000" />
            </div>
            <div>
              <Label htmlFor="deductions-80d">Section 80D (Health Insurance)</Label>
              <Input id="deductions-80d" type="number" value={deductions80D} onChange={(e) => setDeductions80D(e.target.value)} placeholder="e.g., 25000" />
            </div>
            <div>
              <Label htmlFor="home-loan-interest">Home Loan Interest (Section 24b, Max ₹2 Lakh)</Label>
              <Input id="home-loan-interest" type="number" value={homeLoanInterest} onChange={(e) => setHomeLoanInterest(e.target.value)} placeholder="e.g., 180000" />
            </div>
            <div>
              <Label htmlFor="other-deductions">Other Deductions (e.g., 80G, 80TTA)</Label>
              <Input id="other-deductions" type="number" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} placeholder="e.g., 10000" />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" /> Compare Regimes
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={result.recommendedRegime === 'Old' ? 'border-primary ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle>Old Tax Regime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold mb-4">
                  Total Tax: ₹{result.oldRegimeTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <h4 className="font-semibold">Breakdown:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {result.oldRegimeBreakdown.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={result.recommendedRegime === 'New' ? 'border-primary ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle>New Tax Regime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold mb-4">
                  Total Tax: ₹{result.newRegimeTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <h4 className="font-semibold">Breakdown:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {result.newRegimeBreakdown.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <Alert className="mt-8 text-center">
            <Info className="h-4 w-4" />
            <AlertTitle>Recommendation:</AlertTitle>
            <AlertDescription className="text-lg font-semibold">
              {result.recommendedRegime === 'Old' && `The Old Tax Regime is more beneficial for you.`}
              {result.recommendedRegime === 'New' && `The New Tax Regime is more beneficial for you.`}
              {result.recommendedRegime === 'Both' && `Both regimes result in similar tax liability. Choose based on your preference.`}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TaxRegimeComparisonPage;