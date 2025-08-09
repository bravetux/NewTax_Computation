import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IncomeField from "@/components/IncomeField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

const bondIncomeSource = "dyad-bonds-income";
const fdIncomeSource = "dyad-fd-income";
const rentalIncomeSource = "dyad-rental-income";
const salaryIncomeSource = "dyad-salary-income";
const dividendSources = ["dyad-pms-dividends", "dyad-broker1-dividends", "dyad-broker2-dividends"];

const IncomeSummaryPage: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | string>(() => {
    try {
      const saved = localStorage.getItem(salaryIncomeSource);
      return saved ? JSON.parse(saved) : "";
    } catch {
      return "";
    }
  });
  const [totalRentalIncome, setTotalRentalIncome] = useState(0);
  const [totalFdIncome, setTotalFdIncome] = useState(0);
  const [totalBondIncome, setTotalBondIncome] = useState(0);
  const [totalDividendIncome, setTotalDividendIncome] = useState(0);

  useEffect(() => {
    localStorage.setItem(salaryIncomeSource, JSON.stringify(salaryIncome));
  }, [salaryIncome]);

  useEffect(() => {
    const calculateTotals = () => {
      // Bond Income
      let bondTotal = 0;
      try {
        const savedBondData = localStorage.getItem(bondIncomeSource);
        const items: { income: number }[] = savedBondData ? JSON.parse(savedBondData) : [];
        bondTotal = items.reduce((sum, item) => sum + (Number(item.income) || 0), 0);
      } catch {}
      setTotalBondIncome(bondTotal);

      // FD Income
      let fdTotal = 0;
      try {
        const savedFdData = localStorage.getItem(fdIncomeSource);
        const items: { interest: number }[] = savedFdData ? JSON.parse(savedFdData) : [];
        fdTotal = items.reduce((sum, item) => sum + (Number(item.interest) || 0), 0);
      } catch {}
      setTotalFdIncome(fdTotal);

      // Rental Income
      let rentalTotal = 0;
      try {
        const savedRentalData = localStorage.getItem(rentalIncomeSource);
        const properties: { monthlyRent: number | string; monthsRented: number | string; propertyTax: number | string; }[] = savedRentalData ? JSON.parse(savedRentalData) : [];
        
        const totalNetIncome = properties.reduce((total, prop) => {
            const gav = (Number(prop.monthlyRent) || 0) * (Number(prop.monthsRented) || 0);
            const propertyTax = Number(prop.propertyTax) || 0;
            const nav = gav - propertyTax;
            const standardDeduction = nav > 0 ? nav * 0.3 : 0;
            const taxableIncome = nav - standardDeduction;
            return total + taxableIncome;
        }, 0);
        rentalTotal = totalNetIncome;

      } catch {}
      setTotalRentalIncome(rentalTotal);

      // Dividend Income
      let dividendTotal = 0;
      dividendSources.forEach(key => {
        try {
          const savedData = localStorage.getItem(key);
          const items: { amount: number }[] = savedData ? JSON.parse(savedData) : [];
          dividendTotal += items.reduce((sum, item) => sum + (item.amount || 0), 0);
        } catch {}
      });
      setTotalDividendIncome(dividendTotal);
    };

    calculateTotals();

    const handleStorageChange = () => calculateTotals();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const grossIncome =
    (Number(salaryIncome) || 0) +
    totalRentalIncome +
    totalFdIncome +
    totalBondIncome +
    totalDividendIncome;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Income Summary
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gross Income Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Total Gross Income: ₹{grossIncome.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card id="salary-income">
            <CardHeader><CardTitle>Salary Income</CardTitle></CardHeader>
            <CardContent>
              <IncomeField label="Gross Salary" id="salaryIncome" value={salaryIncome} onChange={(e) => setSalaryIncome(e.target.value)} placeholder="Enter salary income" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Rental Property Income</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₹{totalRentalIncome.toLocaleString("en-IN")}</p>
              <Link to="/rental-income">
                <Button variant="outline">Manage Properties <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>FD Interest Income</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₹{totalFdIncome.toLocaleString("en-IN")}</p>
              <Link to="/fd-income">
                <Button variant="outline">Manage FDs <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Bonds Interest Income</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₹{totalBondIncome.toLocaleString("en-IN")}</p>
              <Link to="/bonds">
                <Button variant="outline">Manage Bonds <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Dividend Income</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₹{totalDividendIncome.toLocaleString("en-IN")}</p>
              <Link to="/dividends">
                <Button variant="outline">Manage Dividends <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default IncomeSummaryPage;