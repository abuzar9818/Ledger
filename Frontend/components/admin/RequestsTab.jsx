import { useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import api from "../../services/api";

export default function RequestsTab({ 
  pendingAccounts, closureRequests, reopenRequests, refreshData 
}) {
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (type, id, action) => {
    try {
      setActionLoading(`${type}-${id}`);
      let endpoint = "";
      if (type === "account") {
        endpoint = `/admin/accounts/${id}/status`;
        await api.patch(endpoint, { status: action === "approve" ? "ACTIVE" : "REJECTED" });
      } else if (type === "closure") {
        endpoint = `/account-closure-requests/admin/close-request/${id}/${action}`;
        await api.patch(endpoint);
      } else if (type === "reopen") {
        endpoint = `/account-reopen-requests/admin/reopen-request/${id}/${action}`;
        await api.patch(endpoint);
      }
      await refreshData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const RequestSection = ({ title, items, type }) => (
    <div className="mb-8 last:mb-0">
      <h3 className="text-lg font-bold text-slate-900 mb-4">{title} <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-2">{items.length}</span></h3>
      {items.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-2xl border-slate-200 bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500">No pending requests of this type.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            // Normalize data based on type
            const id = item._id;
            const accountId = type === "account" ? item._id : item.account?._id;
            const userName = type === "account" ? item.user?.name : item.user?.name;
            const userEmail = type === "account" ? item.user?.email : item.user?.email;
            const reason = item.reason || null;
            
            return (
              <div key={id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm gap-4 transition hover:shadow-md">
                <div>
                  <p className="text-sm font-bold text-slate-900">{userName || "Unknown User"} <span className="text-xs font-normal text-slate-500">({userEmail})</span></p>
                  <p className="text-xs font-mono text-slate-500 mt-1">Account: {accountId}</p>
                  {reason && <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded mt-2 border border-amber-100">Reason: {reason}</p>}
                </div>
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleAction(type, id, "reject")}
                    disabled={actionLoading === `${type}-${id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl transition hover:bg-rose-100 disabled:opacity-50"
                  >
                    {actionLoading === `${type}-${id}` ? <RefreshCw size={14} className="animate-spin" /> : <><X size={14} /> Reject</>}
                  </button>
                  <button
                    onClick={() => handleAction(type, id, "approve")}
                    disabled={actionLoading === `${type}-${id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {actionLoading === `${type}-${id}` ? <RefreshCw size={14} className="animate-spin" /> : <><Check size={14} /> Approve</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ui-surface rounded-2xl shadow-sm border border-slate-100 p-6">
        <RequestSection title="New Account Approvals" items={pendingAccounts} type="account" />
        <div className="h-px w-full bg-slate-100 my-8"></div>
        <RequestSection title="Account Closure Requests" items={closureRequests} type="closure" />
        <div className="h-px w-full bg-slate-100 my-8"></div>
        <RequestSection title="Account Reopen Requests" items={reopenRequests} type="reopen" />
      </div>
    </div>
  );
}
