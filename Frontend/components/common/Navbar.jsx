import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 text-slate-900 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="brand-chip rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Fin
          </span>
          Ledger
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium">
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
      </nav>
    </header>
  );
}

export default Navbar;
