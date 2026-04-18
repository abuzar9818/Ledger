import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "Simple Dashboard",
    description: "See balances, account status, and quick actions without hunting through screens.",
  },
  {
    title: "Transfers In Minutes",
    description: "Send immediate transfers or set scheduled transfers from the same workspace.",
  },
  {
    title: "Clear History",
    description: "Browse transaction activity with filters that stay readable even on mobile.",
  },
];

const workflowSteps = [
  {
    title: "Sign In",
    description: "Secure auth keeps the entry fast while landing each role in the right workspace.",
  },
  {
    title: "Move Funds",
    description: "Use transfer and scheduling flows that guide you with clear form fields.",
  },
  {
    title: "Track Activity",
    description: "Review every transaction and schedule status from one consistent interface.",
  },
];

function HomePage() {
  return (
    <div className="space-y-8 pb-12 pt-2">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">
              Modern Ledger UX
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              Money management without visual noise
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
              Ledger now gives you a cleaner journey from home to dashboard, transfer, scheduling, and history.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/auth/register" className="ui-btn rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                Create Account
              </Link>
              <Link to="/auth/login" className="ui-btn rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Login
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              "Better spacing and readability",
              "Cleaner auth and dashboard flow",
              "Consistent actions on desktop and mobile",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <article key={card.title} className="ui-card p-5">
            <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="ui-card p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">User Flow</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">From sign-in to transaction clarity</h2>
          </div>
          <Link to="/dashboard" className="ui-btn ui-btn-soft px-4 py-2 text-sm">
            Open Dashboard
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{step.title}</p>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-teal-700 via-slate-900 to-amber-500 px-6 py-9 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">Start with the improved experience</h2>
            <p className="mt-2 text-sm text-slate-100">Create an account and explore the refreshed dashboard and transfer UX.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth/register" className="ui-btn rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Register
            </Link>
            <Link to="/auth/login" className="ui-btn rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
