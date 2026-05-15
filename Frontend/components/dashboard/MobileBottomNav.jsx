import { NavLink } from "react-router-dom";
import { Home, Wallet, Send, Settings, Target } from "lucide-react";
import { motion } from "framer-motion";

const mobileLinks = [
  { label: "Home", to: "/dashboard", icon: <Home size={20} /> },
  { label: "Accounts", to: "/dashboard/accounts", icon: <Wallet size={20} /> },
  { label: "Transfer", to: "/dashboard/transfer", icon: <Send size={20} /> },
  { label: "Budget", to: "/dashboard/budget", icon: <Target size={20} /> },
  { label: "Settings", to: "/dashboard/settings", icon: <Settings size={20} /> },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/90 pb-safe pt-2 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      {mobileLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-16 h-14 relative ${
              isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-2 w-8 h-1 bg-teal-500 rounded-b-full"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <div className={`transition-transform ${isActive ? '-translate-y-1' : ''}`}>
                {link.icon}
              </div>
              <span className={`text-[10px] font-semibold mt-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {link.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
