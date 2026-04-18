import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DashboardTopbar({ title = "Dashboard", subtitle = "Track your accounts and balances in real time." }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((state) => !state)}
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/40"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-xs font-semibold text-slate-900">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <span>{user?.name || "Profile"}</span>
          </button>

          {open ? (
            <div className="absolute right-0 z-20 mt-2 w-52 rounded-md border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur-sm">
              <div className="px-2 py-1 text-xs text-slate-500">Signed in as</div>
              <div className="px-2 pb-2 text-sm font-medium text-slate-800">{user?.email || "-"}</div>
              <div className="border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded px-2 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default DashboardTopbar;
