import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Upload, PlusCircle, ArrowLeft } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { Link } from "react-router-dom";

interface Bond {
  name: string;
  isin: string;
  income: number | string;
}

const LOCAL_STORAGE_KEY = "dyad-bonds-income";

const BondsPage: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (error) {
      showError("Could not load saved bond data.");
    }
    return Array(5).fill({ name: "", isin: "", income: "" });
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bonds));
    window.dispatchEvent(new Event('storage')); // Notify dashboard
  }, [bonds]);

  const handleInputChange = (index: number, field: keyof Bond, value: string) => {
    const newBonds = [...bonds];
    newBonds[index] = { ...newBonds[index], [field]: value };
    setBonds(newBonds);
  };

  const addRow = () => {
    setBonds([...bonds, { name: "", isin: "", income: "" }]);
  };

  const totalIncome = bonds.reduce((total, bond) => total + (Number(bond.income) || 0), 0);

  const handleExport = () => {
    const dataStr = JSON.stringify({ bonds }, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "bonds-income.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showSuccess("Bond data exported successfully!");
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
        const isValid = (data: any) => Array.isArray(data) && data.every(item => "name" in item && "isin" in item && "income" in item);

        if (isValid(importedData.bonds)) {
          setBonds(importedData.bonds);
          showSuccess("Bond data imported successfully!");
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/income-tax-dashboard" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Bond Income
          </h1>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <Button variant="outline" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bonds Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.No</TableHead>
                    <TableHead>Bond Name</TableHead>
                    <TableHead>ISIN</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonds.map((bond, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={bond.name}
                          onChange={(e) => handleInputChange(index, "name", e.target.value)}
                          placeholder="e.g. NHAI 5.5% 2030"
                          className="min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={bond.isin}
                          onChange={(e) => handleInputChange(index, "isin", e.target.value)}
                          placeholder="e.g. INE906B07CB9"
                          className="min-w-[150px]"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={bond.income}
                          onChange={(e) => handleInputChange(index, "income", e.target.value)}
                          placeholder="Enter income"
                          className="text-right min-w-[120px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button onClick={addRow} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Row
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">Total Bond Income: ₹{totalIncome.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default BondsPage;