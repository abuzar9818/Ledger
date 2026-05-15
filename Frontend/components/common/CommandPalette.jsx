import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Wallet, Send, Clock, History, BarChart2, Target, Settings, ShieldAlert } from "lucide-react";

const commands = [
  { id: "dashboard", name: "Dashboard Overview", icon: <BarChart2 size={16} />, path: "/dashboard", section: "Navigation" },
  { id: "accounts", name: "My Accounts", icon: <Wallet size={16} />, path: "/dashboard/accounts", section: "Navigation" },
  { id: "transfer", name: "Send Money", icon: <Send size={16} />, path: "/dashboard/transfer", section: "Actions" },
  { id: "scheduled", name: "Scheduled Transfers", icon: <Clock size={16} />, path: "/dashboard/scheduled-transfers", section: "Actions" },
  { id: "history", name: "Transaction History", icon: <History size={16} />, path: "/dashboard/transactions", section: "Reports" },
  { id: "reports", name: "Financial Reports", icon: <BarChart2 size={16} />, path: "/dashboard/reports", section: "Reports" },
  { id: "budget", name: "Budget Planner", icon: <Target size={16} />, path: "/dashboard/budget", section: "Planning" },
  { id: "settings", name: "Account Settings", icon: <Settings size={16} />, path: "/dashboard/settings", section: "System" },
  { id: "admin", name: "Admin Console", icon: <ShieldAlert size={16} />, path: "/admin", section: "System", role: "ADMIN" }
];

export default function CommandPalette({ userRole = "USER" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const availableCommands = commands.filter(c => !c.role || c.role === userRole);
  
  const filteredCommands = availableCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) || 
    cmd.section.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-[15%] z-[1000] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
          >
            <div className="flex items-center border-b border-slate-100 px-4 py-3">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              <div className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No results found for "{search}"
                </div>
              ) : (
                Object.entries(
                  filteredCommands.reduce((acc, cmd) => {
                    if (!acc[cmd.section]) acc[cmd.section] = [];
                    acc[cmd.section].push(cmd);
                    return acc;
                  }, {})
                ).map(([section, cmds]) => (
                  <div key={section} className="mb-4 last:mb-0">
                    <div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {section}
                    </div>
                    {cmds.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd.path)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-teal-700"
                      >
                        <div className="text-slate-400">{cmd.icon}</div>
                        {cmd.name}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
