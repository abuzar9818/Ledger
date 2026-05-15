import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

function AdminPage() {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/pending-accounts');
      setPendingAccounts(res.data?.pendingAccounts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  const handleStatusUpdate = async (accountId, status) => {
    try {
      setActionLoading(accountId);
      await api.patch(`/admin/accounts/${accountId}/status`, { status });
      await fetchPendingAccounts();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout title="Admin Area" subtitle="Manage users and accounts.">
      <div className="ui-surface rounded-3xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Pending Accounts</h2>
        
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading accounts...</p>
        ) : pendingAccounts.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl border-slate-300">
            <p className="text-sm font-medium text-slate-500">No pending accounts waiting for approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAccounts.map((account) => (
              <div key={account._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">{account.user?.name || "Unknown User"}</p>
                  <p className="text-xs text-slate-500 mb-1">{account.user?.email || "No email"}</p>
                  <p className="text-xs font-mono text-slate-400">Account ID: {account._id}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleStatusUpdate(account._id, "REJECTED")}
                    disabled={actionLoading === account._id}
                    className="flex-1 sm:flex-none px-4 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition hover:bg-rose-200 disabled:opacity-50"
                  >
                    {actionLoading === account._id ? "Processing..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(account._id, "ACTIVE")}
                    disabled={actionLoading === account._id}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {actionLoading === account._id ? "Processing..." : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminPage;
