import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Save } from "lucide-react";
import CapitalGainsCard from "@/components/CapitalGainsCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";

interface DematAccount {
  name: string;
  stcg: number | string;
  ltcg: number | string;
}

const CapitalGainsPage: React.FC = () => {
  const [dematAccounts, setDematAccounts] = useState<DematAccount[]>(
    Array(5)
      .fill(0)
      .map((_, i) => ({
        name: `Demat Account ${i + 1}`,
        stcg: "",
        ltcg: "",
      }))
  );
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDematChange = (
    index: number,
    field: "stcg" | "ltcg",
    value: string
  ) => {
    const newAccounts = [...dematAccounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setDematAccounts(newAccounts);
  };

  const handleNameChange = (index: number, value: string) => {
    const newAccounts = [...dematAccounts];
    newAccounts[index].name = value;
    setDematAccounts(newAccounts);
  };

  const totalDematGains = dematAccounts.reduce((total, account) => {
    return total + (Number(account.stcg) || 0) + (Number(account.ltcg) || 0);
  }, 0);

  const handleExport = () => {
    const dataStr = JSON.stringify(dematAccounts, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "demat-gains.json";
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
        if (typeof text === "string") {
          const importedData = JSON.parse(text);
          if (
            Array.isArray(importedData) &&
            importedData.every((item) => "name" in item && "stcg" in item && "ltcg" in item)
          ) {
            setDematAccounts(importedData);
            showSuccess("Data imported successfully!");
          } else {
            showError("Invalid file format.");
          }
        }
      } catch (error) {
        showError("Failed to parse file.");
        console.error("Import Error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset file input
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Capital Gains
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? (
                <><Save className="mr-2 h-4 w-4" /> Save Names</>
              ) : (
                <><Edit className="mr-2 h-4 w-4" /> Edit Names</>
              )}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-50">
            Demat Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dematAccounts.map((account, index) => (
              <CapitalGainsCard
                key={index}
                title={account.name}
                stcg={account.stcg}
                ltcg={account.ltcg}
                onStcgChange={(e) => handleDematChange(index, "stcg", e.target.value)}
                onLtcgChange={(e) => handleDematChange(index, "ltcg", e.target.value)}
                isEditing={isEditing}
                onTitleChange={(e) => handleNameChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Capital Gains Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Total Capital Gains (Demat): ₹{totalDematGains.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default CapitalGainsPage;