import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator } from 'lucide-react';
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

        <Card>
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="capital-gains">Long-Term Capital Gains (LTCG)</Label>
              <Input id="capital-gains" type="number" value={capitalGains} onChange={(e) => setCapitalGains(e.target.value)} placeholder="e.g., 5000000" />
            </div>
            <div>
              <Label htmlFor="sale-consideration">Full Sale Value of Asset</Label>
              <Input id="sale-consideration" type="number" value={saleConsideration} onChange={(e) => setSaleConsideration(e.target.value)} placeholder="e.g., 10000000" />
            </div>
            <div>
              <Label htmlFor="transfer-expenses">Expenses on Transfer</Label>
              <Input id="transfer-expenses" type="number" value={transferExpenses} onChange={(e) => setTransferExpenses(e.target.value)} placeholder="e.g., 100000" />
            </div>
            <div className="p-2 rounded-md bg-muted/50">
              <div className="flex justify-between text-sm font-medium">
                <span>Net Sale Consideration:</span>
                <span>₹{netConsideration.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="cost-new-house">Cost of New Residential House</Label>
              <Input id="cost-new-house" type="number" value={costOfNewHouse} onChange={(e) => setCostOfNewHouse(e.target.value)} placeholder="e.g., 8000000" />
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