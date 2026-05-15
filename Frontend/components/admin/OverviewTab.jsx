import { Users, Wallet, CheckSquare, AlertCircle } from "lucide-react";

export default function OverviewTab({ stats }) {
  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Active Accounts", value: stats.activeAccounts, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending Requests", value: stats.pendingRequests, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Resolved Logs", value: stats.totalLogs, icon: CheckSquare, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="ui-surface rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition hover:shadow-md">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ui-surface rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">System Overview</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Welcome to the enterprise administration panel. From here, you can manage user access, freeze accounts in cases of suspected fraud, review audit logs to maintain strict compliance, and handle all incoming account status requests (like reopening and closing accounts). 
        </p>
      </div>
    </div>
  );
}
