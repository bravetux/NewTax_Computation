import React, { useState } from "react";
import IncomeField from "@/components/IncomeField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";

const IncomeTaxDashboard: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | string>("");
  const [rentalIncome, setRentalIncome] = useState<number | string>("");
  const [fdIncome, setFdIncome] = useState<number | string>("");
  const [bondIncome, setBondIncome] = useState<number | string>("");
  const [speculativeIncome, setSpeculativeIncome] = useState<number | string>("");
  const [dividendIncome, setDividendIncome] = useState<number | string>("");

  const totalIncome =
    (Number(salaryIncome) || 0) +
    (Number(rentalIncome) || 0) +
    (Number(fdIncome) || 0) +
    (Number(bondIncome) || 0) +
    (Number(speculativeIncome) || 0) +
    (Number(dividendIncome) || 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          India Income Tax Planning Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card id="salary-income">
            <CardHeader><CardTitle>Salary Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Gross Salary" id="salaryIncome" value={salaryIncome} onChange={(e) => setSalaryIncome(e.target.value)} placeholder="Enter salary income" />
            </CardContent>
          </Card>
          <Card id="rental-income">
            <CardHeader><CardTitle>Rental Property Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Annual Rent Received" id="rentalIncome" value={rentalIncome} onChange={(e) => setRentalIncome(e.target.value)} placeholder="Enter rental income" />
            </CardContent>
          </Card>
          <Card id="fd-income">
            <CardHeader><CardTitle>FD Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Interest from Fixed Deposits" id="fdIncome" value={fdIncome} onChange={(e) => setFdIncome(e.target.value)} placeholder="Enter FD interest" />
            </CardContent>
          </Card>
          <Card id="bond-income">
            <CardHeader><CardTitle>Bond Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Interest from Bonds" id="bondIncome" value={bondIncome} onChange={(e) => setBondIncome(e.target.value)} placeholder="Enter bond interest" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Speculative Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Profit from Speculation" id="speculativeIncome" value={speculativeIncome} onChange={(e) => setSpeculativeIncome(e.target.value)} placeholder="Enter speculative income" />
            </CardContent>
          </Card>
          <Card id="dividend-income">
            <CardHeader><CardTitle>Dividend Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Dividends Received" id="dividendIncome" value={dividendIncome} onChange={(e) => setDividendIncome(e.target.value)} placeholder="Enter dividend income" />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Income Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Total Income (excluding capital gains): ₹{totalIncome.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              (Capital gains are managed on their dedicated page.)
            </p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default IncomeTaxDashboard;