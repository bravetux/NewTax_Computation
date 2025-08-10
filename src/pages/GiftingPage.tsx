import React, { useState, useEffect } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import GiftingRecipientCard from '@/components/GiftingRecipientCard';
import { calculateTax, DetailedIncome, TaxCalculationResult } from '@/utils/taxCalculator';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2, RotateCcw } from 'lucide-react';

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

const LOCAL_STORAGE_KEY = "dyad-gifting-recipients-data";

const initialRecipientState: Recipient = {
  age: '', salary: '', isSalaried: false, fdIncome: '', bondIncome: '', dividendIncome: '', stcg: '', ltcg: '', taxDetails: null
};

const initialRecipientsState = {
  spouse: { ...initialRecipientState },
  mother: { ...initialRecipientState },
  father: { ...initialRecipientState },
  kid1: { ...initialRecipientState },
  kid2: { ...initialRecipientState },
};

const GiftingPage: React.FC = () => {
  const [recipients, setRecipients] = useState<Record<string, Recipient>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null && 'spouse' in parsed) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load gifting data from localStorage", error);
    }
    return initialRecipientsState;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipients));
  }, [recipients]);

  useEffect(() => {
    const syncState = () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          setRecipients(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing gifting data on sync", e);
        }
      }
    };

    window.addEventListener('storage', syncState);
    window.addEventListener('focus', syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('focus', syncState);
    };
  }, []);

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

  const handleClearCard = (recipientKey: keyof typeof recipients) => {
    setRecipients(prev => ({
      ...prev,
      [recipientKey]: { ...initialRecipientState }
    }));
  };

  const handleClearAllCards = () => {
    setRecipients(initialRecipientsState);
  };

  const handleResetAllComputations = () => {
    setRecipients(prev => {
      const newState = { ...prev };
      for (const key in newState) {
        newState[key].taxDetails = null;
      }
      return newState;
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Gifting & Tax Planner
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleClearAllCards}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear All Fields</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleResetAllComputations}>
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Reset All Tax Computations</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Enter the income details for your family members to compute their individual tax liability under the new tax regime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(recipients).map(([key, recipient]) => (
            <GiftingRecipientCard
              key={key}
              name={key.charAt(0).toUpperCase() + key.slice(1).replace(/[0-9]/g, ' $&')}
              age={recipient.age}
              onAgeChange={(e) => handleStateChange(key as keyof typeof recipients, 'age', e.target.value)}
              
              salary={recipient.salary}
              onSalaryChange={(e) => handleStateChange(key as keyof typeof recipients, 'salary', e.target.value)}
              isSalaried={recipient.isSalaried}
              onIsSalariedChange={(checked) => handleStateChange(key as keyof typeof recipients, 'isSalaried', checked)}

              fdIncome={recipient.fdIncome}
              onFdIncomeChange={(e) => handleStateChange(key as keyof typeof recipients, 'fdIncome', e.target.value)}
              bondIncome={recipient.bondIncome}
              onBondIncomeChange={(e) => handleStateChange(key as keyof typeof recipients, 'bondIncome', e.target.value)}
              dividendIncome={recipient.dividendIncome}
              onDividendIncomeChange={(e) => handleStateChange(key as keyof typeof recipients, 'dividendIncome', e.target.value)}

              stcg={recipient.stcg}
              onStcgChange={(e) => handleStateChange(key as keyof typeof recipients, 'stcg', e.target.value)}
              ltcg={recipient.ltcg}
              onLtcgChange={(e) => handleStateChange(key as keyof typeof recipients, 'ltcg', e.target.value)}

              taxDetails={recipient.taxDetails}
              onComputeTax={() => handleComputeTax(key as keyof typeof recipients)}
              onClearFields={() => handleClearCard(key as keyof typeof recipients)}
            />
          ))}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default GiftingPage;