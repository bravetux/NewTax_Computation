import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Upload, PlusCircle, ArrowLeft, Gift } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { Link } from "react-router-dom";
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

    if (!file.name.endsWith(".json")) {
      showError("Unsupported file type. Please use a .json file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          showError("Could not read file content.");
          return;
        }
        
        const importedData = JSON.parse(text);
        const isValid = (data: any) => Array.isArray(data) && data.every(item => "name" in item && "isin" in item && "income" in item);

        if (importedData.bonds && isValid(importedData.bonds)) {
          setBonds(importedData.bonds);
          showSuccess("Bond data imported successfully!");
        } else {
          showError("Invalid or empty JSON file format. Expected a 'bonds' array.");
        }
      } catch (error) {
        showError("Failed to parse JSON file.");
      } finally {
        if (event.target) {
          event.target.value = "";
        }
      }
    };
    reader.readAsText(file);
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
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