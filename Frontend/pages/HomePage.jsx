import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "More clarity",
    description: "See balances, account state, and activity without visual noise.",
  },
  {
    title: "More control",
    description: "Transfer, schedule, and manage accounts from one focused workspace.",
  },
  {
    title: "More choice",
    description: "Use the product in a way that fits users, admins, and automation flows.",
  },
];

const workflowSteps = [
  {
    title: "Open the app",
    description: "Use modal login or register so the page stays in context.",
  },
  {
    title: "Manage money",
    description: "Move funds, schedule transfers, and review balances with clarity.",
  },
  {
    title: "Stay in control",
    description: "See history, statuses, and account actions in one place.",
  },
];

const productHighlights = [
  {
    title: "Ledger-style overview",
    description: "A premium hero with strong contrast, clear hierarchy, and immediate action buttons.",
  },
  {
    title: "Daily finance flow",
    description: "Fast access to dashboard, transfer, schedule, and transaction history.",
  },
  {
    title: "Trust and proof",
    description: "Happy customers, FAQ, and helpful product messages without long theory blocks.",
  },
  {
    title: "Built for every role",
    description: "User, admin, and system use cases are separated without feeling heavy.",
  },
];

const customerStories = [
  {
    name: "Aarav Mehta",
    role: "Business Owner",
    quote: "The page feels premium now. I can scan it quickly and get to the dashboard faster.",
  },
  {
    name: "Nisha Kapoor",
    role: "Operations Lead",
    quote: "The FAQ and customer proof give the home page a polished product feel.",
  },
  {
    name: "Rohan Shah",
    role: "Finance Manager",
    quote: "The same color palette still feels calm, but the layout is much more interesting.",
  },
  {
    name: "Priya Desai",
    role: "Founder",
    quote: "The new structure looks closer to a modern finance brand and less like a long document.",
  },
];

const faqItems = [
  {
    question: "How do I get started?",
    answer: "Use the login or register modal from the home page, then open the dashboard to begin working.",
  },
  {
    question: "Can I manage transfers and schedules from one place?",
    answer: "Yes. The dashboard links directly to transfer, scheduled transfer, and transaction pages.",
  },
  {
    question: "Does this support admins too?",
    answer: "Yes. Admin users get the same clean visual system with role-aware navigation and controls.",
  },
  {
    question: "Will this work on mobile?",
    answer: "The home page and dashboard are responsive and keep the same visual language on smaller screens.",
  },
];

const trustStats = [
  { value: "12K+", label: "happy customers" },
  { value: "99.9%", label: "uptime target" },
  { value: "3", label: "primary actions" },
];

function HomePage() {
  return (
    <div className="space-y-10 pb-16 pt-2">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-950 to-teal-700 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
        <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-fade-up">
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-50">
              Ledger-inspired experience
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Upgrade your banking experience with a cleaner, calmer homepage
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-teal-50 sm:text-base lg:text-lg">
              The new home page uses the same current colors but follows a more polished product style: strong hero,
              clear feature blocks, happy customer proof, FAQ, and smoother call-to-action flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/?auth=register" className="ui-btn rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                Create account
              </Link>
              <Link to="/?auth=login" className="ui-btn rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Login
              </Link>
              <Link to="/dashboard" className="ui-btn rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-3 animate-fade-up-delay">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-50/75">Live summary</p>
              <div className="mt-4 rounded-[1.3rem] bg-white/90 p-4 text-slate-900 shadow-lg">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Balance snapshot</p>
                <p className="mt-2 text-3xl font-black text-slate-950">₹1,02,900.00</p>
                <p className="mt-2 text-sm text-slate-600">Immediate clarity for balances, status, and quick actions.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {trustStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-teal-50/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((card, index) => (
          <article
            key={card.title}
            className="ui-card animate-fade-up p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="ui-card p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Why it works</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">A homepage that feels like a real product</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            The structure follows a modern finance landing page pattern: a bold hero, a few focused benefit blocks,
            product-like sections, social proof, and a useful FAQ. It stays long, but it does not feel heavy.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {productHighlights.map((item) => (
              <article key={item.title} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 h-1.5 w-12 rounded-full bg-gradient-to-r from-teal-500 to-amber-400" />
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.6rem] bg-gradient-to-b from-slate-900 via-teal-900 to-teal-700 p-6 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Daily use</p>
          <h3 className="mt-2 text-2xl font-black">Built for everyday finance tasks</h3>
          <div className="mt-5 space-y-3">
            {[
              "Check balances without visual noise",
              "Send money or schedule it for later",
              "Review history in a clear timeline",
              "Use the dashboard with less friction",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">✓</span>
                <p className="text-sm text-teal-50">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/?auth=register" className="ui-btn rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Start now
            </Link>
            <Link to="/dashboard" className="ui-btn rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Go to dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Happy customers</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Countless happy customers</h2>
          </div>
          <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:inline-flex">
            Social proof
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {customerStories.map((story, index) => (
            <article
              key={story.name}
              className="ui-card animate-fade-up p-5"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-amber-400 text-sm font-black text-slate-950">
                  {story.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">{story.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{story.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">“{story.quote}”</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ui-card p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How it flows</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">From sign in to activity tracking</h2>
          </div>
          <Link to="/dashboard/scheduled-transfers" className="ui-btn ui-btn-soft px-4 py-2 text-sm">
            Scheduled transfers
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

      <section className="space-y-4" id="faq">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FAQ</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Answers in a cleaner format</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.map((item, index) => (
            <article
              key={item.question}
              className="ui-card animate-fade-up p-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-gradient-to-r from-teal-700 via-slate-900 to-amber-500 px-6 py-9 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Open the modal and start in one click</h2>
            <p className="mt-2 text-sm text-slate-100 sm:text-base">
              Keep the experience fast with login and registration in a modal while the home page stays focused on the product.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/?auth=register" className="ui-btn rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Get started
            </Link>
            <Link to="/?auth=login" className="ui-btn rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
