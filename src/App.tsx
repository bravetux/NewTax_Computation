import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IncomeTaxDashboard from "./pages/IncomeTaxDashboard";
import CapitalGainsPage from "./pages/CapitalGainsPage";
import Layout from "./components/Layout";
import DematGainsPage from "./pages/DematGainsPage";
import MutualFundGainsPage from "./pages/MutualFundGainsPage";

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
              path="/income-tax-dashboard"
              element={<IncomeTaxDashboard />}
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
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;