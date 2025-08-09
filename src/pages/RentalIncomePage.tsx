import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowLeft } from "lucide-react";
import { showError } from "@/utils/toast";
import IncomeField from "@/components/IncomeField";

interface Property {
  monthlyRent: number | string;
  monthsRented: number | string;
  propertyTax: number | string;
  interestOnLoan: number | string;
}

const LOCAL_STORAGE_KEY = "dyad-rental-income";

const RentalIncomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (error) {
      showError("Could not load saved rental data.");
    }
    return Array(5).fill({ monthlyRent: "", monthsRented: "", propertyTax: "", interestOnLoan: "" });
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
    window.dispatchEvent(new Event('storage')); // Notify dashboard
  }, [properties]);

  const handleInputChange = (index: number, field: keyof Property, value: string) => {
    const newProperties = [...properties];
    newProperties[index] = { ...newProperties[index], [field]: value };
    setProperties(newProperties);
  };

  const calculatePropertyIncome = (property: Property) => {
    const gav = (Number(property.monthlyRent) || 0) * (Number(property.monthsRented) || 0);
    const propertyTax = Number(property.propertyTax) || 0;
    const nav = gav - propertyTax;
    const standardDeduction = nav > 0 ? nav * 0.3 : 0;
    const interestOnLoan = Number(property.interestOnLoan) || 0;
    const taxableIncome = nav - standardDeduction - interestOnLoan;
    return { gav, nav, standardDeduction, interestOnLoan, taxableIncome };
  };

  const totals = properties.reduce(
    (acc, prop) => {
      const { gav, nav, standardDeduction, interestOnLoan, taxableIncome } = calculatePropertyIncome(prop);
      const propertyTax = Number(prop.propertyTax) || 0;
      acc.totalGrossRentalIncome += gav;
      acc.totalPropertyTax += propertyTax;
      acc.totalNetAnnualValue += nav;
      acc.totalStandardDeduction += standardDeduction;
      acc.totalInterestOnLoan += interestOnLoan;
      acc.totalNetIncome += taxableIncome;
      return acc;
    },
    {
      totalGrossRentalIncome: 0,
      totalPropertyTax: 0,
      totalNetAnnualValue: 0,
      totalStandardDeduction: 0,
      totalInterestOnLoan: 0,
      totalNetIncome: 0,
    }
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/income-tax-dashboard" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Rental Property Income
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property, index) => {
            const { gav, nav, standardDeduction, taxableIncome } = calculatePropertyIncome(property);
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Property {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <IncomeField label="Monthly Rent" id={`monthly-rent-${index}`} value={property.monthlyRent} onChange={(e) => handleInputChange(index, "monthlyRent", e.target.value)} placeholder="e.g. 10000" />
                  <IncomeField label="No. of Months Rented" id={`months-rented-${index}`} value={property.monthsRented} onChange={(e) => handleInputChange(index, "monthsRented", e.target.value)} placeholder="e.g. 10" max="12" />
                  <IncomeField label="Property Tax Paid" id={`property-tax-${index}`} value={property.propertyTax} onChange={(e) => handleInputChange(index, "propertyTax", e.target.value)} placeholder="e.g. 5000" />
                  <IncomeField label="Interest on Housing Loan" id={`interest-loan-${index}`} value={property.interestOnLoan} onChange={(e) => handleInputChange(index, "interestOnLoan", e.target.value)} placeholder="e.g. 0" />
                  
                  <div className="pt-2 space-y-1 text-sm">
                    <div className="flex justify-between"><span>Gross Annual Value (GAV):</span> <span>₹{gav.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span>Net Annual Value (NAV):</span> <span>₹{nav.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span>Standard Deduction (30%):</span> <span>₹{standardDeduction.toLocaleString("en-IN")}</span></div>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-between font-bold"><span>Taxable Income:</span> <span>₹{taxableIncome.toLocaleString("en-IN")}</span></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader><CardTitle>Overall Rental Income Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between"><span>Total Gross Rental Income:</span> <span className="font-semibold">₹{totals.totalGrossRentalIncome.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span>Less: Total Property Tax Paid:</span> <span className="font-semibold">₹{totals.totalPropertyTax.toLocaleString("en-IN")}</span></div>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between"><span>Total Net Annual Value:</span> <span className="font-semibold">₹{totals.totalNetAnnualValue.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Less: Total 30% Standard Deduction:</span> <span className="font-semibold">₹{totals.totalStandardDeduction.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Less: Total Interest on Housing Loan:</span> <span className="font-semibold">₹{totals.totalInterestOnLoan.toLocaleString("en-IN")}</span></div>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between text-lg"><p className="font-bold">Total Net Income from House Property:</p><p className="font-bold">₹{totals.totalNetIncome.toLocaleString("en-IN")}</p></div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default RentalIncomePage;