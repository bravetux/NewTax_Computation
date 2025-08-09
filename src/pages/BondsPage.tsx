import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Upload, PlusCircle, ArrowLeft, Gift } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Bond {
  name: string;
  isin: string;
  income: number | string;
}

const LOCAL_STORAGE_KEY = "dyad-bonds-income";
const GIFTING_RECIPIENTS_KEY = "dyad-gifting-recipients-data";
const RECIPIENT_OPTIONS = {
  spouse: "Spouse",
  mother: "Mother",
  father: "Father",
  kid1: "Kid 1",
  kid2: "Kid 2",
};

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

  const [selectedRecipient, setSelectedRecipient] = useState<keyof typeof RECIPIENT_OPTIONS | "">("");
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

    const processData = (data: any[]) => {
      const parsedData = data
        .map((row: any) => ({
          name: String(row.name || row.Name || row['Bond Name'] || ''),
          isin: String(row.isin || row.ISIN || ''),
          income: row.income || row.Income || 0,
        }))
        .filter(item => item.name && item.isin && !isNaN(parseFloat(String(item.income))));
      
      if (parsedData.length > 0) {
        setBonds(parsedData);
        showSuccess("Bond data imported successfully!");
      } else {
        showError("No valid bond data found. Please check column names (e.g., name, isin, income).");
      }
    };

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => processData(result.data),
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
          processData(json);
        } catch (err) {
          showError("Failed to parse Excel file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showError("Unsupported file type. Please use CSV or XLSX.");
    }
    event.target.value = "";
  };

  const handleGiftInterest = () => {
    if (!selectedRecipient) {
      showError("Please select a recipient to gift the income to.");
      return;
    }

    try {
      const giftingDataRaw = localStorage.getItem(GIFTING_RECIPIENTS_KEY);
      const giftingData = giftingDataRaw ? JSON.parse(giftingDataRaw) : {};

      if (!giftingData[selectedRecipient]) {
        giftingData[selectedRecipient] = { bondIncome: 0 };
      }

      giftingData[selectedRecipient].bondIncome = totalIncome;

      localStorage.setItem(GIFTING_RECIPIENTS_KEY, JSON.stringify(giftingData));
      window.dispatchEvent(new Event('storage'));

      showSuccess(`Bond Interest of ₹${totalIncome.toLocaleString('en-IN')} assigned to ${RECIPIENT_OPTIONS[selectedRecipient]}. View on the Gifting page.`);

      const resetBonds = bonds.map(bond => ({ ...bond, income: "" }));
      setBonds(resetBonds);
      setSelectedRecipient("");

    } catch (error) {
      showError("An error occurred while assigning the income.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/tax-dashboard" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tax Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Bonds Interest Income
          </h1>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="hidden" />
            <Button variant="outline" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">Total Bonds Interest Income: ₹{totalIncome.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Gift This Income</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Action to be taken is Gift the entire the Principal Capital to the Family Member, so that future income is Zero.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Select onValueChange={(value) => setSelectedRecipient(value as keyof typeof RECIPIENT_OPTIONS)} value={selectedRecipient}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select a Recipient" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RECIPIENT_OPTIONS).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGiftInterest} disabled={!selectedRecipient || totalIncome <= 0}>
                <Gift className="mr-2 h-4 w-4" /> Assign to Recipient
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bonds Interest Income Details</CardTitle>
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
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default BondsPage;