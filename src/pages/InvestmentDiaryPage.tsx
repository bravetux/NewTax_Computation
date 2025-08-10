import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';

interface InvestmentEntry {
  id: string;
  date: string;
  name: string;
  assetClass: string;
  amount: number | string;
}

const LOCAL_STORAGE_KEY = 'dyad-investment-diary';

const InvestmentDiaryPage: React.FC = () => {
  const [entries, setEntries] = useState<InvestmentEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddRow = () => {
    setEntries([
      ...entries,
      { id: new Date().toISOString(), date: '', name: '', assetClass: '', amount: '' },
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

  const totalInvestment = entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Investment Diary
        </h1>
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
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(entry.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
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