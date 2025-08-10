import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator, TrendingUp, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

// State for inputs
interface MfInputs {
  yearlyInvestment: string;
  investmentHorizon: string;
  mfReturn: string;
  transferToBonds: boolean;
  bondReturn: string;
}

interface NpsInputs {
  yearlyInvestment: string;
  investmentHorizon: string;
  npsReturn: string;
  annuityRate: string;
}

// State for results
interface MfResult {
  corpus: number;
  tax: number;
  postTaxCorpus: number;
  yearlyBondIncome: number | null;
}

interface NpsResult {
  corpus: number;
  lumpSum: number;
  annuityAmount: number;
  monthlyPension: number;
}

const MfVsNpsPage: React.FC = () => {
  const [mfInputs, setMfInputs] = useState<MfInputs>({
    yearlyInvestment: '120000',
    investmentHorizon: '30',
    mfReturn: '12',
    transferToBonds: false,
    bondReturn: '9',
  });

  const [npsInputs, setNpsInputs] = useState<NpsInputs>({
    yearlyInvestment: '120000',
    investmentHorizon: '30',
    npsReturn: '10',
    annuityRate: '6',
  });

  const [mfResult, setMfResult] = useState<MfResult | null>(null);
  const [npsResult, setNpsResult] = useState<NpsResult | null>(null);

  const handleMfInputChange = (field: keyof MfInputs, value: string | boolean) => {
    setMfInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleNpsInputChange = (field: keyof NpsInputs, value: string) => {
    setNpsInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCompare = () => {
    // MF Calculation
    const P_mf = parseFloat(mfInputs.yearlyInvestment) || 0;
    const t_mf = parseFloat(mfInputs.investmentHorizon) || 0;
    const r_mf = (parseFloat(mfInputs.mfReturn) || 0) / 100;

    if (P_mf > 0 && t_mf > 0) {
      const totalInvested_mf = P_mf * t_mf;
      const mfFutureValue = P_mf * (((Math.pow(1 + r_mf, t_mf) - 1) / r_mf) * (1 + r_mf));
      const mfGains = mfFutureValue - totalInvested_mf;
      const mfTax = mfGains * 0.1;
      const mfPostTaxCorpus = mfFutureValue - mfTax;
      
      let yearlyBondIncome: number | null = null;
      if (mfInputs.transferToBonds) {
        const r_bond = (parseFloat(mfInputs.bondReturn) || 0) / 100;
        yearlyBondIncome = mfPostTaxCorpus * r_bond;
      }

      setMfResult({
        corpus: mfFutureValue,
        tax: mfTax,
        postTaxCorpus: mfPostTaxCorpus,
        yearlyBondIncome,
      });
    } else {
      setMfResult(null);
    }

    // NPS Calculation
    const P_nps = parseFloat(npsInputs.yearlyInvestment) || 0;
    const t_nps = parseFloat(npsInputs.investmentHorizon) || 0;
    const r_nps = (parseFloat(npsInputs.npsReturn) || 0) / 100;
    const r_annuity = (parseFloat(npsInputs.annuityRate) || 0) / 100;

    if (P_nps > 0 && t_nps > 0) {
      const npsFutureValue = P_nps * (((Math.pow(1 + r_nps, t_nps) - 1) / r_nps) * (1 + r_nps));
      const npsLumpSum = npsFutureValue * 0.6;
      const npsAnnuityAmount = npsFutureValue * 0.4;
      const monthlyPension = (npsAnnuityAmount * r_annuity) / 12;
      setNpsResult({
        corpus: npsFutureValue,
        lumpSum: npsLumpSum,
        annuityAmount: npsAnnuityAmount,
        monthlyPension: monthlyPension,
      });
    } else {
      setNpsResult(null);
    }
  };

  const ResultRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
          Mutual Funds vs. NPS Comparison
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Compare two different investment scenarios to see how MF and NPS returns stack up.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mutual Fund (MF) Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mf-yearly-investment">Yearly Investment (₹)</Label>
                <Input id="mf-yearly-investment" type="number" value={mfInputs.yearlyInvestment} onChange={e => handleMfInputChange('yearlyInvestment', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="mf-investment-horizon">Investment Horizon (Years)</Label>
                <Input id="mf-investment-horizon" type="number" value={mfInputs.investmentHorizon} onChange={e => handleMfInputChange('investmentHorizon', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="mf-return">Expected MF Return (% p.a.)</Label>
                <Input id="mf-return" type="number" value={mfInputs.mfReturn} onChange={e => handleMfInputChange('mfReturn', e.target.value)} />
              </div>
              <Separator />
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="mf-transfer-bonds" checked={mfInputs.transferToBonds} onCheckedChange={checked => handleMfInputChange('transferToBonds', checked)} />
                <Label htmlFor="mf-transfer-bonds">Transfer corpus to Bonds after horizon</Label>
              </div>
              {mfInputs.transferToBonds && (
                <div className="pt-2">
                  <Label htmlFor="mf-bond-return">Expected Bond Return (% p.a.)</Label>
                  <Input id="mf-bond-return" type="number" value={mfInputs.bondReturn} onChange={e => handleMfInputChange('bondReturn', e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>NPS Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nps-yearly-investment">Yearly Investment (₹)</Label>
                <Input id="nps-yearly-investment" type="number" value={npsInputs.yearlyInvestment} onChange={e => handleNpsInputChange('yearlyInvestment', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="nps-investment-horizon">Investment Horizon (Years)</Label>
                <Input id="nps-investment-horizon" type="number" value={npsInputs.investmentHorizon} onChange={e => handleNpsInputChange('investmentHorizon', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="nps-return">Expected NPS Return (% p.a.)</Label>
                <Input id="nps-return" type="number" value={npsInputs.npsReturn} onChange={e => handleNpsInputChange('npsReturn', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="nps-annuity-rate">Annuity Rate on NPS Corpus (% p.a.)</Label>
                <Input id="nps-annuity-rate" type="number" value={npsInputs.annuityRate} onChange={e => handleNpsInputChange('annuityRate', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button onClick={handleCompare} size="lg">
            <Calculator className="mr-2 h-4 w-4" /> Compare Scenarios
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mfResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" /> Mutual Fund (MF) Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultRow label="Total Corpus" value={`₹${mfResult.corpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <ResultRow label="Tax on Gains (10%)" value={`- ₹${mfResult.tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <Separator />
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Post-Tax Corpus</span>
                  <span>₹{mfResult.postTaxCorpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                {mfResult.yearlyBondIncome !== null && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold pt-2 text-green-600">
                      <span>Yearly Income from Bonds</span>
                      <span>₹{mfResult.yearlyBondIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {npsResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Shield className="mr-2 h-5 w-5 text-green-600" /> National Pension System (NPS) Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultRow label="Total Corpus" value={`₹${npsResult.corpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <Separator />
                <ResultRow label="Tax-Free Lump Sum (60%)" value={`₹${npsResult.lumpSum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <ResultRow label="Annuity Purchase (40%)" value={`₹${npsResult.annuityAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <Separator />
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Monthly Pension</span>
                  <span>₹{npsResult.monthlyPension.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default MfVsNpsPage;