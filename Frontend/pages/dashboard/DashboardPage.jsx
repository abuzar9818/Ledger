import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AccountCard from "../../components/dashboard/AccountCard";
import AccountCardSkeleton from "../../components/dashboard/AccountCardSkeleton";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccountsWithBalances = async () => {
      setIsLoading(true);
      setError("");

      try {
        const accountsResponse = await api.get("/accounts");
        const accountList = accountsResponse.data?.accounts || [];

        const accountsWithBalances = await Promise.all(
          accountList.map(async (account) => {
            try {
              const balanceResponse = await api.get(`/accounts/balance/${account._id}`);
              return {
                ...account,
                balance: balanceResponse.data?.balance ?? 0,
              };
            } catch (_error) {
              return {
                ...account,
                balance: 0,
              };
            }
          })
        );

        setAccounts(accountsWithBalances);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to fetch accounts right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountsWithBalances();
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + (Number(account.balance) || 0), 0),
    [accounts]
  );

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Track your accounts and balances in real time."
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="ui-surface rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Portfolio Summary</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(totalBalance)}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Your balances are loaded across every account so you can get a quick snapshot without drilling into each record.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { label: "Accounts", value: accounts.length, tone: "teal" },
            { label: "Active", value: accounts.filter((account) => account.status === "ACTIVE").length, tone: "amber" },
            { label: "Completed", value: "Live", tone: "slate" },
          ].map((item) => (
            <div key={item.label} className="ui-surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/dashboard/transfer" className="ui-surface rounded-2xl p-5 transition hover:-translate-y-1 hover:border-teal-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Quick Action</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Transfer Money</h3>
          <p className="mt-2 text-sm text-slate-600">Send money from one account to another with one clean form.</p>
        </Link>
        <Link to="/dashboard/scheduled-transfers" className="ui-surface rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">Automation</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Scheduled Transfers</h3>
          <p className="mt-2 text-sm text-slate-600">Set recurring transfers with daily, weekly, or monthly recurrence.</p>
        </Link>
        <Link to="/dashboard/transactions" className="ui-surface rounded-2xl p-5 transition hover:-translate-y-1 hover:border-amber-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Quick Action</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Transaction History</h3>
          <p className="mt-2 text-sm text-slate-600">Review activity, categories, and statuses in a timeline view.</p>
        </Link>
        <div className="ui-surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Status</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Workspace Ready</h3>
          <p className="mt-2 text-sm text-slate-600">Your dashboard is set up to support account insights and money movement.</p>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <AccountCardSkeleton key={index} />)
          : accounts.map((account) => <AccountCard key={account._id} account={account} />)}
      </div>

      {!isLoading && accounts.length > 0 ? (
        <div className="ui-surface rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account Coverage</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Everything is visible at a glance</h2>
            </div>
            <Link to="/dashboard/transactions" className="text-sm font-semibold text-teal-700 hover:text-teal-600">
              See transactions
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {accounts.slice(0, 3).map((account) => (
              <div key={account._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{account.currency}</p>
                <p className="mt-2 break-all text-sm font-medium text-slate-800">{account._id}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: account.currency || "INR",
                    maximumFractionDigits: 2,
                  }).format(account.balance ?? 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!isLoading && accounts.length === 0 && !error ? (
        <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          No accounts found. Create your first account to start tracking balances.
        </p>
      ) : null}
    </DashboardLayout>
  );
}

export default DashboardPage;
