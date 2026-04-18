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

const workflowSteps = [
  {
    title: "Authenticate Once",
    description: "Sign in with a secure token flow and land on the right workspace instantly.",
  },
  {
    title: "Move Money Confidently",
    description: "Submit transfers with sender, receiver, category, and validation baked in.",
  },
  {
    title: "Track Every Change",
    description: "Read your transaction timeline and inspect balances without leaving the app.",
  },
];

const faqItems = [
  {
    question: "Can I switch between dashboard areas quickly?",
    answer: "Yes. The navigation is designed to keep dashboard, transfer, and history surfaces one click away.",
  },
  {
    question: "Does the app show account balances?",
    answer: "Yes. The dashboard loads your accounts and fetches balances per account for clear visibility.",
  },
  {
    question: "Is login and register available from the home page?",
    answer: "Yes. The navbar and hero both include clear entry points to login and registration.",
  },
];

function HomePage() {
  return (
    <div className="space-y-20 pb-14 pt-3">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-6 py-14 text-white shadow-2xl sm:px-10 sm:py-16">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
            Ledger Platform
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              A High-Trust Financial Workspace For Modern Ledger Operations
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200/95 sm:text-lg">
              Manage accounts, transfer funds, and track transaction outcomes from a clean interface
              designed for speed, clarity, and confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth/register"
                className="rounded-md bg-gradient-to-r from-teal-400 to-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:from-teal-300 hover:to-amber-200"
              >
                Create Account
              </Link>
              <Link
                to="/auth/login"
                className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">99.95%</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-200">Reliable Uptime</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">Real-Time</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-200">Balance Visibility</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">Secure</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-200">Token Auth Flows</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="ui-surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Accounts</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">Clear portfolio overview</p>
          <p className="mt-2 text-sm text-slate-600">See all your accounts and balances in one readable view.</p>
        </article>
        <article className="ui-surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Transfers</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">Fast money movement</p>
          <p className="mt-2 text-sm text-slate-600">Create categorized transactions with a simple, guided flow.</p>
        </article>
        <article className="ui-surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">History</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">Readable timelines</p>
          <p className="mt-2 text-sm text-slate-600">Filter by status and category without losing context.</p>
        </article>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Why Teams Pick Ledger</h2>
          <p className="text-sm text-slate-500">Reliable, transparent, and practical.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="ui-surface rounded-2xl p-5 transition hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ui-surface rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">One Platform, End-to-End Flow</h2>
            <p className="mt-1 text-sm text-slate-600">Everything is arranged to keep the financial journey simple.</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Designed For Speed</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <div key={step.title} className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 0{index + 1}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{step.title}</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="ui-surface rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">What You Get</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">A crisp, readable product feel</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            The layout uses depth, gradients, and spacious cards so the application feels like a modern
            financial tool instead of a starter template.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Polished hero section",
              "Responsive navigation",
              "Readable cards and states",
              "Clear login entry points",
            ].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="ui-surface rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Performance Snapshot</p>
          <div className="mt-4 space-y-4">
            {[
              { label: "Account Visibility", value: "High" },
              { label: "Transaction Clarity", value: "Strong" },
              { label: "Action Confidence", value: "Fast" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-amber-400" style={{ width: item.value === "High" ? "88%" : item.value === "Strong" ? "92%" : "80%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ui-surface rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Customer Notes</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Why the interface feels easy to use</h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">Built around clarity, hierarchy, and fast decision making.</p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm leading-relaxed text-slate-700">
              “The dashboard tells you exactly where you are and what to do next. It feels more like a product than an admin panel.”
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-900">Product Team Feedback</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm leading-relaxed text-slate-700">
              “The home page now clearly explains the value, and the buttons guide users straight into the right flow.”
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-900">UI Review Note</p>
          </div>
        </div>
      </section>

      <section className="ui-surface rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-teal-600 via-slate-900 to-amber-500 px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Ready To Start</p>
            <h2 className="mt-2 text-3xl font-bold">Create your account and get into the workspace.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-100/95">
              Login or register from the navbar, then move directly into your dashboard, transfer flow, and transaction history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/auth/register"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create Account
            </Link>
            <Link
              to="/auth/login"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
