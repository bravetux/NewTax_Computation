import React, { useState } from "react";
import IncomeField from "@/components/IncomeField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import CapitalGainsCard from "@/components/CapitalGainsCard";

interface DematAccount {
  stcg: number | string;
  ltcg: number | string;
}

const IncomeTaxDashboard: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | string>("");
  const [rentalIncome, setRentalIncome] = useState<number | string>("");
  const [fdIncome, setFdIncome] = useState<number | string>("");
  const [bondIncome, setBondIncome] = useState<number | string>("");
  const [speculativeIncome, setSpeculativeIncome] = useState<number | string>("");
  const [dividendIncome, setDividendIncome] = useState<number | string>("");

  const [dematAccounts, setDematAccounts] = useState<DematAccount[]>(
    Array(5).fill({ stcg: "", ltcg: "" })
  );

  const handleDematChange = (
    index: number,
    field: "stcg" | "ltcg",
    value: string
  ) => {
    const newAccounts = [...dematAccounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setDematAccounts(newAccounts);
  };

  const totalDematGains = dematAccounts.reduce((total, account) => {
    return total + (Number(account.stcg) || 0) + (Number(account.ltcg) || 0);
  }, 0);

  const totalIncome =
    (Number(salaryIncome) || 0) +
    (Number(rentalIncome) || 0) +
    (Number(fdIncome) || 0) +
    (Number(bondIncome) || 0) +
    (Number(speculativeIncome) || 0) +
    (Number(dividendIncome) || 0) +
    totalDematGains;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          India Income Tax Planning Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Existing Income Cards */}
          <Card>
            <CardHeader><CardTitle>Salary Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Gross Salary" id="salaryIncome" value={salaryIncome} onChange={(e) => setSalaryIncome(e.target.value)} placeholder="Enter salary income" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Rental Property Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Annual Rent Received" id="rentalIncome" value={rentalIncome} onChange={(e) => setRentalIncome(e.target.value)} placeholder="Enter rental income" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>FD Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Interest from Fixed Deposits" id="fdIncome" value={fdIncome} onChange={(e) => setFdIncome(e.target.value)} placeholder="Enter FD interest" />
            </CardContent>
          </Card>
          <Card>
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
          <Card>
            <CardHeader><CardTitle>Dividend Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Dividends Received" id="dividendIncome" value={dividendIncome} onChange={(e) => setDividendIncome(e.target.value)} placeholder="Enter dividend income" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-50">
            Capital Gains from Demat Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dematAccounts.map((account, index) => (
              <CapitalGainsCard
                key={index}
                title={`Demat Account ${index + 1}`}
                stcg={account.stcg}
                ltcg={account.ltcg}
                onStcgChange={(e) => handleDematChange(index, "stcg", e.target.value)}
                onLtcgChange={(e) => handleDematChange(index, "ltcg", e.target.value)}
              />
            ))}
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Income Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Total Income (so far): ₹{totalIncome.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              (More income types and detailed calculations will be added here.)
            </p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default IncomeTaxDashboard;