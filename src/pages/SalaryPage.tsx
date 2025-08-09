import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowLeft } from "lucide-react";
import IncomeField from "@/components/IncomeField";

const LOCAL_STORAGE_KEY = "dyad-salary-income";

const SalaryPage: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salaryIncome));
    window.dispatchEvent(new Event('storage')); // Notify other components
  }, [salaryIncome]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/income-summary" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Income Summary
        </Link>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Salary Income
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Salary Details</CardTitle>
          </Header>
          <CardContent>
            <IncomeField
              label="Gross Salary Income"
              id="salary-income"
              value={salaryIncome}
              onChange={(e) => setSalaryIncome(e.target.value)}
              placeholder="Enter your total gross salary for the year"
            />
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default SalaryPage;