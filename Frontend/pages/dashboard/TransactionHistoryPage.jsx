import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const categories = ["ALL", "TRANSFER", "FOOD", "RENT", "SALARY", "OTHER"];
const statuses = ["ALL", "PENDING", "COMPLETED", "FAILED", "REVERSED"];

function TimelineItem({ tx, accountIds }) {
  const isOutgoing = accountIds.has(tx.fromaccount);
  const directionLabel = isOutgoing ? "Sent" : "Received";
  const directionColor = isOutgoing ? "text-rose-600" : "text-emerald-600";

  return (
    <li className="relative pl-8">
      <span className="absolute left-2 top-2 h-3 w-3 rounded-full bg-slate-700" />
      <div className="ui-surface rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{directionLabel} {Number(tx.amount).toLocaleString("en-IN")}</p>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{tx.status}</span>
        </div>

        <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
          <p>
            Category: <span className="font-medium text-slate-800">{tx.category}</span>
          </p>
          <p className={directionColor}>
            {isOutgoing ? "From" : "To"}: {isOutgoing ? tx.fromaccount : tx.toaccount}
          </p>
          <p>Date: {new Date(tx.createdAt).toLocaleString()}</p>
          <p>Transaction ID: {tx._id}</p>
        </div>
      </div>
    </li>
  );
}

function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [accountIds, setAccountIds] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [accountsResponse, transactionsResponse] = await Promise.all([
          api.get("/accounts"),
          categoryFilter === "ALL"
            ? api.get("/transactions/my-transactions", {
                params: {
                  limit: 50,
                  ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
                },
              })
            : api.get(`/transactions/category/${categoryFilter}`, {
                params: { limit: 50 },
              }),
        ]);

        const ids = new Set((accountsResponse.data?.accounts || []).map((account) => account._id));
        const txList = transactionsResponse.data?.transactions || [];

        setAccountIds(ids);
        setTransactions(txList);
      } catch (requestError) {
        setError(requestError.response?.data?.error || "Failed to fetch transaction history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [categoryFilter, statusFilter]);

  const filteredTransactions = useMemo(() => {
    if (statusFilter === "ALL") {
      return transactions;
    }

    return transactions.filter((tx) => tx.status === statusFilter);
  }, [transactions, statusFilter]);

  return (
    <DashboardLayout
      title="Transaction History"
      subtitle="Review your money movement timeline."
    >
      <div className="ui-surface rounded-3xl p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryFilter" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Filter by Category
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="statusFilter" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white/80" />
          ))}
        </div>
      ) : (
        <ol className="relative space-y-4 before:absolute before:bottom-0 before:left-[0.82rem] before:top-0 before:w-px before:bg-slate-300">
          {filteredTransactions.map((tx) => (
            <TimelineItem key={tx._id} tx={tx} accountIds={accountIds} />
          ))}
        </ol>
      )}

      {!isLoading && filteredTransactions.length === 0 && !error ? (
        <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          No transactions found for current filters.
        </p>
      ) : null}
    </DashboardLayout>
  );
}

export default TransactionHistoryPage;
