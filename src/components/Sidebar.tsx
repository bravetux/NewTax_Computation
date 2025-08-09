import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Landmark,
  FileText,
  PieChart,
  TrendingUp,
  Building,
  AreaChart,
  Briefcase,
  Library,
  ChevronDown,
  BarChart2,
  Calculator,
  Sparkles,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Sidebar = () => {
  const location = useLocation();
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isCapitalGainsOpen, setIsCapitalGainsOpen] = useState(false);
  const [isDividendsOpen, setIsDividendsOpen] = useState(false);

  const mainNavLinkClass = (isActive: boolean) =>
    cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    );

  const subNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center pl-11 pr-3 py-2 text-sm font-medium rounded-md",
      isActive
        ? "text-primary dark:text-primary-foreground font-semibold"
        : "text-gray-600 dark:text-gray-400",
      "hover:bg-gray-200 dark:hover:bg-gray-700"
    );

  const incomeNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center pl-8 pr-3 py-2 text-sm font-medium rounded-md",
      isActive
        ? "text-primary dark:text-primary-foreground font-semibold"
        : "text-gray-600 dark:text-gray-400",
      "hover:bg-gray-200 dark:hover:bg-gray-700"
    );

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold">Tax Planner</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to="/tax-dashboard"
          className={({isActive}) => mainNavLinkClass(isActive)}
          end
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/tax-computation"
          className={({isActive}) => mainNavLinkClass(isActive)}
        >
          <Calculator className="mr-3 h-5 w-5" />
          Tax Computation
        </NavLink>
        
        <Collapsible open={isIncomeOpen} onOpenChange={setIsIncomeOpen} className="space-y-1 pt-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Income</p>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isIncomeOpen && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            <NavLink to="/income-summary" className={incomeNavLinkClass}><BarChart2 className="mr-3 h-4 w-4" />Summary</NavLink>
            <NavLink to="/rental-income" className={incomeNavLinkClass}><Home className="mr-3 h-4 w-4" />Rental</NavLink>
            <NavLink to="/fd-income" className={incomeNavLinkClass}><Landmark className="mr-3 h-4 w-4" />FD</NavLink>
            <NavLink to="/bonds" className={incomeNavLinkClass}><FileText className="mr-3 h-4 w-4" />Bond</NavLink>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isCapitalGainsOpen} onOpenChange={setIsCapitalGainsOpen} className="space-y-1 pt-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Capital Gains</p>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isCapitalGainsOpen && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            <NavLink to="/capital-gains" className={subNavLinkClass} end>
              <TrendingUp className="mr-3 h-4 w-4" />
              Summary
            </NavLink>
            <NavLink to="/demat-gains" className={subNavLinkClass}>
              <Building className="mr-3 h-4 w-4" />
              Demat Accounts
            </NavLink>
            <NavLink to="/mutual-fund-gains" className={subNavLinkClass}>
              <AreaChart className="mr-3 h-4 w-4" />
              Mutual Funds
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isDividendsOpen} onOpenChange={setIsDividendsOpen} className="space-y-1 pt-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dividends</p>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isDividendsOpen && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            <NavLink to="/dividends" className={subNavLinkClass} end>
              <PieChart className="mr-3 h-4 w-4" />
              Summary
            </NavLink>
            <NavLink to="/dividends/pms" className={subNavLinkClass}>
              <Briefcase className="mr-3 h-4 w-4" />
              PMS
            </NavLink>
            <NavLink to="/dividends/broker1" className={subNavLinkClass}>
              <Library className="mr-3 h-4 w-4" />
              Broker 1
            </NavLink>
            <NavLink to="/dividends/broker2" className={subNavLinkClass}>
              <Library className="mr-3 h-4 w-4" />
              Broker 2
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        <NavLink
          to="/gifting"
          className={({isActive}) => mainNavLinkClass(isActive)}
        >
          <Gift className="mr-3 h-5 w-5" />
          Gifting
        </NavLink>
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <NavLink
              to="/data-management"
              className={({isActive}) => mainNavLinkClass(isActive)}
            >
              <FileText className="mr-3 h-5 w-5" />
              Data Management
            </NavLink>
            <NavLink
              to="/plan-with-ai"
              className={({isActive}) => mainNavLinkClass(isActive)}
            >
              <Sparkles className="mr-3 h-5 w-5" />
              Plan with AI
            </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;