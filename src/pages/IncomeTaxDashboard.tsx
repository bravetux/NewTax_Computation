import React, { useState } from "react";
import IncomeField from "@/components/IncomeField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";

const IncomeTaxDashboard: React.FC = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | string>("");
  const [rentalIncome, setRentalIncome] = useState<number | string>("");
  const [fdIncome, setFdIncome] = useState<number | string>("");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          India Income Tax Planning Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Salary Income</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeField
                label="Gross Salary"
                id="salaryIncome"
                value={salaryIncome}
                onChange={(e) => setSalaryIncome(e.target.value)}
                placeholder="Enter salary income"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental Property Income</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeField
                label="Annual Rent Received"
                id="rentalIncome"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(e.target.value)}
                placeholder="Enter rental income"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FD Income</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeField
                label="Interest from Fixed Deposits"
                id="fdIncome"
                value={fdIncome}
                onChange={(e) => setFdIncome(e.target.value)}
                placeholder="Enter FD interest"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Income Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Total Income (so far): ₹
              {(
                (Number(salaryIncome) || 0) +
                (Number(rentalIncome) || 0) +
                (Number(fdIncome) || 0)
              ).toLocaleString("en-IN")}
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