import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "Real-Time Account Overview",
    description: "Track all your accounts with live balance snapshots and clear status indicators.",
  },
  {
    title: "Fast Money Movement",
    description: "Create categorized transfers in seconds with robust transaction validation.",
  },
  {
    title: "Actionable History",
    description: "Review timeline-based transaction history with quick category and status filtering.",
  },
];

function HomePage() {
  return (
    <div className="space-y-14 pb-10 pt-2">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-12 text-white sm:px-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Ledger Platform</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            A Focused Financial Workspace Built For Secure Daily Operations
          </h1>
          <p className="mt-5 max-w-2xl text-slate-200">
            Manage accounts, transfer funds, and track transaction outcomes from a clean interface
            designed for speed and clarity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth/register"
              className="rounded-md bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Create Account
            </Link>
            <Link
              to="/auth/login"
              className="rounded-md border border-cyan-200/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Why Teams Pick Ledger</h2>
          <p className="text-sm text-slate-500">Reliable, transparent, and practical.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">One Platform, End-to-End Flow</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 1</p>
            <p className="mt-2 text-sm font-medium text-slate-800">Authenticate securely and access your workspace.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 2</p>
            <p className="mt-2 text-sm font-medium text-slate-800">Transfer money with category tagging and validation rules.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 3</p>
            <p className="mt-2 text-sm font-medium text-slate-800">Monitor your transaction timeline and account balances.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
