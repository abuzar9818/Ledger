import { useState } from "react";
import { Search, Lock, Unlock, RefreshCw, Trash2, Shield, User } from "lucide-react";
import api from "../../services/api";

export default function AccountsUsersTab({ accounts, users, refreshData }) {
  const [view, setView] = useState("accounts"); // 'accounts' or 'users'
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Accounts filtering
  const filteredAccounts = accounts.filter(acc => 
    acc._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.user?.name && acc.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (acc.user?.email && acc.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Users filtering
  const filteredUsers = (users || []).filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to promote this user to ${newRole}?`)) return;
    try {
      setActionLoading(userId);
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      await refreshData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;
    try {
      setActionLoading(userId);
      await api.delete(`/admin/users/${userId}`);
      await refreshData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
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
      
      <div className="flex mb-4 bg-slate-100 p-1 rounded-xl max-w-[240px]">
        <button 
          onClick={() => setView('accounts')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${view === 'accounts' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Accounts
        </button>
        <button 
          onClick={() => setView('users')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${view === 'users' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Users
        </button>
      </div>

      <div className="ui-surface rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={view === 'accounts' ? "Search by ID, Name, or Email..." : "Search Users by Name or Email..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-white"
            />
          </div>
          <div className="text-sm font-bold text-slate-500">
            {view === 'accounts' ? `${filteredAccounts.length} accounts` : `${filteredUsers.length} users`} found
          </div>
        </div>

        <div className="overflow-x-auto">
          {view === 'accounts' ? (
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
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {u.role === 'ADMIN' ? <Shield size={10} /> : <User size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleUpdateRole(u._id, 'ADMIN')}
                          disabled={actionLoading === u._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition disabled:opacity-50"
                        >
                          {actionLoading === u._id ? "Working..." : "Make Admin"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={actionLoading === u._id}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
