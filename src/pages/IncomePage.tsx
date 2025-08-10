import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

const dividendSources = ["dyad-pms-dividends", "dyad-broker1-dividends", "dyad-broker2-dividends"];
const bondIncomeSource = "dyad-bonds-income";
const fdIncomeSource = "dyad-fd-income";
const rentalIncomeSource = "dyad-rental-income";
const salaryIncomeSource = "dyad-salary-income";

const DEMAT_KEY = "dyad-demat-gains";
const MF_KEY = "dyad-mutual-fund-gains";

interface CapitalGainsItem {
  name: string;
  stcg: number | string;
  ltcg: number | string;
}

const IncomePage: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState(0);
  const [totalRentalIncome, setTotalRentalIncome] = useState(0);
  const [totalFdIncome, setTotalFdIncome] = useState(0);
  const [totalDividendIncome, setTotalDividendIncome] = useState(0);
  const [totalBondIncome, setTotalBondIncome] = useState(0);
  const [totalCapitalGainsTax, setTotalCapitalGainsTax] = useState(0);
  const [totalStcg, setTotalStcg] = useState(0);
  const [totalLtcg, setTotalLtcg] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      try {
        const savedSalary = localStorage.getItem(salaryIncomeSource);
        setSalaryIncome(savedSalary ? JSON.parse(savedSalary) : 0);
      } catch {}

      let dividendTotal = 0;
      dividendSources.forEach(key => {
        try {
          const savedData = localStorage.getItem(key);
          const items: { amount: number }[] = savedData ? JSON.parse(savedData) : [];
          dividendTotal += items.reduce((sum, item) => sum + (item.amount || 0), 0);
        } catch {}
      });
      setTotalDividendIncome(dividendTotal);

      let bondTotal = 0;
      try {
        const savedBondData = localStorage.getItem(bondIncomeSource);
        const items: { income: number }[] = savedBondData ? JSON.parse(savedBondData) : [];
        bondTotal = items.reduce((sum, item) => sum + (Number(item.income) || 0), 0);
      } catch {}
      setTotalBondIncome(bondTotal);

      let fdTotal = 0;
      try {
        const savedFdData = localStorage.getItem(fdIncomeSource);
        const items: { interest: number }[] = savedFdData ? JSON.parse(savedFdData) : [];
        fdTotal = items.reduce((sum, item) => sum + (Number(item.interest) || 0), 0);
      } catch {}
      setTotalFdIncome(fdTotal);

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

      const calculateGainsTotals = (key: string): { stcg: number; ltcg: number } => {
        try {
          const savedData = localStorage.getItem(key);
          const items: CapitalGainsItem[] = savedData ? JSON.parse(savedData) : [];
          const stcg = items.reduce((total, item) => total + (Number(item.stcg) || 0), 0);
          const ltcg = items.reduce((total, item) => total + (Number(item.ltcg) || 0), 0);
          return { stcg, ltcg };
        } catch {
          return { stcg: 0, ltcg: 0 };
        }
      };
      
      const dematTotals = calculateGainsTotals(DEMAT_KEY);
      const mfTotals = calculateGainsTotals(MF_KEY);

      const totalStcg = dematTotals.stcg + mfTotals.stcg;
      const totalLtcg = dematTotals.ltcg + mfTotals.ltcg;
      setTotalStcg(totalStcg);
      setTotalLtcg(totalLtcg);

      const ltcgExemption = 125000;
      const taxableLtcg = Math.max(0, totalLtcg - ltcgExemption);
      const ltcgTax = taxableLtcg * 0.125;
      const stcgTax = totalStcg * 0.20;
      const totalTax = ltcgTax + stcgTax;
      setTotalCapitalGainsTax(totalTax);
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

  const totalIncome =
    (Number(salaryIncome) || 0) +
    totalRentalIncome +
    totalFdIncome +
    totalDividendIncome +
    totalBondIncome;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Tax Dashboard
        </h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Overall Income Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                Total Income (excluding capital gains): ₹{totalIncome.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This is the total of your salary, rental, FD, bond, and dividend income.
                Manage these on the <Link to="/income-summary" className="underline">Income Summary</Link> page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Capital Gains Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Total Short-Term Gains (STCG):</span>
                  <span className="font-semibold">₹{totalStcg.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Long-Term Gains (LTCG):</span>
                  <span className="font-semibold">₹{totalLtcg.toLocaleString("en-IN")}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Tax Payable:</span>
                  <span>₹{totalCapitalGainsTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <Link to="/capital-gains">
                <Button variant="outline" className="w-full">View Detailed Breakdown <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default IncomePage;