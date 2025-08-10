import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Section54FPage: React.FC = () => {
  const [totalValueShares, setTotalValueShares] = useState<string>('');
  const [costOfShares, setCostOfShares] = useState<string>('');
  const [costOfHouse, setCostOfHouse] = useState<string>('');
  const [capitalGains, setCapitalGains] = useState<string>('');
  const [exemption, setExemption] = useState<number | null>(null);
  const [tax, setTax] = useState<number | null>(null);

  const handleCalculate = () => {
    const totalValue = parseFloat(totalValueShares) || 0;
    const costHouse = parseFloat(costOfHouse) || 0;
    const gains = parseFloat(capitalGains) || 0;

    if (totalValue <= 0 || gains <= 0) {
      setExemption(0);
      setTax(0);
      return;
    }

    let calculatedExemption;
    if (costHouse >= totalValue) {
      calculatedExemption = gains;
    } else {
      calculatedExemption = (gains * costHouse) / totalValue;
    }
    
    const finalExemption = Math.min(gains, calculatedExemption);
    setExemption(finalExemption);

    const taxableGains = Math.max(0, gains - finalExemption);
    const calculatedTax = taxableGains * 0.125;
    setTax(calculatedTax);
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
              <h4 className="font-semibold text-base mb-1">Exemption amount:</h4>
              <p className="text-muted-foreground">If you invest an amount equal to or more than the total value of shares, the entire LTCG is exempt. Otherwise, the exemption is calculated proportionately:</p>
              <p className="font-mono bg-muted p-2 rounded-md my-2 text-center">Exemption = (LTCG × Cost of House) / Total Value of Shares</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="total-value-shares">Total Value of Shares</Label>
              <Input id="total-value-shares" type="number" value={totalValueShares} onChange={(e) => setTotalValueShares(e.target.value)} placeholder="e.g., 5000000" />
            </div>
            <div>
              <Label htmlFor="cost-of-shares">Cost of Shares</Label>
              <Input id="cost-of-shares" type="number" value={costOfShares} onChange={(e) => setCostOfShares(e.target.value)} placeholder="e.g., 2000000" />
            </div>
            <div>
              <Label htmlFor="capital-gains">LTCG Amount</Label>
              <Input id="capital-gains" type="number" value={capitalGains} onChange={(e) => setCapitalGains(e.target.value)} placeholder="e.g., 3000000" />
            </div>
            <div>
              <Label htmlFor="cost-of-house">Cost of House</Label>
              <Input id="cost-of-house" type="number" value={costOfHouse} onChange={(e) => setCostOfHouse(e.target.value)} placeholder="e.g., 4000000" />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" /> Calculate Exemption
            </Button>
          </CardContent>
        </Card>

        {exemption !== null && taxableCapitalGains !== null && tax !== null && (
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
              <Alert variant="destructive">
                <AlertTitle className="text-lg">Tax Payable (12.5%)</AlertTitle>
                <AlertDescription className="text-2xl font-bold">
                  ₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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