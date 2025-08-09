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
  const [dematStcg, setDematStcg] = useState(0);
  const [dematLtcg, setDematLtcg] = useState(0);
  const [mfStcg, setMfStcg] = useState(0);
  const [mfLtcg, setMfLtcg] = useState(0);

  useEffect(() => {
    const calculateGains = () => {
      const calculateTotals = (key: string): { stcg: number; ltcg: number } => {
        try {
          const savedData = localStorage.getItem(key);
          const items: CapitalGainsItem[] = savedData ? JSON.parse(savedData) : [];
          const stcg = items.reduce((total, item) => total + (Number(item.stcg) || 0), 0);
          const ltcg = items.reduce((total, item) => total + (Number(item.ltcg) || 0), 0);
          return { stcg, ltcg };
        } catch {
          return { stcg: 0, ltcg: 0 };
        }
      };
      
      const dematTotals = calculateTotals(DEMAT_KEY);
      setDematStcg(dematTotals.stcg);
      setDematLtcg(dematTotals.ltcg);

      const mfTotals = calculateTotals(MF_KEY);
      setMfStcg(mfTotals.stcg);
      setMfLtcg(mfTotals.ltcg);
    };

    calculateGains();
    
    const handleStorageChange = () => calculateGains();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const totalStcg = dematStcg + mfStcg;
  const totalLtcg = dematLtcg + mfLtcg;

  const ltcgExemption = 150000;
  const taxableLtcg = Math.max(0, totalLtcg - ltcgExemption);
  const ltcgTax = taxableLtcg * 0.125;
  const stcgTax = totalStcg * 0.20;
  const totalTax = ltcgTax + stcgTax;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Capital Gains Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Demat Accounts</CardTitle>
              <Link to="/demat-gains">
                <Button variant="outline" size="sm">Manage <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Short-Term Gains:</span> <span className="font-semibold">₹{dematStcg.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span>Long-Term Gains:</span> <span className="font-semibold">₹{dematLtcg.toLocaleString("en-IN")}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mutual Funds</CardTitle>
              <Link to="/mutual-fund-gains">
                <Button variant="outline" size="sm">Manage <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Short-Term Gains:</span> <span className="font-semibold">₹{mfStcg.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span>Long-Term Gains:</span> <span className="font-semibold">₹{mfLtcg.toLocaleString("en-IN")}</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-lg">
                <div className="flex justify-between"><span>Total Short-Term Capital Gains (STCG):</span> <span className="font-bold">₹{totalStcg.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span>Total Long-Term Capital Gains (LTCG):</span> <span className="font-bold">₹{totalLtcg.toLocaleString("en-IN")}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capital Gains Tax Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Long-Term Capital Gains Tax</h3>
                  <div className="space-y-1 text-sm pl-4 border-l-2">
                    <div className="flex justify-between"><span>Total LTCG:</span> <span>₹{totalLtcg.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span>Exemption:</span> <span>- ₹{ltcgExemption.toLocaleString("en-IN")}</span></div>
                    <hr/>
                    <div className="flex justify-between font-medium"><span>Taxable LTCG:</span> <span>₹{taxableLtcg.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span>Tax on LTCG @ 12.5%:</span> <span className="font-semibold">₹{ltcgTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Short-Term Capital Gains Tax</h3>
                  <div className="space-y-1 text-sm pl-4 border-l-2">
                    <div className="flex justify-between"><span>Total STCG:</span> <span>₹{totalStcg.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span>Tax on STCG @ 20%:</span> <span className="font-semibold">₹{stcgTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  </div>
                </div>
                <hr className="my-4"/>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Capital Gains Tax Payable:</span>
                  <span>₹{totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default CapitalGainsPage;