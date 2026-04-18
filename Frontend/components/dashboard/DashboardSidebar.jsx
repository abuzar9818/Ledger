import { NavLink } from "react-router-dom";

const primaryLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transfer", to: "/dashboard/transfer" },
  { label: "Transactions", to: "/dashboard/transactions" },
  { label: "Admin", to: "/admin" },
];

function DashboardSidebar({ role = "USER" }) {
  const links = role === "ADMIN" ? primaryLinks : primaryLinks.filter((item) => item.to !== "/admin");

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-xl font-bold text-slate-900">Ledger</h1>
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Financial Workspace</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
