import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../dashboard/NotificationDropdown";

const guestLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/#workflow" },
  { label: "FAQ", to: "/#faq" },
];

const userLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transfer", to: "/dashboard/transfer" },
  { label: "Scheduled", to: "/dashboard/scheduled-transfers" },
  { label: "Transactions", to: "/dashboard/transactions" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const openAuthModal = (mode) => {
    navigate(`/?auth=${mode}`);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/?auth=login", { replace: true });
    setMobileOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 text-slate-900 backdrop-blur-md">
      <nav className="ui-container flex items-center justify-between py-3 sm:py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="brand-chip rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Fin
          </span>
          Ledger
        </Link>

        <div className="hidden items-center gap-1.5 text-sm font-medium md:flex">
          {(isAuthenticated ? [{ label: "Home", to: "/" }, ...userLinks] : guestLinks).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              {user?.role === "ADMIN" ? (
                <Link to="/admin" className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                  Admin
                </Link>
              ) : null}

              <div className="flex items-center gap-4 ml-2">
                <NotificationDropdown />
                
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/40"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-xs font-semibold text-slate-900">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <span className="truncate font-semibold max-w-[100px]">{user?.name || "Profile"}</span>
                  </button>

                  <div className="absolute right-0 top-[calc(100%+8px)] z-[90] w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Account</div>
                    <div className="rounded-lg bg-slate-50 px-3 py-3 mb-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Full name</div>
                      <div className="mt-1 break-words text-sm font-bold text-slate-900">{user?.name || "User"}</div>
                      <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Email</div>
                      <div className="mt-1 break-all text-xs text-slate-700">{user?.email || "-"}</div>
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
                </div>
              </div>
            </>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="ui-btn ui-btn-soft px-3 py-2"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="ui-btn rounded-lg bg-gradient-to-r from-teal-500 to-amber-400 px-3.5 py-2 font-semibold text-slate-900 shadow-sm transition hover:from-teal-400 hover:to-amber-300"
              >
                Start Free
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((state) => !state)}
          className="ui-btn ui-btn-soft px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
        >
          Menu
        </button>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-slate-200/90 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium">
            {isAuthenticated ? (
              <>
                <Link to="/" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                  Home
                </Link>
                {userLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                    {link.label}
                  </Link>
                ))}
                {user?.role === "ADMIN" ? (
                  <Link to="/admin" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                    Admin
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ui-btn ui-btn-soft rounded-lg px-3 py-2 text-left text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {guestLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="ui-btn ui-btn-soft rounded-lg px-3 py-2 text-left"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("register")}
                  className="ui-btn rounded-lg bg-gradient-to-r from-teal-500 to-amber-400 px-3 py-2 text-left font-semibold text-slate-900 transition hover:from-teal-400 hover:to-amber-300"
                >
                  Register
                </button>
                <Link to="/dashboard" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                  Explore Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
