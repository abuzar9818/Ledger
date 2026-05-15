import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRightLeft, CalendarClock, History, Plus, Wallet, TrendingUp, PiggyBank, CreditCard, Activity } from "lucide-react";

import AccountCard from "../../components/dashboard/AccountCard";
import AccountCardSkeleton from "../../components/dashboard/AccountCardSkeleton";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { IncomeExpenseChart, SpendingPieChart, SavingsLineChart } from "../../components/dashboard/charts/OverviewCharts";
import RecentTransactionsTable from "../../components/dashboard/RecentTransactionsTable";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function getAccountIdFromRequest(request) {
  if (!request?.accountId) return null;
  return typeof request.accountId === "string" ? request.accountId : request.accountId?._id;
}

function buildLatestRequestMap(requests = []) {
  return requests.reduce((acc, req) => {
    const id = getAccountIdFromRequest(req);
    if (id && !acc[id]) acc[id] = req;
    return acc;
  }, {});
}

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const isUserRole = user?.role === "USER";

  const [accounts, setAccounts] = useState([]);
  const [closureRequestsByAccount, setClosureRequestsByAccount] = useState({});
  const [reopenRequestsByAccount, setReopenRequestsByAccount] = useState({});
  const [requestFeedbackByAccount, setRequestFeedbackByAccount] = useState({});
  const [requestLoadingByAccount, setRequestLoadingByAccount] = useState({});
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [createAccountFeedback, setCreateAccountFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardAnalytics, setDashboardAnalytics] = useState({ incomeExpense: [], spending: [], savings: [] });
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchAccountsWithBalances = async () => {
    const res = await api.get("/accounts");
    const list = res.data?.accounts || [];
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
    return withBalances;
  };

  const fetchRequestStatuses = async () => {
    if (!isUserRole) {
      setClosureRequestsByAccount({});
      setReopenRequestsByAccount({});
      return;
    }
    try {
      const [closeRes, reopenRes] = await Promise.all([
        api.get("/account-closure-requests/accounts/my-close-requests"),
        api.get("/account-reopen-requests/accounts/my-reopen-requests"),
      ]);
      setClosureRequestsByAccount(buildLatestRequestMap(closeRes.data?.closureRequests || []));
      setReopenRequestsByAccount(buildLatestRequestMap(reopenRes.data?.reopenRequests || []));
    } catch {
      setClosureRequestsByAccount({});
      setReopenRequestsByAccount({});
    }
  };

  const fetchDashboardAnalytics = async () => {
    try {
      const res = await api.get('/reports/dashboard-analytics');
      if (res.data) {
        setDashboardAnalytics(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const fetchRecentTransactions = async (currentAccounts) => {
    try {
      const res = await api.get('/transactions/my-transactions?limit=5');
      const txs = res.data?.transactions || [];
      const userAccountIds = currentAccounts.map(a => a._id.toString());
      
      const formattedTxs = txs.map(tx => {
        const isIncome = userAccountIds.includes(tx.toaccount?.toString());
        return {
          id: tx._id,
          date: new Date(tx.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          name: tx.category === 'SALARY' ? 'Salary / Initial Fund' : 'Transfer',
          category: tx.category,
          amount: tx.amount,
          status: tx.status.toLowerCase(),
          type: isIncome ? 'income' : 'expense'
        };
      });
      setRecentTransactions(formattedTxs);
    } catch (err) {
      console.error("Failed to fetch recent transactions", err);
    }
  };

  const refreshData = async () => {
    const fetchedAccounts = await fetchAccountsWithBalances();
    await fetchRequestStatuses();
    await fetchDashboardAnalytics();
    if (fetchedAccounts) {
      await fetchRecentTransactions(fetchedAccounts);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        await refreshData();
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isUserRole]);

  const setActionLoading = (id, key, val) => {
    setRequestLoadingByAccount((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: val },
    }));
  };

  const setAccountFeedback = (id, feedback) => {
    setRequestFeedbackByAccount((prev) => ({ ...prev, [id]: feedback }));
  };

  const handleCloseRequest = async (id) => {
    setActionLoading(id, "close", true);
    setAccountFeedback(id, null);
    try {
      const res = await api.post(`/account-closure-requests/accounts/${id}/close-request`);
      setAccountFeedback(id, { type: "success", message: res.data?.message || "Submitted." });
      await fetchRequestStatuses();
    } catch (err) {
      setAccountFeedback(id, { type: "error", message: err.response?.data?.message || "Failed." });
    } finally {
      setActionLoading(id, "close", false);
    }
  };

  const handleReopenRequest = async (id) => {
    setActionLoading(id, "reopen", true);
    setAccountFeedback(id, null);
    try {
      const res = await api.post(`/account-reopen-requests/accounts/${id}/reopen-request`);
      setAccountFeedback(id, { type: "success", message: res.data?.message || "Submitted." });
      await fetchRequestStatuses();
    } catch (err) {
      setAccountFeedback(id, { type: "error", message: err.response?.data?.message || "Failed." });
    } finally {
      setActionLoading(id, "reopen", false);
    }
  };

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    setCreateAccountFeedback(null);
    try {
      await api.post("/accounts");
      setCreateAccountFeedback({ type: "success", message: "Account created." });
      await refreshData();
    } catch (err) {
      setCreateAccountFeedback({ type: "error", message: err.response?.data?.message || "Failed to create." });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0),
    [accounts]
  );

  const activeAccounts = useMemo(() => accounts.filter(a => a.status === 'ACTIVE').length, [accounts]);

  return (
    <DashboardLayout
      title="Overview"
      subtitle="Your financial summary and quick actions."
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 font-medium text-sm">Total Balance</p>
                  <h3 className="text-4xl font-black mt-1 tracking-tight">{formatCurrency(totalBalance)}</h3>
                </div>
                <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                  <Wallet className="text-teal-400" size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full font-semibold">
                  <TrendingUp size={14} /> +2.4%
                </span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="ui-surface rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-teal-50 to-transparent"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Total Savings</p>
                  <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{formatCurrency(8100)}</h3>
                </div>
                <div className="bg-teal-50 text-teal-600 p-2.5 rounded-2xl">
                  <PiggyBank size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-semibold border border-emerald-100">
                  <TrendingUp size={14} /> +12.5%
                </span>
                <span className="text-slate-500">this year</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="ui-surface rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-amber-50 to-transparent"></div>
             <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Active Accounts</p>
                  <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{activeAccounts} <span className="text-xl text-slate-400 font-bold">/ {accounts.length}</span></h3>
                </div>
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-2xl">
                  <Activity size={24} />
                </div>
              </div>
              
              {isUserRole && (
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={isCreatingAccount}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
                >
                  <Plus size={16} /> {isCreatingAccount ? "Creating..." : "Open Account"}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {createAccountFeedback && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
            <div className={`p-4 rounded-2xl border ${createAccountFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
              <p className="font-medium text-sm">{createAccountFeedback.message}</p>
            </div>
          </motion.div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div variants={itemVariants} className="lg:col-span-2 ui-surface rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cash Flow</h3>
                <p className="text-sm text-slate-500">Income vs Expenses over time</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl px-3 py-2 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <IncomeExpenseChart data={dashboardAnalytics.incomeExpense} />
          </motion.div>

          <motion.div variants={itemVariants} className="ui-surface rounded-3xl p-6">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-900">Spending</h3>
              <p className="text-sm text-slate-500">Analytics by category</p>
            </div>
            <SpendingPieChart data={dashboardAnalytics.spending} />
          </motion.div>
        </div>

        {/* Savings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="ui-surface rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Savings Growth</h3>
                <p className="text-sm text-slate-500">Your total savings trajectory</p>
              </div>
            </div>
            <SavingsLineChart data={dashboardAnalytics.savings} />
          </motion.div>

          <motion.div variants={itemVariants} className="ui-surface rounded-3xl p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
              <p className="text-sm text-slate-500">Frequently used tools</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 flex-1">
              <Link to="/dashboard/transfer" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-teal-200 hover:bg-teal-50/50 hover:shadow-md hover:shadow-teal-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <ArrowRightLeft size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-teal-700">Transfer</span>
              </Link>
              
              <Link to="/dashboard/scheduled-transfers" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-md hover:shadow-indigo-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <CalendarClock size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Schedule</span>
              </Link>
              
              <Link to="/dashboard/transactions" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-md hover:shadow-amber-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <History size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-amber-700">History</span>
              </Link>
              
              <Link to="#" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md hover:shadow-blue-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CreditCard size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Cards</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <RecentTransactionsTable transactions={recentTransactions} />
        </motion.div>

        {/* Accounts List */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h3 className="text-xl font-bold text-slate-900">Your Accounts</h3>
            <Link to="/dashboard/accounts" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <AccountCardSkeleton key={i} />)
              : accounts.map((acc) => (
                  <AccountCard
                    key={acc._id}
                    account={acc}
                    closureRequest={closureRequestsByAccount[acc._id]}
                    reopenRequest={reopenRequestsByAccount[acc._id]}
                    canManageRequests={isUserRole}
                    isClosing={Boolean(requestLoadingByAccount[acc._id]?.close)}
                    isReopening={Boolean(requestLoadingByAccount[acc._id]?.reopen)}
                    onRequestClose={handleCloseRequest}
                    onRequestReopen={handleReopenRequest}
                    feedback={requestFeedbackByAccount[acc._id]}
                  />
                ))}
          </div>

          {!isLoading && accounts.length === 0 && !error && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
              <Wallet className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No Accounts Found</h3>
              <p className="mt-1 text-sm text-slate-500 mb-6">You don't have any accounts yet. Create one to get started.</p>
              {isUserRole && (
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={isCreatingAccount}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
                >
                  <Plus size={18} /> {isCreatingAccount ? "Creating..." : "Open First Account"}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
