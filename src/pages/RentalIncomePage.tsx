import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowLeft, Upload, Download, Info } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import IncomeField from "@/components/IncomeField";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Property {
  monthlyRent: number | string;
  monthsRented: number | string;
  propertyTax: number | string;
  isSelfOccupied: boolean;
}

const LOCAL_STORAGE_KEY = "dyad-rental-income";

const RentalIncomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({ ...p, isSelfOccupied: p.isSelfOccupied || false }));
        }
      }
    } catch (error) {
      showError("Could not load saved rental data.");
    }
    return Array(5).fill({ monthlyRent: "", monthsRented: "", propertyTax: "", isSelfOccupied: false });
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
    window.dispatchEvent(new Event('storage'));
  }, [properties]);

  const handleInputChange = (index: number, field: keyof Omit<Property, 'isSelfOccupied'>, value: string) => {
    const newProperties = [...properties];
    newProperties[index] = { ...newProperties[index], [field]: value };
    setProperties(newProperties);
  };

  const handleSelfOccupiedToggle = (index: number, checked: boolean) => {
    const newProperties = [...properties];
    
    if (checked) {
      const selfOccupiedCount = newProperties.filter(p => p.isSelfOccupied).length;
      if (selfOccupiedCount >= 2) {
        showError("You can only mark a maximum of two properties as self-occupied.");
        return;
      }
    }
    
    newProperties[index].isSelfOccupied = checked;
    
    if (checked) {
      newProperties[index].monthlyRent = "";
      newProperties[index].monthsRented = "";
      newProperties[index].propertyTax = "";
    }

    setProperties(newProperties);
  };

  const calculatePropertyIncome = (property: Property) => {
    if (property.isSelfOccupied) {
      return { gav: 0, nav: 0, standardDeduction: 0, taxableIncome: 0 };
    }
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

    const processSheetData = (data: any[]) => {
      const parsedData = data
        .map((row: any) => ({
          monthlyRent: row.monthlyRent || row['Monthly Rent'] || "",
          monthsRented: row.monthsRented || row['Months Rented'] || "",
          propertyTax: row.propertyTax || row['Property Tax'] || "",
          isSelfOccupied: row.isSelfOccupied || false,
        }))
        .filter(item => item.monthlyRent !== "" || item.monthsRented !== "" || item.isSelfOccupied);
      
      if (parsedData.length > 0) {
        setProperties(parsedData);
        showSuccess("Rental data imported successfully!");
      } else {
        showError("No valid rental data found. Please check column names (e.g., monthlyRent, monthsRented, propertyTax, isSelfOccupied).");
      }
    };

    if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text !== "string") return;
          
          const importedData = JSON.parse(text);
          const isValid = (data: any) => Array.isArray(data) && data.every(item => "monthlyRent" in item && "monthsRented" in item && "propertyTax" in item);

          if (isValid(importedData.properties)) {
            const validatedProperties = importedData.properties.map((p: any) => ({...p, isSelfOccupied: p.isSelfOccupied || false}));
            setProperties(validatedProperties);
            showSuccess("Rental data imported successfully!");
          } else {
            showError("Invalid or empty JSON file format. Expected a 'properties' array.");
          }
        } catch (error) {
          showError("Failed to parse JSON file.");
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => processSheetData(result.data),
        error: () => showError("Failed to parse CSV."),
      });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          processSheetData(json);
        } catch (err) {
          showError("Failed to parse Excel file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showError("Unsupported file type. Please use JSON, CSV, or XLSX.");
    }
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
      <div className="max-w-screen-2xl mx-auto">
        <Link to="/tax-dashboard" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tax Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Rental Property Income
          </h1>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json, .csv, .xlsx, .xls" className="hidden" />
            <Button variant="outline" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <Alert className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">Budget 2025 Simplification</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Now, if you own two houses and live in both (or can’t occupy one for valid reasons like job relocation), both can be considered self-occupied, with zero income declared from either.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
          {properties.map((property, index) => {
            const { gav, nav, standardDeduction, taxableIncome } = calculatePropertyIncome(property);
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Property {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id={`self-occupied-${index}`} checked={property.isSelfOccupied} onCheckedChange={(checked) => handleSelfOccupiedToggle(index, checked)} />
                    <Label htmlFor={`self-occupied-${index}`}>Self-Occupied Property</Label>
                  </div>
                  <Separator />
                  <IncomeField label="Monthly Rent" id={`monthly-rent-${index}`} value={property.monthlyRent} onChange={(e) => handleInputChange(index, "monthlyRent", e.target.value)} placeholder="e.g. 10000" disabled={property.isSelfOccupied} />
                  <IncomeField label="No. of Months Rented" id={`months-rented-${index}`} value={property.monthsRented} onChange={(e) => handleInputChange(index, "monthsRented", e.target.value)} placeholder="e.g. 10" max="12" disabled={property.isSelfOccupied} />
                  <IncomeField label="Property Tax Paid" id={`property-tax-${index}`} value={property.propertyTax} onChange={(e) => handleInputChange(index, "propertyTax", e.target.value)} placeholder="e.g. 5000" disabled={property.isSelfOccupied} />
                  
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
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default RentalIncomePage;