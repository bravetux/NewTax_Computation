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
    return Array(5).fill({ monthlyRent: "", monthsRented: "", propertyTax: "" });
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

  const calculateTotalRent = (property: Property) => {
    return (Number(property.monthlyRent) || 0) * (Number(property.monthsRented) || 0);
  };

  const totalGrossRentalIncome = properties.reduce((total, prop) => total + calculateTotalRent(prop), 0);
  const totalPropertyTax = properties.reduce((total, prop) => total + (Number(prop.propertyTax) || 0), 0);
  const netAnnualValue = totalGrossRentalIncome - totalPropertyTax;
  const standardDeduction = netAnnualValue > 0 ? netAnnualValue * 0.3 : 0;
  const netIncomeFromHouseProperty = netAnnualValue - standardDeduction;

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
          {properties.map((property, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Property {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <IncomeField
                  label="Monthly Rent"
                  id={`monthly-rent-${index}`}
                  value={property.monthlyRent}
                  onChange={(e) => handleInputChange(index, "monthlyRent", e.target.value)}
                  placeholder="e.g. 25000"
                />
                <IncomeField
                  label="No. of Months Rented"
                  id={`months-rented-${index}`}
                  value={property.monthsRented}
                  onChange={(e) => handleInputChange(index, "monthsRented", e.target.value)}
                  placeholder="e.g. 12"
                  max="12"
                />
                <IncomeField
                  label="Property Tax Paid"
                  id={`property-tax-${index}`}
                  value={property.propertyTax}
                  onChange={(e) => handleInputChange(index, "propertyTax", e.target.value)}
                  placeholder="e.g. 5000"
                />
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Rental Income (Gross)</p>
                  <p className="text-lg font-semibold">₹{calculateTotalRent(property).toLocaleString("en-IN")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Rental Income Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <p>Total Gross Rental Income:</p>
              <p className="font-semibold">₹{totalGrossRentalIncome.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex justify-between">
              <p>Less: Property Tax Paid:</p>
              <p className="font-semibold">₹{totalPropertyTax.toLocaleString("en-IN")}</p>
            </div>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between">
              <p>Net Annual Value:</p>
              <p className="font-semibold">₹{netAnnualValue.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <p>Less: 30% Standard Deduction:</p>
              <p className="font-semibold">₹{standardDeduction.toLocaleString("en-IN")}</p>
            </div>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between text-lg">
              <p className="font-bold">Net Income from House Property:</p>
              <p className="font-bold">₹{netIncomeFromHouseProperty.toLocaleString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default RentalIncomePage;