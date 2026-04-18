import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -right-24 top-6 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-6 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="ui-surface rounded-3xl p-1 shadow-2xl">
          <div className="rounded-[1.35rem] bg-white px-5 py-6 sm:px-7 sm:py-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Ledger Access</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Secure sign in</h2>
                <p className="mt-1 text-sm text-slate-600">Login or register to enter your financial workspace.</p>
              </div>
              <span className="brand-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
                Fin
              </span>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
