import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface GiftingRecipientCardProps {
  name: string;
  age: number | string;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showWorkingToggle: boolean;
  isWorking?: boolean;
  onIsWorkingChange?: (checked: boolean) => void;
}

const GiftingRecipientCard: React.FC<GiftingRecipientCardProps> = ({
  name,
  age,
  onAgeChange,
  showWorkingToggle,
  isWorking,
  onIsWorkingChange,
}) => {
  const isAdult = Number(age) >= 18;

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
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`working-${name}`}
                checked={isWorking}
                onCheckedChange={onIsWorkingChange}
              />
              <Label htmlFor={`working-${name}`}>Is Working?</Label>
            </div>
            {isWorking && (
              <p className="text-sm text-muted-foreground">
                If their income is below ₹12L, you can consider gifting them.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftingRecipientCard;