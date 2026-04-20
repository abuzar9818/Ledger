import { useState } from "react";
import { motion } from "framer-motion";
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
  {
    question: "Is my account data secure?",
    answer: "Authentication, role-based controls, and backend validation are designed to keep account and transaction flows protected.",
  },
  {
    question: "Can I track monthly activity quickly?",
    answer: "Yes. Use transaction history and monthly summary endpoints to monitor debit, credit, and transaction volume.",
  },
];

const trustStats = [
  { value: "12K+", label: "happy customers" },
  { value: "99.9%", label: "uptime target" },
  { value: "3", label: "primary actions" },
];

const marqueeStories = [...customerStories, ...customerStories];

function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="space-y-10 pb-12 pt-2">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-950 to-teal-700 px-6 py-12 text-white shadow-2xl sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl animate-float-soft" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl animate-float-soft" />

        <div className="relative grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="animate-fade-up max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-50">
              Ledger-inspired experience
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              A calmer way to manage money, accounts, and movement
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base lg:text-lg">
              The homepage keeps the same color palette while giving each section more space, cleaner flow, and a more
              premium feel.
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

          <div className="grid gap-4 animate-fade-up-delay">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-50/75">Live summary</p>
              <div className="mt-5 rounded-[1.4rem] bg-white/90 p-5 text-slate-900 shadow-lg">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Balance snapshot</p>
                <p className="mt-2 text-3xl font-black text-slate-950">₹XX,XXX.XX</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Fast balance visibility, cleaner actions, and less noise.</p>
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

      <section className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {featureCards.map((card, index) => (
          <article
            key={card.title}
            className="ui-card animate-fade-up p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r from-teal-500 to-amber-400" />
            <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="ui-card p-6 sm:p-7 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workflow</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">A horizontal flow chart for the core journey</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The workflow is laid out horizontally on larger screens with strong spacing between each step so it reads
            like a clean process line instead of a crowded card group.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto pb-1">
          <div className="min-w-[980px]">
            <div className="relative flex items-start gap-6">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="relative flex-1">
                  {index < workflowSteps.length - 1 ? (
                    <div className="absolute left-[58%] right-[-42%] top-6 h-px bg-gradient-to-r from-teal-300 via-amber-300 to-teal-300" />
                  ) : null}

                  <div className="relative z-10 rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-sm font-black text-slate-950">
                        {index + 1}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-7">
        <div className="ui-card p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Daily use</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">Built for everyday finance tasks</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This section stays light and open while still showing the essential things people do every day.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Check balances without visual noise",
              "Send transfers or schedule them later",
              "Review history and statuses in one place",
              "Move through the app without extra clutter",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-amber-400 text-sm font-black text-slate-950">✓</span>
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-gradient-to-b from-slate-900 via-teal-900 to-teal-700 p-6 text-white shadow-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Product focus</p>
          <h3 className="mt-2 text-2xl font-black">Open, premium, and easy to scan</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-teal-50">
            Keep the space breathable so the product feels modern, with room around each card and enough contrast to
            guide attention without making the page feel heavy.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-sm">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"
              alt="Finance dashboard app on screen"
              className="h-44 w-full rounded-xl object-cover"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/?auth=register" className="ui-btn rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Start now
            </Link>
            <Link to="/dashboard" className="ui-btn rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Go to dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 px-5 py-8 text-white shadow-2xl sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">Happy customers</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">What people are saying</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Real user feedback in a moving testimonial rail powered by Framer Motion.
          </p>
        </div>

        <div className="relative mt-6 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-slate-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-teal-900 to-transparent" />

          <motion.div
            className="flex gap-4"
            animate={{ x: [0, -980] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {marqueeStories.map((story, index) => (
              <motion.article
                key={`${story.name}-${index}`}
                className="w-[320px] flex-shrink-0 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm"
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-amber-400 text-sm font-black text-slate-950">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{story.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-teal-100/75">{story.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-100">“{story.quote}”</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-950 to-teal-700 px-5 py-8 text-white shadow-2xl sm:px-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr]" id="faq">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">FAQ</p>
          <h2 className="mt-2 text-3xl font-black text-white">Common inquiries</h2>
          <p className="mt-3 text-sm leading-7 text-slate-100">
            Everything you need to know about using the Ledger app experience.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2">
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
              alt="Mobile finance app dashboard"
              className="h-52 w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.article
              key={item.question}
              className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex((prev) => (prev === index ? -1 : index))}
                className="flex w-full items-center justify-between px-5 py-5 text-left sm:px-6"
              >
                <h3 className="text-base font-bold text-white">{item.question}</h3>
                <span className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                  {openFaqIndex === index ? "-" : "+"}
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openFaqIndex === index ? "auto" : 0,
                  opacity: openFaqIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm leading-7 text-slate-100 sm:px-6">{item.answer}</p>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-gradient-to-r from-teal-700 via-slate-900 to-amber-500 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Open the modal and start in one click</h2>
            <p className="mt-2 text-sm text-slate-100 sm:text-base">
              Login and registration stay fast in a modal, while the page keeps its open, premium feel.
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
