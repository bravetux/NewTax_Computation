import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Upload, Download } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
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
import { Textarea } from '@/components/ui/textarea'; // Import Textarea

interface InvestmentEntry {
  id: string;
  date: string;
  name: string;
  assetClass: string;
  amount: number | string;
  note: string; // Added note field
}

const LOCAL_STORAGE_KEY = 'dyad-investment-diary';

const InvestmentDiaryPage: React.FC = () => {
  const [entries, setEntries] = useState<InvestmentEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure 'note' field is present when loading old data
        return parsed.map((entry: InvestmentEntry) => ({
          ...entry,
          note: entry.note || '', // Initialize note if it doesn't exist
        }));
      }
    } catch (error) {
      showError("Could not load saved investment diary data.");
    }
    return [];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddRow = () => {
    setEntries([
      ...entries,
      { id: new Date().toISOString(), date: '', name: '', assetClass: '', amount: '', note: '' }, // Initialize new entry with note
    ]);
  };

  const handleInputChange = (id: string, field: keyof Omit<InvestmentEntry, 'id'>, value: string) => {
    setEntries(
      entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleDeleteRow = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    showSuccess('Entry removed.');
  };

  const handleExport = () => {
    try {
      const dataToExport = { entries };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = "investment-diary.json";
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      showSuccess("Investment diary data exported successfully!");
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
        // Validate imported data and ensure 'note' field is handled
        const isValid = (data: any) => Array.isArray(data) && data.every(item => 
          "id" in item && "date" in item && "name" in item && "assetClass" in item && "amount" in item
        );

        if (importedData.entries && isValid(importedData.entries)) {
          const validatedEntries = importedData.entries.map((entry: InvestmentEntry) => ({
            ...entry,
            note: entry.note || '', // Ensure note is initialized
          }));
          setEntries(validatedEntries);
          showSuccess("Investment diary data imported successfully!");
        } else {
          showError("Invalid or empty JSON file format. Expected an 'entries' array with required fields.");
        }
      } catch (error) {
        console.error("Import failed:", error);
        showError("Failed to parse JSON file. Please ensure it's a valid investment diary backup file.");
      } finally {
        if (event.target) {
          event.target.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllEntries = () => {
    setEntries([]);
    showSuccess("All investment diary entries have been cleared.");
  };

  const totalInvestment = entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
            Investment Diary
          </h1>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <Button variant="outline" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Clear All</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all
                    your investment diary entries from this browser.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllEntries}>
                    Yes, clear all entries
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="text-center text-muted-foreground mb-8">
          Keep a log of all your investments in one place.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              Total Amount Invested: ₹{totalInvestment.toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Entries</CardTitle>
            <Button onClick={handleAddRow} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Investment Name</TableHead>
                    <TableHead>Asset Class</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Note</TableHead> {/* Added Note Header */}
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length > 0 ? (
                    entries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Input
                            type="date"
                            value={entry.date}
                            onChange={e => handleInputChange(entry.id, 'date', e.target.value)}
                            className="min-w-[150px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={entry.name}
                            onChange={e => handleInputChange(entry.id, 'name', e.target.value)}
                            placeholder="e.g., Parag Parikh Flexi Cap"
                            className="min-w-[200px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={entry.assetClass}
                            onChange={e => handleInputChange(entry.id, 'assetClass', e.target.value)}
                            placeholder="e.g., Equity MF"
                            className="min-w-[150px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={entry.amount}
                            onChange={e => handleInputChange(entry.id, 'amount', e.target.value)}
                            placeholder="Enter amount"
                            className="text-right min-w-[120px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={entry.note}
                            onChange={e => handleInputChange(entry.id, 'note', e.target.value)}
                            placeholder="Add details here..."
                            className="min-w-[250px] h-auto" // Adjusted height for textarea
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(entry.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24"> {/* Updated colspan */}
                        No entries yet. Click "Add Entry" to start.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default InvestmentDiaryPage;