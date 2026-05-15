import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecentTransactionsTable({ transactions = [] }) {
  return (
    <div className="ui-surface rounded-3xl p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <p className="text-sm text-slate-500">Your latest financial activity</p>
        </div>
        <Link to="/dashboard/transactions" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <th className="pb-3 font-semibold">Transaction</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-slate-50/50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{tx.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm text-slate-600">{tx.category}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock size={14} className="text-slate-400" />
                    <span>{tx.date}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? '+' : ''}
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "INR" }).format(tx.amount)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
