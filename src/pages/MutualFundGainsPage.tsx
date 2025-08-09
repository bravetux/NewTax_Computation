import React, { useState, useRef, useEffect } from "react";
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

const LOCAL_STORAGE_KEY = "dyad-mutual-fund-gains";

const MutualFundGainsPage: React.FC = () => {
  const [mutualFunds, setMutualFunds] = useState<CapitalGainsItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      showError("Could not load saved Mutual Fund data.");
    }
    return Array(10)
      .fill(0)
      .map((_, i) => ({ name: `Mutual Fund ${i + 1}`, stcg: "", ltcg: "" }));
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mutualFunds));
  }, [mutualFunds]);

  const handleChange = (index: number, field: "stcg" | "ltcg", value: string) => {
    const newItems = [...mutualFunds];
    newItems[index] = { ...newItems[index], [field]: value };
    setMutualFunds(newItems);
  };

  const handleNameChange = (index: number, value: string) => {
    const newItems = [...mutualFunds];
    newItems[index].name = value;
    setMutualFunds(newItems);
  };

  const totalGains = mutualFunds.reduce(
    (total, item) => total + (Number(item.stcg) || 0) + (Number(item.ltcg) || 0),
    0
  );

  const handleExport = () => {
    const dataToExport = { mutualFunds };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "mutual-fund-gains.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showSuccess("Mutual Fund data exported successfully!");
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
        const isValid = (data: any) => Array.isArray(data) && data.every(item => "name" in item && "stcg" in item && "ltcg" in item);

        if (isValid(importedData.mutualFunds)) {
          setMutualFunds(importedData.mutualFunds);
          showSuccess("Mutual Fund data imported successfully!");
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Mutual Fund Gains
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mutualFunds.map((fund, index) => (
            <CapitalGainsCard
              key={`mf-${index}`}
              title={fund.name}
              stcg={fund.stcg}
              ltcg={fund.ltcg}
              onStcgChange={(e) => handleChange(index, "stcg", e.target.value)}
              onLtcgChange={(e) => handleChange(index, "ltcg", e.target.value)}
              isEditing={isEditing}
              onTitleChange={(e) => handleNameChange(index, e.target.value)}
            />
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader><CardTitle>Mutual Fund Gains Summary</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">Total from Mutual Funds: ₹{totalGains.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default MutualFundGainsPage;