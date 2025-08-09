import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Home,
  Landmark,
  FileText,
  PieChart,
  TrendingUp,
  Building,
  AreaChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const isCapitalGainsActive = 
    location.pathname.startsWith('/capital-gains') ||
    location.pathname.startsWith('/demat-gains') ||
    location.pathname.startsWith('/mutual-fund-gains');

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

  const hashLinkClass = "flex items-center pl-8 pr-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold">Tax Planner</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to="/income-tax-dashboard"
          className={({isActive}) => mainNavLinkClass(isActive)}
          end
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
        
        <div className="space-y-1 pt-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Income</p>
          <a href="/income-tax-dashboard#salary-income" className={hashLinkClass}><Wallet className="mr-3 h-4 w-4" />Salary</a>
          <a href="/income-tax-dashboard#rental-income" className={hashLinkClass}><Home className="mr-3 h-4 w-4" />Rental</a>
          <a href="/income-tax-dashboard#fd-income" className={hashLinkClass}><Landmark className="mr-3 h-4 w-4" />FD</a>
          <a href="/income-tax-dashboard#bond-income" className={hashLinkClass}><FileText className="mr-3 h-4 w-4" />Bond</a>
          <a href="/income-tax-dashboard#dividend-income" className={hashLinkClass}><PieChart className="mr-3 h-4 w-4" />Dividend</a>
        </div>

        <div className="space-y-1 pt-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capital Gains</p>
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
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;