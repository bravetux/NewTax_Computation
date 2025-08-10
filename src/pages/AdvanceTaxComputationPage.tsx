import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface AdvanceTaxResult {
  netTaxLiability: number;
  installments: {
    date: string;
    amount: number;
    cumulativePercentage: string;
  }[];
}

const AdvanceTaxComputationPage: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [tdsDeducted, setTdsDeducted] = useState<string>('');
  const [result, setResult] = useState<AdvanceTaxResult | null>(null);

  // Simplified tax calculation based on the New Tax Regime
  const calculateTaxOnIncome = (income: number): number => {
    let tax = 0;
    const taxableIncome = Math.max(0, income - 50000); // Assuming standard deduction for salary

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

    // Rebate under Section 87A
    if (taxableIncome <= 700000) {
      tax = 0;
    }

    const cess = tax * 0.04;
    return tax + cess;
  };

  const handleCalculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const tds = parseFloat(tdsDeducted) || 0;

    if (income <= 0) {
      setResult(null);
      return;
    }

    const totalTax = calculateTaxOnIncome(income);
    const netTaxLiability = Math.max(0, totalTax - tds);

    if (netTaxLiability < 10000) {
      setResult({
        netTaxLiability: 0,
        installments: [],
      });
      return;
    }

    setResult({
      netTaxLiability,
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Advance Tax Calculator
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Estimate your advance tax liability for the financial year. This calculator uses the New Tax Regime for computation.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Your Estimated Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="annual-income">Estimated Annual Income (All Sources)</Label>
              <Input id="annual-income" type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g., 2000000" />
            </div>
            <div>
              <Label htmlFor="tds-deducted">Total TDS Already Deducted/To be Deducted</Label>
              <Input id="tds-deducted" type="number" value={tdsDeducted} onChange={(e) => setTdsDeducted(e.target.value)} placeholder="e.g., 100000" />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" /> Calculate Advance Tax
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
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
                  <div className="flex justify-between text-lg font-bold p-3 bg-muted rounded-md">
                    <span>Total Advance Tax Payable:</span>
                    <span>₹{result.netTaxLiability.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="space-y-3">
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