import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  taxLiable: number | null;
  onComputeTax: () => void;
}

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
  taxLiable, onComputeTax,
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

        {taxLiable !== null && (
          <div className="pt-2">
            <Label>Total Tax Liability</Label>
            <div className="text-lg font-bold p-2 bg-muted rounded-md text-center">
              ₹{taxLiable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftingRecipientCard;