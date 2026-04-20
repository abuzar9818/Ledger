import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AccountCard from "../../components/dashboard/AccountCard";
import AccountCardSkeleton from "../../components/dashboard/AccountCardSkeleton";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function getAccountIdFromRequest(request) {
  if (!request?.accountId) {
    return null;
  }

  return typeof request.accountId === "string" ? request.accountId : request.accountId?._id;
}

function buildLatestRequestMap(requests = []) {
  return requests.reduce((accumulator, request) => {
    const accountId = getAccountIdFromRequest(request);

    if (accountId && !accumulator[accountId]) {
      accumulator[accountId] = request;
    }

    return accumulator;
  }, {});
}

function DashboardPage() {
  const { user } = useAuth();
  const isUserRole = user?.role === "USER";

  const [accounts, setAccounts] = useState([]);
  const [closureRequestsByAccount, setClosureRequestsByAccount] = useState({});
  const [reopenRequestsByAccount, setReopenRequestsByAccount] = useState({});
  const [requestFeedbackByAccount, setRequestFeedbackByAccount] = useState({});
  const [requestLoadingByAccount, setRequestLoadingByAccount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAccountsWithBalances = async () => {
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
  };

  const fetchRequestStatuses = async () => {
    if (!isUserRole) {
      setClosureRequestsByAccount({});
      setReopenRequestsByAccount({});
      return;
    }

    try {
      const [closeResponse, reopenResponse] = await Promise.all([
        api.get("/account-closure-requests/accounts/my-close-requests"),
        api.get("/account-reopen-requests/accounts/my-reopen-requests"),
      ]);

      const closeRequests = closeResponse.data?.closureRequests || [];
      const reopenRequests = reopenResponse.data?.reopenRequests || [];

      setClosureRequestsByAccount(buildLatestRequestMap(closeRequests));
      setReopenRequestsByAccount(buildLatestRequestMap(reopenRequests));
    } catch (_error) {
      setClosureRequestsByAccount({});
      setReopenRequestsByAccount({});
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        await fetchAccountsWithBalances();
        await fetchRequestStatuses();
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to fetch dashboard data right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [isUserRole]);

  const setActionLoading = (accountId, key, value) => {
    setRequestLoadingByAccount((prev) => ({
      ...prev,
      [accountId]: {
        ...(prev[accountId] || {}),
        [key]: value,
      },
    }));
  };

  const setAccountFeedback = (accountId, feedback) => {
    setRequestFeedbackByAccount((prev) => ({
      ...prev,
      [accountId]: feedback,
    }));
  };

  const handleCloseRequest = async (accountId) => {
    setActionLoading(accountId, "close", true);
    setAccountFeedback(accountId, null);

    try {
      const response = await api.post(`/account-closure-requests/accounts/${accountId}/close-request`);
      setAccountFeedback(accountId, {
        type: "success",
        message: response.data?.message || "Closure request submitted.",
      });
      await fetchRequestStatuses();
    } catch (requestError) {
      setAccountFeedback(accountId, {
        type: "error",
        message: requestError.response?.data?.message || "Unable to submit closure request.",
      });
    } finally {
      setActionLoading(accountId, "close", false);
    }
  };

  const handleReopenRequest = async (accountId) => {
    setActionLoading(accountId, "reopen", true);
    setAccountFeedback(accountId, null);

    try {
      const response = await api.post(`/account-reopen-requests/accounts/${accountId}/reopen-request`);
      setAccountFeedback(accountId, {
        type: "success",
        message: response.data?.message || "Reopen request submitted.",
      });
      await fetchRequestStatuses();
    } catch (requestError) {
      setAccountFeedback(accountId, {
        type: "error",
        message: requestError.response?.data?.message || "Unable to submit reopen request.",
      });
    } finally {
      setActionLoading(accountId, "reopen", false);
    }
  };

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + (Number(account.balance) || 0), 0),
    [accounts]
  );

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Accounts, actions, and status in one place."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ui-surface rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Portfolio Summary</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(totalBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-600">A quick balance snapshot across your accounts.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { label: "Accounts", value: accounts.length, tone: "teal" },
            { label: "Active", value: accounts.filter((account) => account.status === "ACTIVE").length, tone: "amber" },
            { label: "Workspace", value: "Ready", tone: "slate" },
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
          <p className="mt-2 text-sm text-slate-600">Send funds in one flow.</p>
        </Link>
        <Link to="/dashboard/scheduled-transfers" className="ui-surface rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">Automation</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Scheduled Transfers</h3>
          <p className="mt-2 text-sm text-slate-600">Set recurring payments.</p>
        </Link>
        <Link to="/dashboard/transactions" className="ui-surface rounded-2xl p-5 transition hover:-translate-y-1 hover:border-amber-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Quick Action</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Transaction History</h3>
          <p className="mt-2 text-sm text-slate-600">Review activity quickly.</p>
        </Link>
        <div className="ui-surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Status</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Workspace Ready</h3>
          <p className="mt-2 text-sm text-slate-600">Use close/reopen requests from account cards.</p>
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
          : accounts.map((account) => (
              <AccountCard
                key={account._id}
                account={account}
                closureRequest={closureRequestsByAccount[account._id]}
                reopenRequest={reopenRequestsByAccount[account._id]}
                canManageRequests={isUserRole}
                isClosing={Boolean(requestLoadingByAccount[account._id]?.close)}
                isReopening={Boolean(requestLoadingByAccount[account._id]?.reopen)}
                onRequestClose={handleCloseRequest}
                onRequestReopen={handleReopenRequest}
                feedback={requestFeedbackByAccount[account._id]}
              />
            ))}
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
