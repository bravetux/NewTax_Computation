import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold">Tax Planner</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to="/income-tax-dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )
          }
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;