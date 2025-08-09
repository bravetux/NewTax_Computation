import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calculator, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { TaxCalculationResult } from '@/utils/taxCalculator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GiftingRecipientCardProps {
  name: string;
  age: number | string;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  salary: number | string;
  onSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSalaried: boolean;
  onIsSalariedChange: (checked: boolean) => void;

  fdIncome: number | string;
  onFdIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bondIncome: number | string;
  onBondIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dividendIncome: number | string;
  onDividendIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  stcg: number | string;
  onStcgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ltcg: number | string;
  onLtcgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  taxDetails: TaxCalculationResult | null;
  onComputeTax: () => void;
}

const BreakdownRow: React.FC<{ label: string; value: number; isNegative?: boolean }> = ({ label, value, isNegative = false }) => (
  <div className="flex justify-between text-sm">
    <span>{label}</span>
    <span className="font-mono">{isNegative ? '-' : ''} ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  </div>
);

const GiftingRecipientCard: React.FC<GiftingRecipientCardProps> = ({
  name,
  age, onAgeChange,
  salary, onSalaryChange,
  isSalaried, onIsSalariedChange,
  fdIncome, onFdIncomeChange,
  bondIncome, onBondIncomeChange,
  dividendIncome, onDividendIncomeChange,
  stcg, onStcgChange,
  ltcg, onLtcgChange,
  taxDetails, onComputeTax,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`age-${name}`}>Age</Label>
          <Input id={`age-${name}`} type="number" value={age} onChange={onAgeChange} placeholder="Enter age" min="0" />
        </div>
        
        <Separator />

        <div>
          <Label htmlFor={`salary-${name}`}>Salary / Pension Income</Label>
          <Input id={`salary-${name}`} type="number" value={salary} onChange={onSalaryChange} placeholder="e.g. 500000" min="0" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id={`salaried-${name}`} checked={isSalaried} onCheckedChange={onIsSalariedChange} />
          <Label htmlFor={`salaried-${name}`}>Is this income from salary/pension?</Label>
        </div>

        <Separator />

        <Label className="font-semibold">Other Income</Label>
        <div>
          <Label htmlFor={`fd-${name}`}>FD Interest Income</Label>
          <Input id={`fd-${name}`} type="number" value={fdIncome} onChange={onFdIncomeChange} placeholder="Enter FD income" min="0" />
        </div>
        <div>
          <Label htmlFor={`bond-${name}`}>Bond Interest Income</Label>
          <Input id={`bond-${name}`} type="number" value={bondIncome} onChange={onBondIncomeChange} placeholder="Enter bond income" min="0" />
        </div>
        <div>
          <Label htmlFor={`dividend-${name}`}>Dividend Income</Label>
          <Input id={`dividend-${name}`} type="number" value={dividendIncome} onChange={onDividendIncomeChange} placeholder="Enter dividend income" min="0" />
        </div>

        <Separator />

        <Label className="font-semibold">Capital Gains</Label>
        <div>
          <Label htmlFor={`stcg-${name}`}>Short-Term Capital Gains (STCG)</Label>
          <Input id={`stcg-${name}`} type="number" value={stcg} onChange={onStcgChange} placeholder="Enter STCG" min="0" />
        </div>
        <div>
          <Label htmlFor={`ltcg-${name}`}>Long-Term Capital Gains (LTCG)</Label>
          <Input id={`ltcg-${name}`} type="number" value={ltcg} onChange={onLtcgChange} placeholder="Enter LTCG" min="0" />
        </div>

        <Separator />

        <Button onClick={onComputeTax} className="w-full">
          <Calculator className="mr-2 h-4 w-4" /> Compute Tax
        </Button>

        {taxDetails !== null && (
          <div className="pt-4 mt-4 border-t space-y-2">
            <h4 className="font-semibold text-center">Tax Calculation Breakdown</h4>
            
            {taxDetails.isRebateApplicable && (
              <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Rebate Applicable</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  Taxable income is below the threshold, so income tax is zero.
                </AlertDescription>
              </Alert>
            )}

            <Label className="font-semibold">Income Tax</Label>
            <BreakdownRow label="Gross Slab Income" value={taxDetails.grossSlabIncome} />
            <BreakdownRow label="Standard Deduction" value={taxDetails.standardDeduction} isNegative />
            <Separator className="my-1" />
            <BreakdownRow label="Net Taxable Income" value={taxDetails.netTaxableSlabIncome} />
            <BreakdownRow label="Tax on Income" value={taxDetails.slabTaxBeforeRebate} />
            <BreakdownRow label="Surcharge" value={taxDetails.surcharge} />
            <BreakdownRow label="Cess (4%)" value={taxDetails.cess} />
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-sm"><span>Total Income Tax</span><span className="font-mono">₹{taxDetails.totalIncomeTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>

            <Label className="font-semibold pt-2 block">Capital Gains Tax</Label>
            <BreakdownRow label="LTCG Tax" value={taxDetails.ltcgTax} />
            <BreakdownRow label="STCG Tax" value={taxDetails.stcgTax} />
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-sm"><span>Total Capital Gains Tax</span><span className="font-mono">₹{taxDetails.totalCapitalGainsTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>

            <Separator className="my-2" />
            <div className="text-lg font-bold p-2 bg-muted rounded-md text-center flex justify-between items-center">
              <span>Total Tax Liability</span>
              <span className="font-mono">₹{taxDetails.totalTaxPayable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftingRecipientCard;