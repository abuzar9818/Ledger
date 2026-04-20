import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DashboardTopbar({ title = "Dashboard", subtitle = "Track your accounts and balances in real time." }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/?auth=login", { replace: true });
  };

  return (
    <header className="relative z-40 border-b border-slate-200/90 bg-white/85 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 overflow-visible">
          <Link to="/dashboard/transfer" className="ui-btn ui-btn-soft hidden px-3 py-2 text-sm md:inline-flex">
            New Transfer
          </Link>
          <Link to="/dashboard/transactions" className="ui-btn ui-btn-soft hidden px-3 py-2 text-sm md:inline-flex">
            History
          </Link>

          <div className="relative z-50">
            <button
              type="button"
              onClick={() => setOpen((state) => !state)}
              className="flex max-w-[220px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/40"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-xs font-semibold text-slate-900">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="truncate">{user?.name || "Profile"}</span>
            </button>

            {open ? (
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Account</div>
                <div className="rounded-lg bg-slate-50 px-3 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Full name</div>
                  <div className="mt-1 break-words text-sm font-bold text-slate-900">{user?.name || "User"}</div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Email</div>
                  <div className="mt-1 break-all text-sm text-slate-700">{user?.email || "-"}</div>
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardTopbar;
