import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="ui-container py-9">
        <div className="grid gap-8 md:grid-cols-4 lg:gap-10">
          <div className="md:col-span-2">
            <p className="text-lg font-bold tracking-tight text-slate-900">Ledger</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              A secure financial workspace for account tracking, transfers, and transparent transaction history.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <Link className="block transition hover:text-slate-900" to="/">Home</Link>
              <Link className="block transition hover:text-slate-900" to="/auth/login">Login</Link>
              <Link className="block transition hover:text-slate-900" to="/auth/register">Register</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <Link className="block transition hover:text-slate-900" to="/dashboard">Dashboard</Link>
              <Link className="block transition hover:text-slate-900" to="/dashboard/transfer">Transfers</Link>
              <Link className="block transition hover:text-slate-900" to="/dashboard/scheduled-transfers">Scheduled</Link>
              <Link className="block transition hover:text-slate-900" to="/dashboard/transactions">History</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Ledger App</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">Secure Financial Workspace</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
