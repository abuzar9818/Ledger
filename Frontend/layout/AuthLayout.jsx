import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -right-28 top-8 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-2 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-2xl backdrop-blur-sm lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-10 text-white lg:block">
          <p className="brand-chip inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
            Welcome
          </p>
          <h2 className="mt-5 text-3xl font-bold leading-tight">
            Access Your Ledger Workspace With Confidence
          </h2>
          <p className="mt-4 max-w-sm text-sm text-slate-200">
            Authenticate securely, move funds quickly, and monitor account activity in one place.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="ui-surface rounded-xl p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
