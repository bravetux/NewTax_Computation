import React, { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import GiftingRecipientCard from '@/components/GiftingRecipientCard';
import { calculateTax, DetailedIncome, TaxCalculationResult } from '@/utils/taxCalculator';

interface Recipient {
  age: number | string;
  salary: number | string;
  isSalaried: boolean;
  fdIncome: number | string;
  bondIncome: number | string;
  dividendIncome: number | string;
  stcg: number | string;
  ltcg: number | string;
  taxDetails: TaxCalculationResult | null;
}

const GiftingPage: React.FC = () => {
  const [recipients, setRecipients] = useState<Record<string, Recipient>>({
    spouse: { age: '', salary: '', isSalaried: false, fdIncome: '', bondIncome: '', dividendIncome: '', stcg: '', ltcg: '', taxDetails: null },
    mother: { age: '', salary: '', isSalaried: false, fdIncome: '', bondIncome: '', dividendIncome: '', stcg: '', ltcg: '', taxDetails: null },
    father: { age: '', salary: '', isSalaried: false, fdIncome: '', bondIncome: '', dividendIncome: '', stcg: '', ltcg: '', taxDetails: null },
    kid1: { age: '', salary: '', isSalaried: false, fdIncome: '', bondIncome: '', dividendIncome: '', stcg: '', ltcg: '', taxDetails: null },
    kid2: { age: '', salary: '', isSalaried: false, fdIncome: '', bondIncome: '', dividendIncome: '', stcg: '', ltcg: '', taxDetails: null },
  });

  const handleStateChange = (recipient: keyof typeof recipients, field: keyof Recipient, value: any) => {
    setRecipients(prev => ({
      ...prev,
      [recipient]: { ...prev[recipient], [field]: value, taxDetails: null },
    }));
  };

  const handleComputeTax = (recipientKey: keyof typeof recipients) => {
    const recipient = recipients[recipientKey];
    
    const incomeDetails: DetailedIncome = {
      salary: Number(recipient.salary) || 0,
      isSalaried: recipient.isSalaried,
      fdIncome: Number(recipient.fdIncome) || 0,
      bondIncome: Number(recipient.bondIncome) || 0,
      dividendIncome: Number(recipient.dividendIncome) || 0,
      stcg: Number(recipient.stcg) || 0,
      ltcg: Number(recipient.ltcg) || 0,
    };

    const taxDetails = calculateTax(incomeDetails);
    
    setRecipients(prev => ({
      ...prev,
      [recipientKey]: { ...prev[recipientKey], taxDetails: taxDetails },
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Gifting & Tax Planner
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Enter the income details for your family members to compute their individual tax liability under the new tax regime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(recipients).map(([key, recipient]) => (
            <GiftingRecipientCard
              key={key}
              name={key.charAt(0).toUpperCase() + key.slice(1).replace(/[0-9]/g, ' $&')}
              age={recipient.age}
              onAgeChange={(e) => handleStateChange(key, 'age', e.target.value)}
              
              salary={recipient.salary}
              onSalaryChange={(e) => handleStateChange(key, 'salary', e.target.value)}
              isSalaried={recipient.isSalaried}
              onIsSalariedChange={(checked) => handleStateChange(key, 'isSalaried', checked)}

              fdIncome={recipient.fdIncome}
              onFdIncomeChange={(e) => handleStateChange(key, 'fdIncome', e.target.value)}
              bondIncome={recipient.bondIncome}
              onBondIncomeChange={(e) => handleStateChange(key, 'bondIncome', e.target.value)}
              dividendIncome={recipient.dividendIncome}
              onDividendIncomeChange={(e) => handleStateChange(key, 'dividendIncome', e.target.value)}

              stcg={recipient.stcg}
              onStcgChange={(e) => handleStateChange(key, 'stcg', e.target.value)}
              ltcg={recipient.ltcg}
              onLtcgChange={(e) => handleStateChange(key, 'ltcg', e.target.value)}

              taxDetails={recipient.taxDetails}
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