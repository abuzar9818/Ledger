import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import OverviewTab from "../../components/admin/OverviewTab";
import AccountsUsersTab from "../../components/admin/AccountsUsersTab";
import RequestsTab from "../../components/admin/RequestsTab";
import AuditLogsTab from "../../components/admin/AuditLogsTab";
import { RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [closureRequests, setClosureRequests] = useState([]);
  const [reopenRequests, setReopenRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        usersRes, accountsRes, pendingRes, closureRes, reopenRes, logsRes
      ] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/accounts'),
        api.get('/admin/pending-accounts'),
        api.get('/account-closure-requests/admin/close-requests'),
        api.get('/account-reopen-requests/admin/reopen-requests'),
        api.get('/admin/audit-logs')
      ]);

      setUsers(usersRes.data?.users || []);
      setAccounts(accountsRes.data?.accounts || []);
      setPendingAccounts(pendingRes.data?.pendingAccounts || []);
      setClosureRequests(closureRes.data?.closureRequests || []);
      setReopenRequests(reopenRes.data?.reopenRequests || []);
      setAuditLogs(logsRes.data?.logs || []);

    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeAccounts: accounts.filter(a => a.status === "ACTIVE").length,
    pendingRequests: pendingAccounts.length + closureRequests.length + reopenRequests.length,
    totalLogs: auditLogs.length
  }), [users, accounts, pendingAccounts, closureRequests, reopenRequests, auditLogs]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "accounts", label: "Accounts & Users" },
    { id: "requests", label: `Requests (${stats.pendingRequests})` },
    { id: "logs", label: "Audit Logs" }
  ];

  return (
    <DashboardLayout title="Enterprise Admin" subtitle="Centralized user management and system auditing.">
      <div className="mb-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <RefreshCw className="animate-spin mb-4" size={32} />
          <p className="font-medium text-sm">Loading admin datasets...</p>
        </div>
      ) : (
        <>
          {activeTab === "overview" && <OverviewTab stats={stats} />}
          {activeTab === "accounts" && <AccountsUsersTab accounts={accounts} users={users} refreshData={fetchData} />}
          {activeTab === "requests" && (
            <RequestsTab 
              pendingAccounts={pendingAccounts} 
              closureRequests={closureRequests} 
              reopenRequests={reopenRequests} 
              refreshData={fetchData} 
            />
          )}
          {activeTab === "logs" && <AuditLogsTab auditLogs={auditLogs} />}
        </>
      )}
    </DashboardLayout>
  );
}
