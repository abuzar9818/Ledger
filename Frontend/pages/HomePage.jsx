import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MonitorPlay, CheckSquare, ListChecks, Settings2, Wallet, BarChart2, Send } from "lucide-react";

const workflowSteps = [
  {
    title: "Deploy Infrastructure",
    description: "Provision secure accounts and define organizational hierarchies instantly.",
    icon: <Wallet className="text-[#2563eb]" size={24} />
  },
  {
    title: "Capital Allocation",
    description: "Monitor balances, enforce strict budgets, and analyze macro trends.",
    icon: <BarChart2 className="text-[#2563eb]" size={24} />
  },
  {
    title: "Execute & Settle",
    description: "Process high-volume transfers with cryptographic certainty.",
    icon: <Send className="text-[#2563eb]" size={24} />
  },
];

const customerStories = [
  {
    name: "Aarav Mehta",
    role: "Director of Finance",
    company: "Stratos Inc.",
    quote: "Ledger eliminated our reconciliation bottlenecks. The platform is phenomenally robust and transparent.",
  },
  {
    name: "Nisha Kapoor",
    role: "Operations Lead",
    company: "Vanguard Tech",
    quote: "The interface is dense with data yet never feels overwhelming. A masterclass in enterprise design.",
  },
  {
    name: "Rohan Shah",
    role: "VP Treasury",
    company: "Global Logistics",
    quote: "We execute thousands of transfers daily. Ledger handles the volume with absolute precision.",
  },
  {
    name: "Priya Desai",
    role: "Managing Partner",
    company: "Apex Capital",
    quote: "Role-based controls and comprehensive audit trails are non-negotiable for us. Ledger delivers.",
  },
];

const faqItems = [
  {
    question: "How is the data secured?",
    answer: "All data is encrypted at rest and in transit. We utilize strict role-based access controls and maintain immutable audit logs for all administrative actions.",
  },
  {
    question: "Does Ledger support high-volume transaction processing?",
    answer: "Yes, our infrastructure is designed to handle enterprise-scale throughput with robust rate-limiting and optimization techniques.",
  },
  {
    question: "Can we set strict departmental budgets?",
    answer: "Absolutely. The Budget Planner module allows you to define granular limits per category and track expenditure in real-time.",
  },
  {
    question: "What administrative controls are available?",
    answer: "Admins have complete oversight over account lifecycles, user permissions, and system-wide freezes in case of security anomalies.",
  },
];

const marqueeStories = [...customerStories, ...customerStories];

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="bg-[#f4f7fa] font-sans overflow-hidden relative selection:bg-blue-200">
      
      {/* Background Dotted Pattern (SVG) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center opacity-40 h-[1000px]">
        <svg width="200%" height="1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotted-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#e2e8f0" />
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="mask">
              <rect width="100%" height="100%" fill="url(#fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" mask="url(#mask)" />
        </svg>
      </div>

      {/* Floating Background Circles */}
      <div className="absolute top-[200px] left-[10%] w-12 h-12 rounded-full bg-[#e8edf5] z-0"></div>
      <div className="absolute top-[300px] right-[45%] w-6 h-6 rounded-full bg-[#e8edf5] z-0"></div>
      <div className="absolute top-[600px] right-[15%] w-10 h-10 rounded-full bg-[#e8edf5] z-0"></div>

      {/* HERO SECTION */}
      <div className="border-b border-slate-200/50 w-full relative z-10">
        <div className="ui-container pt-20 lg:pt-32 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#2563eb] text-sm font-bold tracking-[0.15em] uppercase mb-4"
              >
                Ledger Enterprise 2.0
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-[4.5rem] font-black text-[#1e293b] leading-[1.05] tracking-tight mb-6"
              >
                Smart and Safe <br />Finance for You
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#475569] font-medium mb-10 max-w-md leading-relaxed"
              >
                Manage budgets, process transfers, and control your finances in just one workspace, round the clock.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/?auth=register" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3.5 rounded-full font-bold transition shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:-translate-y-0.5">
                  Open Account
                </Link>
                <Link to="/dashboard" className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-3.5 rounded-full font-bold transition shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:-translate-y-0.5">
                  View Dashboard
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Floating 3D Cards */}
            <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center pointer-events-none mt-12 lg:mt-0">
              {/* Soft Glow behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#10b981]/15 rounded-full blur-[80px]"></div>

              {/* Top Card (Green) */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [12, 14, 12] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] lg:-right-8 w-[280px] h-[170px] bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl shadow-2xl shadow-[#10b981]/40 border border-[#34d399] p-5 text-white flex flex-col justify-between"
                style={{ transformStyle: 'preserve-3d', zIndex: 10 }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-black text-lg tracking-wider">BANK</span>
                  <span className="font-bold text-xs uppercase tracking-widest text-[#a7f3d0]">Credit Card</span>
                </div>
                <div>
                  <div className="w-10 h-8 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-md mb-4 opacity-90 shadow-inner"></div>
                  <div className="font-mono text-lg tracking-[0.2em] mb-2 drop-shadow-md">0000 0017 0065 004</div>
                  <div className="flex justify-between text-[10px] uppercase font-semibold text-[#a7f3d0]">
                    <span>1234</span>
                    <div className="flex gap-4">
                      <span className="flex flex-col"><span>Valid Thru</span><span className="text-white text-xs">02/02</span></span>
                      <span className="flex flex-col"><span>Valid Thru</span><span className="text-white text-xs">02/03</span></span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Card (Darker Green) */}
              <motion.div
                animate={{ y: [10, -10, 10], rotate: [-25, -23, -25] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[10%] left-0 lg:-left-8 w-[320px] h-[190px] bg-[#0f766e] rounded-2xl shadow-2xl shadow-[#0f766e]/40 border border-[#14b8a6] p-0 text-white overflow-hidden"
                style={{ transformStyle: 'preserve-3d', zIndex: 5 }}
              >
                {/* Magnetic Stripe */}
                <div className="w-full h-10 bg-[#0f172a] mt-6 opacity-80"></div>
                {/* Signature Strip */}
                <div className="flex gap-2 px-6 mt-4">
                    <div className="h-8 bg-[#ccfbf1] flex-1 rounded-sm flex items-center px-2">
                      <div className="w-full border-t border-[#99f6e4] border-dashed"></div>
                    </div>
                </div>
                <div className="px-6 mt-4 text-[6px] text-[#5eead4] leading-tight text-justify opacity-60 font-medium font-sans">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.
                </div>
              </motion.div>
              
              {/* Floating Money Elements */}
              <motion.div
                animate={{ y: [-20, 20, -20], rotate: [-10, -5, -10], x: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-0 right-[40%] w-[80px] h-[40px] bg-[#dcfce7] rounded border border-[#86efac] shadow-lg flex items-center justify-center opacity-80"
                style={{ zIndex: 1 }}
              >
                <div className="w-8 h-8 rounded-full border border-[#86efac] opacity-50"></div>
              </motion.div>
              <motion.div
                animate={{ y: [20, -20, 20], rotate: [15, 25, 15], x: [10, -10, 10] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-10 -right-10 w-[90px] h-[45px] bg-[#dcfce7] rounded border border-[#86efac] shadow-lg flex items-center justify-center opacity-80 blur-[1px]"
                style={{ zIndex: 20 }}
              >
                <div className="w-10 h-10 rounded-full border border-[#86efac] opacity-50"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 FEATURE CARDS ROW */}
      <div className="w-full relative z-10 border-b border-slate-200/50" id="features">
        <div className="ui-container pt-16 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MonitorPlay size={28} className="text-[#2563eb]" strokeWidth={1.5} />, title: "Real-time Tracking" },
              { icon: <CheckSquare size={28} className="text-[#2563eb]" strokeWidth={1.5} />, title: "Instant Transfers" },
              { icon: <ListChecks size={28} className="text-[#2563eb]" strokeWidth={1.5} />, title: "Budget Planning" },
              { icon: <Settings2 size={28} className="text-[#2563eb]" strokeWidth={1.5} />, title: "Admin Console" }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform border border-transparent hover:border-slate-100"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-[#f0f5ff] flex items-center justify-center mb-5">
                  {card.icon}
                </div>
                <h3 className="text-[15px] font-bold text-[#1e293b]">{card.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full border-b border-slate-200/50 relative z-10" id="workflow">
        <div className="ui-container py-24">
          <div className="max-w-3xl text-center mx-auto mb-16">
            <p className="text-[#2563eb] text-sm font-bold tracking-[0.15em] uppercase mb-4">How it works</p>
            <h2 className="text-3xl font-black text-[#1e293b] sm:text-4xl tracking-tight">Streamlined financial workflow</h2>
            <p className="mt-4 text-base text-[#475569]">
              From registration to managing complex budgets, everything is designed to save you time.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-green-100 to-blue-100"></div>
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-blue-900/5 border border-[#e2e8f0] mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#eff6ff] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <span className="inline-block bg-white text-[#2563eb] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-[#e2e8f0] shadow-sm">Step {index + 1}</span>
                <h3 className="text-lg font-bold text-[#1e293b] mb-2">{step.title}</h3>
                <p className="text-sm text-[#475569] font-medium leading-relaxed max-w-[250px]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USER REVIEWS (MOTION MARQUEE) */}
      <section className="py-24 border-b border-slate-200/50 bg-white w-full relative z-10 overflow-hidden">
        <div className="ui-container mb-12 text-center">
          <h2 className="text-3xl font-black text-[#1e293b]">Trusted by operators globally</h2>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            className="flex gap-6 px-4"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {marqueeStories.map((story, index) => (
              <div
                key={`${story.name}-${index}`}
                className="w-[320px] flex-shrink-0 rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 hover:shadow-lg transition-shadow cursor-default"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1e293b]">{story.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-[#64748b]">{story.role}, {story.company}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#475569] font-medium">"{story.quote}"</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full relative z-10" id="faq">
        <div className="ui-container py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] items-start">
            <div className="sticky top-24">
              <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">Frequently asked questions</h2>
              
              {/* Circular FAQ image */}
              <div className="mt-8 mb-6 relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-8 border-white bg-[#f8fafc]">
                <img 
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" 
                  alt="Banking interface" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] font-medium max-w-md">
                Everything you need to know about Ledger's enterprise features. Can't find the answer you're looking for? Contact our support team.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.article
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-[#3b82f6]"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex((prev) => (prev === index ? -1 : index))}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <h3 className="text-base font-bold text-[#1e293b]">{item.question}</h3>
                    <span className={`flex-shrink-0 ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${openFaqIndex === index ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-[#f8fafc] text-[#64748b]'}`}>
                      {openFaqIndex === index ? "-" : "+"}
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: openFaqIndex === index ? "auto" : 0, opacity: openFaqIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-[#475569] font-medium border-t border-slate-50 pt-4">{item.answer}</p>
                  </motion.div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
