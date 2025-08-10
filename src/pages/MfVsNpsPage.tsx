import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Calculator, TrendingUp, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Data structures
interface Scenario {
  monthlyInvestment: string;
  investmentHorizon: string;
  mfReturn: string;
  npsReturn: string;
  annuityRate: string;
}

interface CalculationResult {
  mfCorpus: number;
  mfTax: number;
  mfPostTaxCorpus: number;
  npsCorpus: number;
  npsLumpSum: number;
  npsAnnuityAmount: number;
  monthlyPension: number;
}

// Reusable Input Card Component
const ScenarioInputCard: React.FC<{
  title: string;
  scenario: Scenario;
  onScenarioChange: (field: keyof Scenario, value: string) => void;
}> = ({ title, scenario, onScenarioChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor={`monthly-investment-${title}`}>Monthly Investment (₹)</Label>
        <Input id={`monthly-investment-${title}`} type="number" value={scenario.monthlyInvestment} onChange={e => onScenarioChange('monthlyInvestment', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`investment-horizon-${title}`}>Investment Horizon (Years)</Label>
        <Input id={`investment-horizon-${title}`} type="number" value={scenario.investmentHorizon} onChange={e => onScenarioChange('investmentHorizon', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`mf-return-${title}`}>Expected MF Return (% p.a.)</Label>
        <Input id={`mf-return-${title}`} type="number" value={scenario.mfReturn} onChange={e => onScenarioChange('mfReturn', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`nps-return-${title}`}>Expected NPS Return (% p.a.)</Label>
        <Input id={`nps-return-${title}`} type="number" value={scenario.npsReturn} onChange={e => onScenarioChange('npsReturn', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`annuity-rate-${title}`}>Annuity Rate on NPS Corpus (% p.a.)</Label>
        <Input id={`annuity-rate-${title}`} type="number" value={scenario.annuityRate} onChange={e => onScenarioChange('annuityRate', e.target.value)} />
      </div>
    </CardContent>
  </Card>
);

// Reusable Result Display Component
const ResultDisplay: React.FC<{ result: CalculationResult }> = ({ result }) => {
    const ResultRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold">{value}</span>
        </div>
      );

    return (
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
    )
};

// Main Page Component
const MfVsNpsPage: React.FC = () => {
  const [scenario1, setScenario1] = useState<Scenario>({
    monthlyInvestment: '10000',
    investmentHorizon: '30',
    mfReturn: '12',
    npsReturn: '10',
    annuityRate: '6',
  });

  const [scenario2, setScenario2] = useState<Scenario>({
    monthlyInvestment: '15000',
    investmentHorizon: '25',
    mfReturn: '12',
    npsReturn: '10',
    annuityRate: '6',
  });

  const [result1, setResult1] = useState<CalculationResult | null>(null);
  const [result2, setResult2] = useState<CalculationResult | null>(null);

  const handleScenarioChange = (
    scenario: 'scenario1' | 'scenario2',
    field: keyof Scenario,
    value: string
  ) => {
    if (scenario === 'scenario1') {
      setScenario1(prev => ({ ...prev, [field]: value }));
    } else {
      setScenario2(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculate = (scenario: Scenario): CalculationResult => {
    const P = parseFloat(scenario.monthlyInvestment) || 0;
    const t = parseFloat(scenario.investmentHorizon) || 0;
    const r_mf = (parseFloat(scenario.mfReturn) || 0) / 100;
    const r_nps = (parseFloat(scenario.npsReturn) || 0) / 100;
    const r_annuity = (parseFloat(scenario.annuityRate) || 0) / 100;
    const n = 12; // Compounded monthly

    if (P <= 0 || t <= 0) {
        return { mfCorpus: 0, mfTax: 0, mfPostTaxCorpus: 0, npsCorpus: 0, npsLumpSum: 0, npsAnnuityAmount: 0, monthlyPension: 0 };
    }

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

    return {
      mfCorpus: mfFutureValue,
      mfTax,
      mfPostTaxCorpus,
      npsCorpus: npsFutureValue,
      npsLumpSum,
      npsAnnuityAmount,
      monthlyPension,
    };
  };

  const handleCompare = () => {
    setResult1(calculate(scenario1));
    setResult2(calculate(scenario2));
  };

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
          <ScenarioInputCard
            title="Scenario 1"
            scenario={scenario1}
            onScenarioChange={(field, value) => handleScenarioChange('scenario1', field, value)}
          />
          <ScenarioInputCard
            title="Scenario 2"
            scenario={scenario2}
            onScenarioChange={(field, value) => handleScenarioChange('scenario2', field, value)}
          />
        </div>

        <div className="text-center mb-8">
          <Button onClick={handleCompare} size="lg">
            <Calculator className="mr-2 h-4 w-4" /> Compare Scenarios
          </Button>
        </div>

        {(result1 && result2) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-center mb-4">Scenario 1 Results</h2>
              <ResultDisplay result={result1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-center mb-4">Scenario 2 Results</h2>
              <ResultDisplay result={result2} />
            </div>
          </div>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default MfVsNpsPage;