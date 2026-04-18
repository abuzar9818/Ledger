import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
    setMobileOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 text-slate-900 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="brand-chip rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Fin
          </span>
          Ledger
        </Link>
        <div className="hidden items-center gap-2 text-sm font-medium md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Dashboard
              </Link>

              {user?.role === "ADMIN" ? (
                <Link to="/admin" className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                  Admin
                </Link>
              ) : null}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/auth/register"
                className="rounded-md bg-gradient-to-r from-teal-500 to-amber-400 px-3 py-2 font-semibold text-slate-900 transition hover:from-teal-400 hover:to-amber-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((state) => !state)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          Menu
        </button>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium">
            <Link to="/" onClick={closeMobileMenu} className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMobileMenu} className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                  Dashboard
                </Link>
                {user?.role === "ADMIN" ? (
                  <Link to="/admin" onClick={closeMobileMenu} className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                    Admin
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={closeMobileMenu} className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                  Login
                </Link>
                <Link to="/auth/register" onClick={closeMobileMenu} className="rounded-md bg-gradient-to-r from-teal-500 to-amber-400 px-3 py-2 font-semibold text-slate-900 transition hover:from-teal-400 hover:to-amber-300">
                  Register
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
