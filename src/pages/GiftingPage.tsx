import React, { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import GiftingRecipientCard from '@/components/GiftingRecipientCard';
import { calculateTax } from '@/utils/taxCalculator';

interface Recipient {
  age: number | string;
  grossIncome: number | string;
  isSalaried: boolean;
  taxLiable: number | null;
}

const GiftingPage: React.FC = () => {
  const [recipients, setRecipients] = useState<Record<string, Recipient>>({
    spouse: { age: '', grossIncome: '', isSalaried: false, taxLiable: null },
    mother: { age: '', grossIncome: '', isSalaried: false, taxLiable: null },
    father: { age: '', grossIncome: '', isSalaried: false, taxLiable: null },
    kid1: { age: '', grossIncome: '', isSalaried: false, taxLiable: null },
    kid2: { age: '', grossIncome: '', isSalaried: false, taxLiable: null },
  });

  const handleStateChange = (recipient: keyof typeof recipients, field: keyof Recipient, value: any) => {
    setRecipients(prev => ({
      ...prev,
      [recipient]: { ...prev[recipient], [field]: value },
    }));
  };

  const handleComputeTax = (recipientKey: keyof typeof recipients) => {
    const recipient = recipients[recipientKey];
    const income = Number(recipient.grossIncome) || 0;
    const tax = calculateTax(income, recipient.isSalaried);
    handleStateChange(recipientKey, 'taxLiable', tax);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Gifting & Tax Planner
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Enter the income details for your family members to compute their individual tax liability under the new tax regime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(recipients).map(([key, recipient]) => (
            <GiftingRecipientCard
              key={key}
              name={key.charAt(0).toUpperCase() + key.slice(1).replace(/[0-9]/g, ' $&')}
              age={recipient.age}
              onAgeChange={(e) => handleStateChange(key, 'age', e.target.value)}
              grossIncome={recipient.grossIncome}
              onGrossIncomeChange={(e) => handleStateChange(key, 'grossIncome', e.target.value)}
              isSalaried={recipient.isSalaried}
              onIsSalariedChange={(checked) => handleStateChange(key, 'isSalaried', checked)}
              taxLiable={recipient.taxLiable}
              onComputeTax={() => handleComputeTax(key as keyof typeof recipients)}
            />
          ))}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default GiftingPage;