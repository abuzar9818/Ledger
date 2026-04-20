import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "Calm Dashboard",
    description: "Portfolio summary, account status, and fast actions without clutter.",
  },
  {
    title: "Fast Transfers",
    description: "Create instant or scheduled transfers from one workflow.",
  },
  {
    title: "Readable History",
    description: "Track activity in a clean, filterable timeline made for desktop and mobile.",
  },
  {
    title: "Automation",
    description: "Recurring transfer setup with status-aware controls.",
  },
  {
    title: "Admin Controls",
    description: "Freeze/unfreeze and approval flows with audit-ready actions.",
  },
  {
    title: "Role-Aware UX",
    description: "Users, admins, and system automation each get the right journey.",
  },
];

const workflowSteps = [
  {
    title: "Open Workspace",
    description: "Use modal login/register without leaving the page context.",
  },
  {
    title: "Create Movement",
    description: "Send immediate money or configure recurring schedules.",
  },
  {
    title: "Review Signals",
    description: "See balances, statuses, and monthly summary in one rhythm.",
  },
];

const quickStats = [
  { label: "Live Dashboard", value: "Real-Time" },
  { label: "Schedule Modes", value: "3" },
  { label: "Secure Access", value: "JWT + Cookie" },
  { label: "Mobile Ready", value: "Yes" },
];

const faqs = [
  {
    question: "Can I access login/register from any page?",
    answer: "Yes. Navbar and footer actions open authentication in a modal so you stay in context.",
  },
  {
    question: "How are transfers tracked?",
    answer: "Every transfer appears in transaction history with status, category, and reversal handling.",
  },
  {
    question: "What does monthly summary show?",
    answer: "Current-month total credits, total debits, and transaction count for your accounts.",
  },
];

function HomePage() {
  return (
    <div className="space-y-10 pb-16 pt-2">
      <section id="hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-teal-700 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
        <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-50">
              Better UX, Faster Actions
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              A cleaner banking workspace built for focus
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-teal-50 sm:text-base">
              Manage accounts, move money, automate recurring transfers, and review transaction signals from one consistent interface.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/?auth=register" className="ui-btn rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                Create Account
              </Link>
              <Link to="/?auth=login" className="ui-btn rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Login
              </Link>
              <Link to="/dashboard" className="ui-btn rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-3 animate-fade-up-delay">
            {quickStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-teal-50/80">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Feature Stack</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Everything in one rhythm</h2>
          </div>
          <Link to="/dashboard/transactions" className="ui-btn ui-btn-soft px-4 py-2 text-sm">
            See Activity
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="ui-card p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="ui-card p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workflow</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">From entry to execution</h2>
          </div>
          <Link to="/dashboard/scheduled-transfers" className="ui-btn ui-btn-soft px-4 py-2 text-sm">
            Scheduled Transfers
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

      <section id="showcase" className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ui-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Dashboard Experience</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Designed to reduce friction</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Cleaner hierarchy, stronger spacing, and focused quick-actions make it easier to move through balance checks,
            transfers, schedules, and history without context switching.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-teal-50 p-4">
              <p className="text-xs uppercase tracking-wide text-teal-700">Navigation</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Section links and action links now work from navbar/footer.</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs uppercase tracking-wide text-amber-700">Authentication</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Login and registration now open in a modal flow.</p>
            </div>
          </div>
        </div>

        <div className="ui-card bg-gradient-to-b from-slate-900 to-teal-800 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Ready To Start</p>
          <h3 className="mt-2 text-2xl font-black">Open account access in one click</h3>
          <p className="mt-2 text-sm text-teal-50">Jump in without leaving this page and continue exactly where you started.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/?auth=register" className="ui-btn rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">
              Register
            </Link>
            <Link to="/?auth=login" className="ui-btn rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FAQ</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Quick answers</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <article key={item.question} className="ui-card p-5">
              <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-teal-700 via-slate-900 to-amber-500 px-6 py-9 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">Move from homepage to action instantly</h2>
            <p className="mt-2 text-sm text-slate-100">Use modal auth to enter fast, then continue in the improved dashboard workflow.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/?auth=register" className="ui-btn rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Get Started
            </Link>
            <Link to="/?auth=login" className="ui-btn rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
