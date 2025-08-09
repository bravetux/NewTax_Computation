import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, ArrowLeft } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface Dividend {
  date: string;
  particulars: string;
  amount: number;
}

const sourceConfig = {
  pms: {
    title: "PMS Dividends",
    localStorageKey: "dyad-pms-dividends",
  },
  broker1: {
    title: "Broker 1 Dividends",
    localStorageKey: "dyad-broker1-dividends",
  },
  broker2: {
    title: "Broker 2 Dividends",
    localStorageKey: "dyad-broker2-dividends",
  },
};

const DividendManagementPage: React.FC = () => {
  const { source } = useParams<{ source: string }>();
  const config = useMemo(() => sourceConfig[source as keyof typeof sourceConfig] || sourceConfig.pms, [source]);

  const [dividends, setDividends] = useState<Dividend[]>(() => {
    try {
      const saved = localStorage.getItem(config.localStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      showError(`Could not load saved ${config.title} data.`);
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(config.localStorageKey, JSON.stringify(dividends));
    window.dispatchEvent(new Event('storage')); // Notify other components of the change
  }, [dividends, config.localStorageKey]);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const processData = (data: any[]) => {
      const getVal = (row: any, keys: string[]) => {
        const rowKey = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
        return rowKey ? row[rowKey] : undefined;
      };

      const parsedData = data
        .map((row: any) => {
          const date = getVal(row, ['date']);
          const particulars = getVal(row, ['particulars']);
          const amount = getVal(row, ['amount', 'credit']);

          let dateString = '';
          if (date instanceof Date) {
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            dateString = `${year}-${month}-${day}`;
          } else if (date) {
            dateString = String(date);
          }

          return {
            date: dateString,
            particulars: String(particulars || ""),
            amount: parseFloat(String(amount || '0').replace(/,/g, '')),
          };
        })
        .filter(item => item.date && item.particulars && !isNaN(item.amount));
      
      if (parsedData.length > 0) {
        setDividends(parsedData);
        showSuccess(`${parsedData.length} dividend records imported successfully!`);
      } else {
        showError("No valid dividend data found. Please ensure your file has columns named 'Date', 'Particulars', and 'Amount' (or 'Credit').");
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
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          processData(json);
        } catch (err) {
          console.error("File parsing error:", err);
          showError("Failed to parse the Excel file. It might be corrupted or in an unsupported format.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showError("Unsupported file type. Please use CSV or XLSX.");
    }
    event.target.value = "";
  };

  const totalDividends = dividends.reduce((sum, item) => sum + item.amount, 0);

  const DetailsCard = (
    <Card>
      <CardHeader>
        <CardTitle>Dividend Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Particulars</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dividends.length > 0 ? (
              dividends.map((div, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(div.date).toLocaleDateString()}</TableCell>
                  <TableCell>{div.particulars}</TableCell>
                  <TableCell className="text-right">₹{div.amount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No dividends imported yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const SummaryCard = (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">
          Total Dividends: ₹{totalDividends.toLocaleString("en-IN")}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dividends" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dividend Summary
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            {config.title}
          </h1>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Import Statement
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />
        </div>

        <div className="space-y-8">
          <>
            {SummaryCard}
            {DetailsCard}
          </>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default DividendManagementPage;