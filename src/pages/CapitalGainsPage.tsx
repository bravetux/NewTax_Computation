import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ArrowRight } from "lucide-react";

interface CapitalGainsItem {
  name: string;
  stcg: number | string;
  ltcg: number | string;
}

const DEMAT_KEY = "dyad-demat-gains";
const MF_KEY = "dyad-mutual-fund-gains";

const CapitalGainsPage: React.FC = () => {
  const [totalDematGains, setTotalDematGains] = useState(0);
  const [totalMutualFundGains, setTotalMutualFundGains] = useState(0);

  useEffect(() => {
    const calculateGains = () => {
      const calculateTotal = (key: string): number => {
        try {
          const savedData = localStorage.getItem(key);
          const items: CapitalGainsItem[] = savedData ? JSON.parse(savedData) : [];
          return items.reduce((total, item) => total + (Number(item.stcg) || 0) + (Number(item.ltcg) || 0), 0);
        } catch {
          return 0;
        }
      };
      
      setTotalDematGains(calculateTotal(DEMAT_KEY));
      setTotalMutualFundGains(calculateTotal(MF_KEY));
    };

    calculateGains();
    
    const handleStorageChange = () => calculateGains();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange); // Recalculate when tab is focused

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const totalCapitalGains = totalDematGains + totalMutualFundGains;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Capital Gains Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Demat Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₹{totalDematGains.toLocaleString("en-IN")}</p>
              <Link to="/demat-gains">
                <Button variant="outline">Manage Demat Gains <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mutual Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">₹{totalMutualFundGains.toLocaleString("en-IN")}</p>
              <Link to="/mutual-fund-gains">
                <Button variant="outline">Manage Mutual Fund Gains <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">Total Capital Gains: ₹{totalCapitalGains.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default CapitalGainsPage;