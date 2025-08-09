import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';

interface GiftingRecipientCardProps {
  name: string;
  age: number | string;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showWorkingToggle: boolean;
  isWorking?: boolean;
  onIsWorkingChange?: (checked: boolean) => void;
  grossIncome?: number | string;
  onGrossIncomeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GiftingRecipientCard: React.FC<GiftingRecipientCardProps> = ({
  name,
  age,
  onAgeChange,
  showWorkingToggle,
  isWorking,
  onIsWorkingChange,
  grossIncome,
  onGrossIncomeChange,
}) => {
  const isAdult = Number(age) >= 18;
  const income = Number(grossIncome) || 0;
  const incomeLimit = 1200000;
  const isIncomeBelowLimit = income < incomeLimit;

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

        {isAdult && (
          <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Gifting is allowed.
            </AlertDescription>
          </Alert>
        )}

        {showWorkingToggle && onIsWorkingChange && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`working-${name}`}
                checked={isWorking}
                onCheckedChange={onIsWorkingChange}
              />
              <Label htmlFor={`working-${name}`}>Is Working?</Label>
            </div>
            {isWorking && (
              <div className="space-y-4">
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
                {String(grossIncome).length > 0 && (
                  isIncomeBelowLimit ? (
                    <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                      <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Income is below ₹12L. Gifting is a good option.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Income is above ₹12L. Gifting may not be the most tax-efficient option.
                      </AlertDescription>
                    </Alert>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftingRecipientCard;