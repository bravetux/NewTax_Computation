import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface GiftingRecipientCardProps {
  name: string;
  age: number | string;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  grossIncome: number | string;
  onGrossIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSalaried: boolean;
  onIsSalariedChange: (checked: boolean) => void;
  taxLiable: number | null;
  onComputeTax: () => void;
}

const GiftingRecipientCard: React.FC<GiftingRecipientCardProps> = ({
  name,
  age,
  onAgeChange,
  grossIncome,
  onGrossIncomeChange,
  isSalaried,
  onIsSalariedChange,
  taxLiable,
  onComputeTax,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`age-${name}`}>Age</Label>
          <Input
            id={`age-${name}`}
            type="number"
            value={age}
            onChange={onAgeChange}
            placeholder="Enter age"
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor={`income-${name}`}>Gross Annual Income</Label>
          <Input
            id={`income-${name}`}
            type="number"
            value={grossIncome}
            onChange={onGrossIncomeChange}
            placeholder="e.g. 500000"
            min="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`salaried-${name}`}
            checked={isSalaried}
            onCheckedChange={onIsSalariedChange}
          />
          <Label htmlFor={`salaried-${name}`}>Is this income from salary/pension?</Label>
        </div>

        <Button onClick={onComputeTax} className="w-full">
          <Calculator className="mr-2 h-4 w-4" /> Compute Tax
        </Button>

        {taxLiable !== null && (
          <div className="pt-2">
            <Label>Tax Liability</Label>
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