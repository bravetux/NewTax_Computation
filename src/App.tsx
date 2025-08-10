import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IncomePage from "./pages/IncomePage";
import CapitalGainsPage from "./pages/CapitalGainsPage";
import Layout from "./components/Layout";
import DematGainsPage from "./pages/DematGainsPage";
import MutualFundGainsPage from "./pages/MutualFundGainsPage";
import DividendsPage from "./pages/DividendsPage";
import DividendManagementPage from "./pages/DividendManagementPage";
import BondsPage from "./pages/BondsPage";
import FDIncomePage from "./pages/FDIncomePage";
import RentalIncomePage from "./pages/RentalIncomePage";
import IncomeSummaryPage from "./pages/IncomeSummaryPage";
import TaxComputationPage from "./pages/TaxComputationPage";
import DataManagementPage from "./pages/DataManagementPage";
import PlanWithAiPage from "./pages/PlanWithAiPage";
import GiftingPage from "./pages/GiftingPage";
import Section54FPage from "./pages/Section54FPage";
import InvestmentDiaryPage from "./pages/InvestmentDiaryPage";
import MfVsNpsPage from "./pages/MfVsNpsPage";
import TaxRegimeComparisonPage from "./pages/TaxRegimeComparisonPage";
import LoanEMICalculatorPage from "./pages/LoanEMICalculatorPage";
import TaxFilingChecklistPage from "./pages/TaxFilingChecklistPage"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route element={<Layout />}>
            <Route
              path="/tax-dashboard"
              element={<IncomePage />}
            />
            <Route
              path="/tax-computation"
              element={<TaxComputationPage />}
            />
            <Route
              path="/income-summary"
              element={<IncomeSummaryPage />}
            />
            <Route
              path="/capital-gains"
              element={<CapitalGainsPage />}
            />
            <Route
              path="/demat-gains"
              element={<DematGainsPage />}
            />
            <Route
              path="/mutual-fund-gains"
              element={<MutualFundGainsPage />}
            />
            <Route
              path="/dividends"
              element={<DividendsPage />}
            />
            <Route
              path="/dividends/:source"
              element={<DividendManagementPage />}
            />
            <Route
              path="/bonds"
              element={<BondsPage />}
            />
            <Route
              path="/fd-income"
              element={<FDIncomePage />}
            />
            <Route
              path="/rental-income"
              element={<RentalIncomePage />}
            />
            <Route
              path="/gifting"
              element={<GiftingPage />}
            />
            <Route
              path="/section-54f"
              element={<Section54FPage />}
            />
            <Route
              path="/investment-diary"
              element={<InvestmentDiaryPage />}
            />
            <Route
              path="/mf-vs-nps"
              element={<MfVsNpsPage />}
            />
            <Route
              path="/tax-regime-comparison"
              element={<TaxRegimeComparisonPage />}
            />
            <Route
              path="/loan-emi-calculator"
              element={<LoanEMICalculatorPage />}
            />
            <Route
              path="/tax-filing-checklist" // New Route
              element={<TaxFilingChecklistPage />}
            />
            <Route
              path="/data-management"
              element={<DataManagementPage />}
            />
            <Route
              path="/plan-with-ai"
              element={<PlanWithAiPage />}
            />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;