import { useEffect, useMemo, useState } from "react";
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
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Total Portfolio Balance</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(totalBalance)}
        </p>
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

      {!isLoading && accounts.length === 0 && !error ? (
        <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          No accounts found. Create your first account to start tracking balances.
        </p>
      ) : null}
    </DashboardLayout>
  );
}

export default DashboardPage;
