import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Download, Upload, Trash2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define all the local storage keys in one place
const LOCAL_STORAGE_KEYS = {
  dematGains: "dyad-demat-gains",
  mutualFundGains: "dyad-mutual-fund-gains",
  pmsDividends: "dyad-pms-dividends",
  broker1Dividends: "dyad-broker1-dividends",
  broker2Dividends: "dyad-broker2-dividends",
  bondsIncome: "dyad-bonds-income",
  fdIncome: "dyad-fd-income",
  rentalIncome: "dyad-rental-income",
  salaryIncome: "dyad-salary-income",
};

const ReportsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const allData = {
        dematAccounts: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.dematGains) || '[]'),
        mutualFunds: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.mutualFundGains) || '[]'),
        dividends: {
          pms: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.pmsDividends) || '[]'),
          broker1: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.broker1Dividends) || '[]'),
          broker2: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.broker2Dividends) || '[]'),
        },
        bonds: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.bondsIncome) || '[]'),
        fds: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.fdIncome) || '[]'),
        properties: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.rentalIncome) || '[]'),
        salaryIncome: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.salaryIncome) || '""'),
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = "tax-planner-data.json";
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      showSuccess("All data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      showError("An error occurred during export.");
    }
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
        if (typeof text !== "string") {
          showError("Could not read file content.");
          return;
        }
        
        const importedData = JSON.parse(text);

        const requiredKeys = ["dematAccounts", "mutualFunds", "dividends", "bonds", "fds", "properties", "salaryIncome"];
        const hasAllKeys = requiredKeys.every(key => key in importedData);
        const hasDividendKeys = importedData.dividends && "pms" in importedData.dividends && "broker1" in importedData.dividends && "broker2" in importedData.dividends;

        if (!hasAllKeys || !hasDividendKeys) {
          showError("Invalid or corrupted file format. Missing required data sections.");
          return;
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.dematGains, JSON.stringify(importedData.dematAccounts || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.mutualFundGains, JSON.stringify(importedData.mutualFunds || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.pmsDividends, JSON.stringify(importedData.dividends.pms || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.broker1Dividends, JSON.stringify(importedData.dividends.broker1 || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.broker2Dividends, JSON.stringify(importedData.dividends.broker2 || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.bondsIncome, JSON.stringify(importedData.bonds || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.fdIncome, JSON.stringify(importedData.fds || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.rentalIncome, JSON.stringify(importedData.properties || []));
        localStorage.setItem(LOCAL_STORAGE_KEYS.salaryIncome, JSON.stringify(importedData.salaryIncome || ""));

        window.dispatchEvent(new Event('storage'));

        showSuccess("All data imported successfully! The app will now reflect the new data.");

      } catch (error) {
        console.error("Import failed:", error);
        showError("Failed to parse file. Please ensure it's a valid JSON backup file.");
      } finally {
        if (event.target) {
          event.target.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    try {
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      window.dispatchEvent(new Event('storage'));
      showSuccess("All application data has been cleared.");
    } catch (error) {
      console.error("Failed to clear data:", error);
      showError("An error occurred while clearing data.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Reports & Data Management
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Import & Export All Application Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can export all your entered data into a single JSON file as a backup.
              This file can be imported later to restore your data on this or another device.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" /> Import Data
              </Button>
              <Button variant="default" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export Data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all
                      your saved income, capital gains, and dividend data from this browser.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData}>
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default ReportsPage;