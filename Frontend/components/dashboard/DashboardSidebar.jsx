import { NavLink } from "react-router-dom";

const primaryLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transfer", to: "/dashboard/transfer" },
  { label: "Scheduled", to: "/dashboard/scheduled-transfers" },
  { label: "Transactions", to: "/dashboard/transactions" },
  { label: "Reports", to: "/dashboard/reports" },
  { label: "Settings", to: "/dashboard/settings" },
  { label: "Admin", to: "/admin" },
];

function DashboardSidebar({ role = "USER" }) {
  const links = role === "ADMIN" ? primaryLinks : primaryLinks.filter((item) => item.to !== "/admin");

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white/85 backdrop-blur-sm lg:flex">
      <div className="border-b border-slate-200 px-6 py-6">
        <h1 className="text-xl font-bold text-slate-900">Ledger</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">Financial Workspace</p>
        <div className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {role} access
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Main Navigation</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-amber-400 text-slate-950 shadow-sm ring-2 ring-teal-200/60"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-5 py-4">
        <p className="text-xs leading-relaxed text-slate-500">
          Tip: Start with Dashboard for balances, then use Scheduled and Transactions for recurring and historical analysis.
        </p>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
