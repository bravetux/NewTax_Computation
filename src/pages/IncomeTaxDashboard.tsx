import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IncomeField from "@/components/IncomeField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

const dividendSources = ["dyad-pms-dividends", "dyad-broker1-dividends", "dyad-broker2-dividends"];

const IncomeTaxDashboard: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | string>("");
  const [rentalIncome, setRentalIncome] = useState<number | string>("");
  const [fdIncome, setFdIncome] = useState<number | string>("");
  const [bondIncome, setBondIncome] = useState<number | string>("");
  const [speculativeIncome, setSpeculativeIncome] = useState<number | string>("");
  const [totalDividendIncome, setTotalDividendIncome] = useState(0);

  useEffect(() => {
    const calculateTotalDividends = () => {
      let total = 0;
      dividendSources.forEach(key => {
        try {
          const savedData = localStorage.getItem(key);
          const items: { amount: number }[] = savedData ? JSON.parse(savedData) : [];
          total += items.reduce((sum, item) => sum + (item.amount || 0), 0);
        } catch {}
      });
      setTotalDividendIncome(total);
    };

    calculateTotalDividends();

    window.addEventListener("storage", calculateTotalDividends);
    window.addEventListener("focus", calculateTotalDividends);

    return () => {
      window.removeEventListener("storage", calculateTotalDividends);
      window.removeEventListener("focus", calculateTotalDividends);
    };
  }, []);

  const totalIncome =
    (Number(salaryIncome) || 0) +
    (Number(rentalIncome) || 0) +
    (Number(fdIncome) || 0) +
    (Number(bondIncome) || 0) +
    (Number(speculativeIncome) || 0) +
    totalDividendIncome;

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
              <p className="text-2xl font-bold mb-4">₹{totalDividendIncome.toLocaleString("en-IN")}</p>
              <Link to="/dividends">
                <Button variant="outline">Manage Dividends <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
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