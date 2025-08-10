import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

const LoanEMICalculatorPage: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTenure, setLoanTenure] = useState<string>('');
  const [result, setResult] = useState<EMIResult | null>(null);

  const handleCalculate = () => {
    const P = parseFloat(principal) || 0;
    const R_annual = parseFloat(interestRate) || 0;
    const N_years = parseFloat(loanTenure) || 0;

    if (P <= 0 || R_annual <= 0 || N_years <= 0) {
      setResult(null);
      return;
    }

    const r = (R_annual / 100) / 12; // Monthly interest rate
    const n = N_years * 12; // Total number of months

    // EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = P * r * Math.pow((1 + r), n) / (Math.pow((1 + r), n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setResult({
      emi: emi,
      totalInterest: totalInterest,
      totalPayment: totalPayment,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Loan EMI Calculator
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Estimate your Equated Monthly Installments (EMI) for any loan.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="principal-amount">Loan Amount (Principal)</Label>
              <Input id="principal-amount" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g., 1000000" />
            </div>
            <div>
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <Input id="interest-rate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="e.g., 8.5" />
            </div>
            <div>
              <Label htmlFor="loan-tenure">Loan Tenure (Years)</Label>
              <Input id="loan-tenure" type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} placeholder="e.g., 15" />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" /> Calculate EMI
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Calculation Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Monthly EMI:</span>
                <span>₹{result.emi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Total Interest Payable:</span>
                <span>₹{result.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Payment (Principal + Interest):</span>
                <span>₹{result.totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default LoanEMICalculatorPage;