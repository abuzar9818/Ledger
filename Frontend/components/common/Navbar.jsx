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
    <header className="bg-slate-900 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold">
          Ledger
        </Link>
        <div className="flex gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-slate-300">
                Dashboard
              </Link>

              {user?.role === "ADMIN" ? (
                <Link to="/admin" className="hover:text-slate-300">
                  Admin
                </Link>
              ) : null}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-slate-700 px-2 py-1 transition hover:border-slate-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hover:text-slate-300">
                Login
              </Link>
              <Link to="/auth/register" className="hover:text-slate-300">
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
