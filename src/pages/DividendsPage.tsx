import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

interface Dividend {
  date: string;
  particulars: string;
  amount: number;
}

const sources = {
  pms: {
    title: "PMS",
    localStorageKey: "dyad-pms-dividends",
    path: "/dividends/pms",
  },
  broker1: {
    title: "Broker 1",
    localStorageKey: "dyad-broker1-dividends",
    path: "/dividends/broker1",
  },
  broker2: {
    title: "Broker 2",
    localStorageKey: "dyad-broker2-dividends",
    path: "/dividends/broker2",
  },
};

const DividendsPage: React.FC = () => {
  const [totals, setTotals] = useState({ pms: 0, broker1: 0, broker2: 0 });

  useEffect(() => {
    const calculateTotals = () => {
      const newTotals = { pms: 0, broker1: 0, broker2: 0 };
      for (const [key, source] of Object.entries(sources)) {
        try {
          const savedData = localStorage.getItem(source.localStorageKey);
          const items: Dividend[] = savedData ? JSON.parse(savedData) : [];
          const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
          newTotals[key as keyof typeof newTotals] = total;
        } catch {
          newTotals[key as keyof typeof newTotals] = 0;
        }
      }
      setTotals(newTotals);
    };

    calculateTotals();
    
    const handleStorageChange = () => calculateTotals();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const grandTotal = totals.pms + totals.broker1 + totals.broker2;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Dividend Income Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(sources).map(([key, source]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{source.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">₹{totals[key as keyof typeof totals].toLocaleString("en-IN")}</p>
                <Link to={source.path}>
                  <Button variant="outline">Manage <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">Total Dividend Income: ₹{grandTotal.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default DividendsPage;