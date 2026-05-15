import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart2, Wallet, Send, Clock, History, Target, Settings, ShieldAlert, ChevronLeft, ChevronRight 
} from "lucide-react";

const primaryLinks = [
  { label: "Dashboard", to: "/dashboard", icon: <BarChart2 size={20} /> },
  { label: "Accounts", to: "/dashboard/accounts", icon: <Wallet size={20} /> },
  { label: "Transfer", to: "/dashboard/transfer", icon: <Send size={20} /> },
  { label: "Scheduled", to: "/dashboard/scheduled-transfers", icon: <Clock size={20} /> },
  { label: "Transactions", to: "/dashboard/transactions", icon: <History size={20} /> },
  { label: "Budget", to: "/dashboard/budget", icon: <Target size={20} /> },
  { label: "Reports", to: "/dashboard/reports", icon: <BarChart2 size={20} /> },
  { label: "Settings", to: "/dashboard/settings", icon: <Settings size={20} /> },
  { label: "Admin", to: "/admin", icon: <ShieldAlert size={20} /> },
];

function DashboardSidebar({ role = "USER" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const links = role === "ADMIN" ? primaryLinks : primaryLinks.filter((item) => item.to !== "/admin");

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden flex-col border-r border-slate-200 bg-white/85 backdrop-blur-sm lg:flex relative h-full"
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-teal-600 shadow-sm z-10"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`border-b border-slate-200 py-6 transition-all ${isCollapsed ? 'px-0 text-center' : 'px-6'}`}>
        <h1 className={`font-bold text-slate-900 ${isCollapsed ? 'text-sm' : 'text-xl'}`}>
          {isCollapsed ? 'FIN' : 'Ledger'}
        </h1>
        {!isCollapsed && (
          <>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">Financial Workspace</p>
            <div className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {role} access
            </div>
          </>
        )}
      </div>

      <nav className={`flex-1 space-y-2 py-5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-3' : 'px-4'}`}>
        {!isCollapsed && (
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">Main Navigation</p>
        )}
        
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "flex items-center rounded-xl transition font-semibold group",
                isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 gap-3 text-sm",
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-amber-400 text-slate-950 shadow-sm ring-2 ring-teal-200/60"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
            title={isCollapsed ? link.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className={isActive ? "text-slate-950" : "text-slate-400 group-hover:text-teal-600"}>
                  {link.icon}
                </div>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-xs leading-relaxed text-slate-500">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] mr-1 text-slate-600">⌘K</kbd>
            Quick Search
          </p>
        </div>
      )}
    </motion.aside>
  );
}

export default DashboardSidebar;
