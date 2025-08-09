import React, { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import GiftingRecipientCard from '@/components/GiftingRecipientCard';

const GiftingPage: React.FC = () => {
  const [recipients, setRecipients] = useState({
    spouse: { age: '', isWorking: false, grossIncome: '' },
    kid1: { age: '' },
    kid2: { age: '' },
    mother: { age: '', isWorking: false, grossIncome: '' },
    father: { age: '', isWorking: false, grossIncome: '' },
  });

  const handleAgeChange = (recipient: keyof typeof recipients, value: string) => {
    setRecipients(prev => ({
      ...prev,
      [recipient]: { ...prev[recipient], age: value },
    }));
  };

  const handleWorkingChange = (recipient: 'spouse' | 'mother' | 'father', checked: boolean) => {
    setRecipients(prev => ({
      ...prev,
      [recipient]: { ...prev[recipient], isWorking: checked },
    }));
  };

  const handleIncomeChange = (recipient: 'spouse' | 'mother' | 'father', value: string) => {
    setRecipients(prev => ({
      ...prev,
      [recipient]: { ...prev[recipient], grossIncome: value },
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Gifting Planner
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Plan your gifts to family members. Gifts to specified relatives (like spouse, children, and parents) are tax-free in the hands of the recipient, regardless of the amount.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GiftingRecipientCard
            name="Spouse"
            age={recipients.spouse.age}
            onAgeChange={(e) => handleAgeChange('spouse', e.target.value)}
            showWorkingToggle={true}
            isWorking={recipients.spouse.isWorking}
            onIsWorkingChange={(checked) => handleWorkingChange('spouse', checked)}
            grossIncome={recipients.spouse.grossIncome}
            onGrossIncomeChange={(e) => handleIncomeChange('spouse', e.target.value)}
          />
          <GiftingRecipientCard
            name="Kid 1"
            age={recipients.kid1.age}
            onAgeChange={(e) => handleAgeChange('kid1', e.target.value)}
            showWorkingToggle={false}
          />
          <GiftingRecipientCard
            name="Kid 2"
            age={recipients.kid2.age}
            onAgeChange={(e) => handleAgeChange('kid2', e.target.value)}
            showWorkingToggle={false}
          />
          <GiftingRecipientCard
            name="Mother"
            age={recipients.mother.age}
            onAgeChange={(e) => handleAgeChange('mother', e.target.value)}
            showWorkingToggle={true}
            isWorking={recipients.mother.isWorking}
            onIsWorkingChange={(checked) => handleWorkingChange('mother', checked)}
            grossIncome={recipients.mother.grossIncome}
            onGrossIncomeChange={(e) => handleIncomeChange('mother', e.target.value)}
          />
          <GiftingRecipientCard
            name="Father"
            age={recipients.father.age}
            onAgeChange={(e) => handleAgeChange('father', e.target.value)}
            showWorkingToggle={true}
            isWorking={recipients.father.isWorking}
            onIsWorkingChange={(checked) => handleWorkingChange('father', checked)}
            grossIncome={recipients.father.grossIncome}
            onGrossIncomeChange={(e) => handleIncomeChange('father', e.target.value)}
          />
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default GiftingPage;