import { useState } from "react";
import { Search, Lock, Unlock, RefreshCw } from "lucide-react";
import api from "../../services/api";

export default function AccountsUsersTab({ accounts, refreshData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const filteredAccounts = accounts.filter(acc => 
    acc._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.user?.name && acc.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (acc.user?.email && acc.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFreezeUnfreeze = async (accountId, isFrozen) => {
    try {
      setActionLoading(accountId);
      const endpoint = isFrozen ? `/accounts/${accountId}/unfreeze` : `/accounts/${accountId}/freeze`;
      await api.patch(endpoint);
      await refreshData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE": return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">ACTIVE</span>;
      case "FROZEN": return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">FROZEN</span>;
      case "CLOSED": return <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">CLOSED</span>;
      case "PENDING": return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">PENDING</span>;
      default: return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ui-surface rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-white"
            />
          </div>
          <div className="text-sm font-bold text-slate-500">
            {filteredAccounts.length} accounts found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Account ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Currency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAccounts.map((acc) => (
                <tr key={acc._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-600 text-xs">{acc._id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{acc.user?.name || "N/A"}</p>
                    <p className="text-xs text-slate-500">{acc.user?.email || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{acc.currency}</td>
                  <td className="px-6 py-4">{getStatusBadge(acc.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleFreezeUnfreeze(acc._id, acc.status === "FROZEN")}
                      disabled={actionLoading === acc._id || acc.status === "CLOSED" || acc.status === "PENDING" || acc.status === "REJECTED"}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed ${
                        acc.status === "FROZEN" 
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      }`}
                    >
                      {actionLoading === acc._id ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : acc.status === "FROZEN" ? (
                        <><Unlock size={14} /> Unfreeze</>
                      ) : (
                        <><Lock size={14} /> Freeze</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No accounts match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
