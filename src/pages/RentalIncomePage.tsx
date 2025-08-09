import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowLeft, Download, Upload, Edit, Save } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import IncomeField from "@/components/IncomeField";

interface Property {
  name: string;
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
    return Array(5).fill(0).map((_, i) => ({
      name: `Property ${i + 1}`,
      monthlyRent: "",
      monthsRented: "",
      propertyTax: "",
    }));
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
    window.dispatchEvent(new Event('storage')); // Notify dashboard
  }, [properties]);

  const handleInputChange = (index: number, field: keyof Omit<Property, 'name'>, value: string) => {
    const newProperties = [...properties];
    newProperties[index] = { ...newProperties[index], [field]: value };
    setProperties(newProperties);
  };

  const handleNameChange = (index: number, value: string) => {
    const newProperties = [...properties];
    newProperties[index].name = value;
    setProperties(newProperties);
  };

  const calculatePropertyIncome = (property: Property) => {
    const gav = (Number(property.monthlyRent) || 0) * (Number(property.monthsRented) || 0);
    const propertyTax = Number(property.propertyTax) || 0;
    const nav = gav - propertyTax;
    const standardDeduction = nav > 0 ? nav * 0.3 : 0;
    const taxableIncome = nav - standardDeduction;
    return { gav, nav, standardDeduction, taxableIncome };
  };

  const handleExport = () => {
    const dataToExport = { properties };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "rental-income.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showSuccess("Rental data exported successfully!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") return;
        
        const importedData = JSON.parse(text);
        const isValid = (data: any) => Array.isArray(data) && data.every(item => "name" in item && "monthlyRent" in item && "monthsRented" in item && "propertyTax" in item);

        if (isValid(importedData.properties)) {
          setProperties(importedData.properties);
          showSuccess("Rental data imported successfully!");
        } else {
          showError("Invalid or empty file format.");
        }
      } catch (error) {
        showError("Failed to parse file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const totals = properties.reduce(
    (acc, prop) => {
      const { gav, nav, standardDeduction, taxableIncome } = calculatePropertyIncome(prop);
      const propertyTax = Number(prop.propertyTax) || 0;
      acc.totalGrossRentalIncome += gav;
      acc.totalPropertyTax += propertyTax;
      acc.totalNetAnnualValue += nav;
      acc.totalStandardDeduction += standardDeduction;
      acc.totalNetIncome += taxableIncome;
      return acc;
    },
    {
      totalGrossRentalIncome: 0,
      totalPropertyTax: 0,
      totalNetAnnualValue: 0,
      totalStandardDeduction: 0,
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
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <Button variant="outline" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <><Save className="mr-2 h-4 w-4" /> Save Names</> : <><Edit className="mr-2 h-4 w-4" /> Edit Names</>}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property, index) => {
            const { gav, nav, standardDeduction, taxableIncome } = calculatePropertyIncome(property);
            return (
              <Card key={index}>
                <CardHeader>
                  {isEditing ? (
                    <Input
                      value={property.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Enter Property Name"
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <CardTitle>{property.name}</CardTitle>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <IncomeField label="Monthly Rent" id={`monthly-rent-${index}`} value={property.monthlyRent} onChange={(e) => handleInputChange(index, "monthlyRent", e.target.value)} placeholder="e.g. 10000" />
                  <IncomeField label="No. of Months Rented" id={`months-rented-${index}`} value={property.monthsRented} onChange={(e) => handleInputChange(index, "monthsRented", e.target.value)} placeholder="e.g. 10" max="12" />
                  <IncomeField label="Property Tax Paid" id={`property-tax-${index}`} value={property.propertyTax} onChange={(e) => handleInputChange(index, "propertyTax", e.target.value)} placeholder="e.g. 5000" />
                  
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