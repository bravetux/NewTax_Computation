import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Home,
  Landmark,
  FileText,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const mainNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    );

  const subNavLinkClass = "flex items-center pl-8 pr-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold">Tax Planner</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to="/income-tax-dashboard"
          className={mainNavLinkClass}
          end
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <div className="space-y-1 pt-2">
          <NavLink to="/income-tax-dashboard#salary-income" className={subNavLinkClass}>
            <Wallet className="mr-3 h-4 w-4" />
            Salary
          </NavLink>
          <NavLink to="/income-tax-dashboard#rental-income" className={subNavLinkClass}>
            <Home className="mr-3 h-4 w-4" />
            Rental
          </NavLink>
          <NavLink to="/income-tax-dashboard#fd-income" className={subNavLinkClass}>
            <Landmark className="mr-3 h-4 w-4" />
            FD
          </NavLink>
          <NavLink to="/income-tax-dashboard#bond-income" className={subNavLinkClass}>
            <FileText className="mr-3 h-4 w-4" />
            Bond
          </NavLink>
          <NavLink to="/income-tax-dashboard#dividend-income" className={subNavLinkClass}>
            <PieChart className="mr-3 h-4 w-4" />
            Dividend
          </NavLink>
          <NavLink to="/income-tax-dashboard#capital-gains" className={subNavLinkClass}>
            <TrendingUp className="mr-3 h-4 w-4" />
            Capital Gains
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;