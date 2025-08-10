import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator, TrendingUp, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CalculationResult {
  mfCorpus: number;
  mfTax: number;
  mfPostTaxCorpus: number;
  npsCorpus: number;
  npsLumpSum: number;
  npsAnnuityAmount: number;
  monthlyPension: number;
}

const MfVsNpsPage: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('10000');
  const [investmentHorizon, setInvestmentHorizon] = useState('30');
  const [mfReturn, setMfReturn] = useState('12');
  const [npsReturn, setNpsReturn] = useState('10');
  const [annuityRate, setAnnuityRate] = useState('6');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const P = parseFloat(monthlyInvestment) || 0;
    const t = parseFloat(investmentHorizon) || 0;
    const r_mf = (parseFloat(mfReturn) || 0) / 100;
    const r_nps = (parseFloat(npsReturn) || 0) / 100;
    const r_annuity = (parseFloat(annuityRate) || 0) / 100;
    const n = 12; // Compounded monthly

    if (P <= 0 || t <= 0) return;

    const totalInvested = P * n * t;

    // MF Calculation
    const i_mf = r_mf / n;
    const mfFutureValue = P * (((Math.pow(1 + i_mf, n * t) - 1) / i_mf) * (1 + i_mf));
    const mfGains = mfFutureValue - totalInvested;
    const mfTax = mfGains * 0.1; // Simplified 10% LTCG tax
    const mfPostTaxCorpus = mfFutureValue - mfTax;

    // NPS Calculation
    const i_nps = r_nps / n;
    const npsFutureValue = P * (((Math.pow(1 + i_nps, n * t) - 1) / i_nps) * (1 + i_nps));
    const npsLumpSum = npsFutureValue * 0.6; // 60% lump sum is tax-free
    const npsAnnuityAmount = npsFutureValue * 0.4; // 40% must be used for annuity
    const monthlyPension = (npsAnnuityAmount * r_annuity) / 12;

    setResult({
      mfCorpus: mfFutureValue,
      mfTax,
      mfPostTaxCorpus,
      npsCorpus: npsFutureValue,
      npsLumpSum,
      npsAnnuityAmount,
      monthlyPension,
    });
  };

  const ResultRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Mutual Funds vs. NPS Calculator
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Compare the potential returns and tax implications of investing in Mutual Funds versus the National Pension System (NPS) for your retirement planning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                <Input id="monthly-investment" type="number" value={monthlyInvestment} onChange={e => setMonthlyInvestment(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="investment-horizon">Investment Horizon (Years)</Label>
                <Input id="investment-horizon" type="number" value={investmentHorizon} onChange={e => setInvestmentHorizon(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="mf-return">Expected MF Return (% p.a.)</Label>
                <Input id="mf-return" type="number" value={mfReturn} onChange={e => setMfReturn(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="nps-return">Expected NPS Return (% p.a.)</Label>
                <Input id="nps-return" type="number" value={npsReturn} onChange={e => setNpsReturn(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="annuity-rate">Annuity Rate on NPS Corpus (% p.a.)</Label>
                <Input id="annuity-rate" type="number" value={annuityRate} onChange={e => setAnnuityRate(e.target.value)} />
              </div>
              <Button onClick={handleCalculate} className="w-full">
                <Calculator className="mr-2 h-4 w-4" /> Calculate
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" /> Mutual Fund (MF)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResultRow label="Total Corpus" value={`₹${result.mfCorpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <ResultRow label="Tax on Gains (10%)" value={`- ₹${result.mfTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Separator />
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Post-Tax Corpus</span>
                    <span>₹{result.mfPostTaxCorpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Shield className="mr-2 h-5 w-5 text-green-600" /> National Pension System (NPS)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResultRow label="Total Corpus" value={`₹${result.npsCorpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Separator />
                  <ResultRow label="Tax-Free Lump Sum (60%)" value={`₹${result.npsLumpSum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <ResultRow label="Annuity Purchase (40%)" value={`₹${result.npsAnnuityAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Separator />
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Monthly Pension</span>
                    <span>₹{result.monthlyPension.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default MfVsNpsPage;