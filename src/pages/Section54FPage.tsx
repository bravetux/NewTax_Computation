import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Section54FPage: React.FC = () => {
  const [saleConsideration, setSaleConsideration] = useState<string>('');
  const [transferExpenses, setTransferExpenses] = useState<string>('');
  const [costOfNewHouse, setCostOfNewHouse] = useState<string>('');
  const [capitalGains, setCapitalGains] = useState<string>('');
  const [exemption, setExemption] = useState<number | null>(null);

  const netConsideration = useMemo(() => {
    const sale = parseFloat(saleConsideration) || 0;
    const expenses = parseFloat(transferExpenses) || 0;
    return sale - expenses;
  }, [saleConsideration, transferExpenses]);

  const handleCalculate = () => {
    const gains = parseFloat(capitalGains) || 0;
    const newHouseCost = parseFloat(costOfNewHouse) || 0;

    if (netConsideration <= 0 || gains <= 0) {
      setExemption(0);
      return;
    }

    // If cost of new house is >= net consideration, entire capital gain is exempt.
    if (newHouseCost >= netConsideration) {
      setExemption(gains);
    } else {
      // Otherwise, exemption is proportionate.
      const calculatedExemption = (gains * newHouseCost) / netConsideration;
      setExemption(Math.min(gains, calculatedExemption));
    }
  };

  const taxableCapitalGains = useMemo(() => {
    if (exemption === null) return null;
    const gains = parseFloat(capitalGains) || 0;
    return Math.max(0, gains - exemption);
  }, [capitalGains, exemption]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Section 54F Exemption Calculator
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Calculate tax exemption on long-term capital gains from the sale of any asset (other than a residential house) by investing the proceeds in a new residential house.
        </p>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Example Calculation</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>You sell shares with a net consideration of <strong>₹50 lakh</strong>.</li>
              <li>Your Long-Term Capital Gains (LTCG) from this sale are <strong>₹30 lakh</strong>.</li>
              <li>You invest in a new house costing <strong>₹40 lakh</strong>.</li>
            </ul>
            <p className="mt-3 text-sm">
              The exemption is calculated proportionately:
            </p>
            <p className="font-mono bg-muted p-2 rounded-md mt-1 text-sm">
              (₹30,00,000 × ₹40,00,000) / ₹50,00,000 = <strong>₹24,00,000</strong>
            </p>
            <p className="mt-3 text-sm">
              Your taxable LTCG is ₹30,00,000 - ₹24,00,000 = <strong>₹6,00,000</strong>. This amount will be taxed at the applicable rate (e.g., 10% + cess).
            </p>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="capital-gains">Long-Term Capital Gains (LTCG)</Label>
              <Input id="capital-gains" type="number" value={capitalGains} onChange={(e) => setCapitalGains(e.target.value)} placeholder="e.g., 3000000" />
            </div>
            <div>
              <Label htmlFor="sale-consideration">Full Sale Value of Asset</Label>
              <Input id="sale-consideration" type="number" value={saleConsideration} onChange={(e) => setSaleConsideration(e.target.value)} placeholder="e.g., 5000000" />
            </div>
            <div>
              <Label htmlFor="transfer-expenses">Expenses on Transfer</Label>
              <Input id="transfer-expenses" type="number" value={transferExpenses} onChange={(e) => setTransferExpenses(e.target.value)} placeholder="e.g., 0" />
            </div>
            <div className="p-2 rounded-md bg-muted/50">
              <div className="flex justify-between text-sm font-medium">
                <span>Net Sale Consideration:</span>
                <span>₹{netConsideration.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="cost-new-house">Cost of New Residential House</Label>
              <Input id="cost-new-house" type="number" value={costOfNewHouse} onChange={(e) => setCostOfNewHouse(e.target.value)} placeholder="e.g., 4000000" />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" /> Calculate Exemption
            </Button>
          </CardContent>
        </Card>

        {exemption !== null && taxableCapitalGains !== null && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Exemption Calculation Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle className="text-lg">Exemption under Section 54F</AlertTitle>
                <AlertDescription className="text-2xl font-bold">
                  ₹{exemption.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle className="text-lg">Taxable Capital Gains</AlertTitle>
                <AlertDescription className="text-2xl font-bold">
                  ₹{taxableCapitalGains.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Section54FPage;