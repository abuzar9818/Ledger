function DashboardTopbar({ title = "Dashboard", subtitle = "Track your accounts and balances in real time." }) {
  return (
    <header className="relative z-30 border-b border-slate-200/90 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center justify-between gap-3 overflow-visible">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

export default DashboardTopbar;
