import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

              <button
                type="button"
                onClick={handleLogout}
                className="ui-btn ui-btn-soft ml-1 px-3 py-2 text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
              >
                Logout
              </button>
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
