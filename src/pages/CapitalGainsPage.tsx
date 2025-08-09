import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Save } from "lucide-react";
import CapitalGainsCard from "@/components/CapitalGainsCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";

interface CapitalGainsItem {
  name: string;
  stcg: number | string;
  ltcg: number | string;
}

const CapitalGainsPage: React.FC = () => {
  const [dematAccounts, setDematAccounts] = useState<CapitalGainsItem[]>(
    Array(5)
      .fill(0)
      .map((_, i) => ({
        name: `Demat Account ${i + 1}`,
        stcg: "",
        ltcg: "",
      }))
  );
  const [mutualFunds, setMutualFunds] = useState<CapitalGainsItem[]>(
    Array(10)
      .fill(0)
      .map((_, i) => ({
        name: `Mutual Fund ${i + 1}`,
        stcg: "",
        ltcg: "",
      }))
  );
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createChangeHandler = (
    setter: React.Dispatch<React.SetStateAction<CapitalGainsItem[]>>
  ) => (index: number, field: "stcg" | "ltcg", value: string) => {
    setter((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const createNameChangeHandler = (
    setter: React.Dispatch<React.SetStateAction<CapitalGainsItem[]>>
  ) => (index: number, value: string) => {
    setter((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].name = value;
      return newItems;
    });
  };

  const handleDematChange = createChangeHandler(setDematAccounts);
  const handleDematNameChange = createNameChangeHandler(setDematAccounts);
  const handleMutualFundChange = createChangeHandler(setMutualFunds);
  const handleMutualFundNameChange = createNameChangeHandler(setMutualFunds);

  const calculateTotalGains = (items: CapitalGainsItem[]) =>
    items.reduce((total, item) => total + (Number(item.stcg) || 0) + (Number(item.ltcg) || 0), 0);

  const totalDematGains = calculateTotalGains(dematAccounts);
  const totalMutualFundGains = calculateTotalGains(mutualFunds);
  const totalCapitalGains = totalDematGains + totalMutualFundGains;

  const handleExport = () => {
    const dataToExport = { dematAccounts, mutualFunds };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "capital-gains.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showSuccess("Data exported successfully!");
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
        let importedSomething = false;

        const isValid = (data: any) => Array.isArray(data) && data.every(item => "name" in item && "stcg" in item && "ltcg" in item);

        if (isValid(importedData.dematAccounts)) {
          setDematAccounts(importedData.dematAccounts);
          importedSomething = true;
        }
        if (isValid(importedData.mutualFunds)) {
          setMutualFunds(importedData.mutualFunds);
          importedSomething = true;
        }

        if (importedSomething) {
          showSuccess("Data imported successfully!");
        } else {
          showError("Invalid or empty file format.");
        }
      } catch (error) {
        showError("Failed to parse file.");
        console.error("Import Error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Capital Gains
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

        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-50">Demat Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dematAccounts.map((account, index) => (
              <CapitalGainsCard
                key={`demat-${index}`}
                title={account.name}
                stcg={account.stcg}
                ltcg={account.ltcg}
                onStcgChange={(e) => handleDematChange(index, "stcg", e.target.value)}
                onLtcgChange={(e) => handleDematChange(index, "ltcg", e.target.value)}
                isEditing={isEditing}
                onTitleChange={(e) => handleDematNameChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-50">Mutual Funds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mutualFunds.map((fund, index) => (
              <CapitalGainsCard
                key={`mf-${index}`}
                title={fund.name}
                stcg={fund.stcg}
                ltcg={fund.ltcg}
                onStcgChange={(e) => handleMutualFundChange(index, "stcg", e.target.value)}
                onLtcgChange={(e) => handleMutualFundChange(index, "ltcg", e.target.value)}
                isEditing={isEditing}
                onTitleChange={(e) => handleMutualFundNameChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader><CardTitle>Capital Gains Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg">Total from Demat Accounts: ₹{totalDematGains.toLocaleString("en-IN")}</p>
            <p className="text-lg">Total from Mutual Funds: ₹{totalMutualFundGains.toLocaleString("en-IN")}</p>
            <p className="text-xl font-semibold mt-2">Total Capital Gains: ₹{totalCapitalGains.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default CapitalGainsPage;