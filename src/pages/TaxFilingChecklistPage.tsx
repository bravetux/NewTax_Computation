import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { CheckCircle, FileText, DollarSign, Briefcase, Home, Banknote, HeartHandshake, GraduationCap, Shield, Receipt, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TaxFilingChecklistPage: React.FC = () => {
  const checklistItems = [
    {
      category: "Personal Information",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      items: [
        "PAN Card",
        "Aadhaar Card",
        "Bank Account Details (Account Number, IFSC Code)",
        "Previous Year's Income Tax Return (if applicable)",
      ],
    },
    {
      category: "Income Details",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      items: [
        "Form 16 (for Salaried Individuals)",
        "Form 16A (TDS on other income like FD interest, rent)",
        "Form 16B (TDS on sale of property)",
        "Form 26AS (Tax Credit Statement)",
        "AIS (Annual Information Statement) & TIS (Taxpayer Information Summary)",
        "Salary Slips",
        "Bank Statements (for interest income, dividends, etc.)",
        "Interest Certificates from Banks/Post Office (FDs, Savings Accounts)",
        "Dividend Income Statements",
        "Rental Income Details (Rent received, Property Tax paid, Interest on Home Loan)",
        "Capital Gains Statements (Demat/Mutual Fund statements for STCG/LTCG)",
        "Business/Profession Income & Expense Details (P&L, Balance Sheet)",
        "Other Income (e.g., freelance income, lottery winnings)",
      ],
    },
    {
      category: "Deductions & Exemptions",
      icon: <Receipt className="h-5 w-5 text-purple-500" />,
      items: [
        "Section 80C Investments (PPF, ELSS, Life Insurance Premium, Home Loan Principal, Tuition Fees, etc.)",
        "Section 80D (Health Insurance Premium)",
        "Section 80E (Education Loan Interest Certificate)",
        "Section 80G (Donations Receipts)",
        "Section 80TTA/TTB (Interest on Savings Account/FDs for Senior Citizens)",
        "Section 80GG (House Rent Paid if HRA not received)",
        "Other applicable deductions (e.g., 80U for disability, 80DD for dependent disability)",
      ],
    },
    {
      category: "Tax Payments",
      icon: <Banknote className="h-5 w-5 text-yellow-600" />,
      items: [
        "Advance Tax Challans (if paid)",
        "Self-Assessment Tax Challans (if paid)",
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Tax Filing Checklist
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Ensure you have all the necessary documents and information ready before filing your Income Tax Return.
        </p>

        <Alert className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">Important Note</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            This checklist is a general guide. Always refer to the official Income Tax Department guidelines and your specific financial situation for accurate filing.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {checklistItems.map((category, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center space-x-3">
                {category.icon}
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TaxFilingChecklistPage;