import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Upload, PlusCircle, ArrowLeft } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface FD {
  bankName: string;
  accountNo: string;
  interest: number | string;
}

const LOCAL_STORAGE_KEY = "dyad-fd-income";

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

    const processData = (data: any[]) => {
      const parsedData = data
        .map((row: any) => ({
          bankName: String(row.bankName || row['Bank Name'] || ''),
          accountNo: String(row.accountNo || row['Account No'] || row['Account/Receipt No.'] || ''),
          interest: row.interest || row.Interest || row['Interest Income'] || 0,
        }))
        .filter(item => item.bankName && !isNaN(parseFloat(String(item.interest))));
      
      if (parsedData.length > 0) {
        setFds(parsedData);
        showSuccess("FD data imported successfully!");
      } else {
        showError("No valid FD data found. Please check column names (e.g., bankName, accountNo, interest).");
      }
    };

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, { header: true, skipEmptyLines: true, complete: (result) => processData(result.data), error: () => showError("Failed to parse CSV.") });
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/income-tax-dashboard" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Income Summary
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            FD Interest Income
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
            <p className="text-xl font-semibold">Total FD Interest Income: ₹{totalInterest.toLocaleString("en-IN")}</p>
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