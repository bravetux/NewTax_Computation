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

    if (newHouseCost >= netConsideration) {
      setExemption(gains);
    } else {
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Understanding Section 54F</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-base mb-1">Applies to:</h4>
              <p className="text-muted-foreground">LTCG from the sale of any long-term capital asset other than a residential house — this includes stocks, mutual funds, gold, land, etc.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-base mb-1">Who can use:</h4>
              <p className="text-muted-foreground">Individuals and HUFs (not companies).</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-1">Time limit for investment:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                <li><strong>Purchase:</strong> within 1 year before or 2 years after the date of sale.</li>
                <li><strong>Construction:</strong> within 3 years after the date of sale.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-1">Key conditions:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                <li>On the date of sale, you must not own more than one residential house (other than the new one).</li>
                <li>You cannot buy another residential house within 2 years or construct one within 3 years.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-1">Exemption amount:</h4>
              <p className="text-muted-foreground">If you invest the entire net sale consideration, the entire LTCG is exempt. Otherwise, the exemption is calculated proportionately:</p>
              <p className="font-mono bg-muted p-2 rounded-md my-2 text-center">Exemption = (LTCG × Cost of new house) / Net sale consideration</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-1">Capital Gains Account Scheme (CGAS):</h4>
              <p className="text-muted-foreground">If you don’t invest the amount before the ITR filing due date, you must deposit it in a CGAS account to claim the exemption.</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-1">Example:</h4>
              <div className="p-3 rounded-md border bg-background/50">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>You sell shares for a <strong>net consideration of ₹50 lakh</strong>.</li>
                  <li>Your Long-Term Capital Gains (LTCG) are <strong>₹30 lakh</strong>.</li>
                  <li>You buy a new house for <strong>₹40 lakh</strong>.</li>
                </ul>
                <p className="mt-3 text-muted-foreground">The exemption is calculated as:</p>
                <p className="font-mono bg-muted p-2 rounded-md mt-1 text-center">
                  (₹30,00,000 × ₹40,00,000) / ₹50,00,000 = <strong>₹24,00,000</strong>
                </p>
                <p className="mt-3 text-muted-foreground">
                  Your taxable LTCG is ₹30,00,000 - ₹24,00,000 = <strong>₹6,00,000</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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