import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { CreditCard, Wallet, Lock, Activity, Check, X, RefreshCw, Plus } from "lucide-react";
import { SkeletonLoader, EmptyState } from "../../components/common/UIStates";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      const list = response.data?.accounts || [];
      
      const withBalances = await Promise.all(
        list.map(async (acc) => {
          try {
            const balRes = await api.get(`/accounts/balance/${acc._id}`);
            return { ...acc, balance: balRes.data?.balance ?? 0 };
          } catch {
            return { ...acc, balance: 0 };
          }
        })
      );
      
      setAccounts(withBalances);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const requestClosure = async (accountId) => {
    const reason = window.prompt("Please provide a reason for closing this account (optional):");
    if (reason === null) return; // cancelled

    try {
      setActionLoading(`close-${accountId}`);
      await api.post(`/account-closure-requests/accounts/${accountId}/close-request`, { reason });
      alert("Account closure request submitted successfully. It is pending admin approval.");
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setActionLoading(null);
    }
  };

  const requestReopen = async (accountId) => {
    const reason = window.prompt("Please provide a reason for reopening this account (optional):");
    if (reason === null) return;

    try {
      setActionLoading(`reopen-${accountId}`);
      await api.post(`/account-reopen-requests/accounts/${accountId}/reopen-request`, { reason });
      alert("Account reopen request submitted successfully. It is pending admin approval.");
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE": return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"><Activity size={10} className="inline mr-1" />ACTIVE</span>;
      case "FROZEN": return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"><Lock size={10} className="inline mr-1" />FROZEN</span>;
      case "CLOSED": return <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"><X size={10} className="inline mr-1" />CLOSED</span>;
      case "PENDING": return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">PENDING</span>;
      default: return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <DashboardLayout title="My Accounts" subtitle="Manage your financial accounts and balances.">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ui-surface rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[280px]">
               <div>
                 <SkeletonLoader type="circle" className="h-10 w-10 mb-4" />
                 <SkeletonLoader type="text" rows={1} className="w-1/2 mb-2" />
                 <SkeletonLoader type="text" rows={1} className="w-3/4 mb-6 h-8" />
                 <SkeletonLoader type="text" rows={3} />
               </div>
               <SkeletonLoader type="text" rows={1} className="w-full h-10 mt-4 rounded-xl" />
            </div>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState 
          icon={Wallet}
          title="No Accounts Found"
          description="You don't have any active accounts yet. Your accounts will appear here once approved by an admin."
          action={
             <button className="ui-btn ui-btn-primary px-6 py-2.5 flex items-center gap-2 mx-auto">
               <Plus size={16} /> Open Account
             </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(acc => (
            <div key={acc._id} className="ui-surface p-6 flex flex-col justify-between border border-slate-100 shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-inner text-white">
                    <CreditCard size={20} />
                  </div>
                  {getStatusBadge(acc.status)}
                </div>
                
                <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Savings Account
                </h3>
                <div className="text-3xl font-black tracking-tight text-slate-900 mb-4">
                  {acc.currency === 'USD' ? '$' : acc.currency === 'EUR' ? '€' : acc.currency === 'GBP' ? '£' : '₹'}
                  {acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-500 font-medium">Account ID</span>
                    <span className="font-mono text-slate-700">{acc._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-500 font-medium">Currency</span>
                    <span className="font-bold text-slate-700">{acc.currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2">
                    <span className="text-slate-500 font-medium">Opened</span>
                    <span className="font-medium text-slate-700">{new Date(acc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                {acc.status === 'ACTIVE' && (
                  <button 
                    onClick={() => requestClosure(acc._id)}
                    disabled={actionLoading === `close-${acc._id}`}
                    className="w-full py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === `close-${acc._id}` ? <RefreshCw size={14} className="animate-spin" /> : 'Request Closure'}
                  </button>
                )}
                {acc.status === 'CLOSED' && (
                  <button 
                    onClick={() => requestReopen(acc._id)}
                    disabled={actionLoading === `reopen-${acc._id}`}
                    className="w-full py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === `reopen-${acc._id}` ? <RefreshCw size={14} className="animate-spin" /> : 'Request Reopen'}
                  </button>
                )}
                {acc.status === 'FROZEN' && (
                  <p className="text-xs text-center font-medium text-amber-600 bg-amber-50 py-2 rounded-lg">Account Frozen - Contact Support</p>
                )}
                {acc.status === 'PENDING' && (
                  <p className="text-xs text-center font-medium text-slate-500 bg-slate-50 py-2 rounded-lg">Awaiting Admin Approval</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
