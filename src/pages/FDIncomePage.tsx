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

interface FD {
  bankName: string;
  accountNo: string;
  interest: number | string;
}

const LOCAL_STORAGE_KEY = "dyad-fd-income";
const GIFTING_RECIPIENTS_KEY = "dyad-gifting-recipients-data";
const RECIPIENT_OPTIONS = {
  spouse: "Spouse",
  mother: "Mother",
  father: "Father",
  kid1: "Kid 1",
  kid2: "Kid 2",
};

const FDIncomePage: React.FC = () => {
  const [fds, setFds] = useState<FD[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (error) {
      showError("Could not load saved FD data.");
    }
    return Array(5).fill({ bankName: "", accountNo: "", interest: "" });
  });

  const [selectedRecipient, setSelectedRecipient] = useState<keyof typeof RECIPIENT_OPTIONS | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fds));
    window.dispatchEvent(new Event('storage')); // Notify dashboard
  }, [fds]);

  const handleInputChange = (index: number, field: keyof FD, value: string) => {
    const newFds = [...fds];
    newFds[index] = { ...newFds[index], [field]: value };
    setFds(newFds);
  };

  const addRow = () => {
    setFds([...fds, { bankName: "", accountNo: "", interest: "" }]);
  };

  const totalInterest = fds.reduce((total, fd) => total + (Number(fd.interest) || 0), 0);

  const handleExport = () => {
    const dataStr = JSON.stringify({ fds }, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "fd-income.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showSuccess("FD data exported successfully!");
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
        if (typeof text !== "string") return;
        
        const importedData = JSON.parse(text);
        const isValid = (data: any) => Array.isArray(data) && data.every(item => "bankName" in item && "accountNo" in item && "interest" in item);

        if (importedData.fds && isValid(importedData.fds)) {
          setFds(importedData.fds);
          showSuccess("FD data imported successfully!");
        } else {
          showError("Invalid or empty JSON file format. Expected a 'fds' array.");
        }
      } catch (error) {
        showError("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
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
        giftingData[selectedRecipient] = {};
      }

      const currentTotalInterest = fds.reduce((total, fd) => total + (Number(fd.interest) || 0), 0);
      giftingData[selectedRecipient].fdIncome = (Number(giftingData[selectedRecipient].fdIncome) || 0) + currentTotalInterest;

      localStorage.setItem(GIFTING_RECIPIENTS_KEY, JSON.stringify(giftingData));
      window.dispatchEvent(new Event('storage'));

      showSuccess(`FD Interest of ₹${currentTotalInterest.toLocaleString('en-IN')} assigned to ${RECIPIENT_OPTIONS[selectedRecipient]}. View on the Gifting page.`);
      
      const resetFds = fds.map(fd => ({ ...fd, interest: "" }));
      setFds(resetFds);
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
            FD Interest Income
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
            <p className="text-xl font-semibold">Total FD Interest Income: ₹{totalInterest.toLocaleString("en-IN")}</p>
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
              <Button onClick={handleGiftInterest} disabled={!selectedRecipient || totalInterest <= 0}>
                <Gift className="mr-2 h-4 w-4" /> Assign to Recipient
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>FD Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.No</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account/Receipt No.</TableHead>
                    <TableHead className="text-right">Interest Income</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fds.map((fd, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input value={fd.bankName} onChange={(e) => handleInputChange(index, "bankName", e.target.value)} placeholder="e.g. HDFC Bank" className="min-w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={fd.accountNo} onChange={(e) => handleInputChange(index, "accountNo", e.target.value)} placeholder="Enter account or receipt no." className="min-w-[150px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input type="number" value={fd.interest} onChange={(e) => handleInputChange(index, "interest", e.target.value)} placeholder="Enter interest" className="text-right min-w-[120px]" />
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

export default FDIncomePage;