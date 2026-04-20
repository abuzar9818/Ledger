import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const categories = ["TRANSFER", "FOOD", "RENT", "SALARY", "OTHER"];

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `tx-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function TransferPage() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    category: "TRANSFER",
  });
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoadingAccounts(true);
      setError("");

      try {
        const response = await api.get("/accounts");
        const accountList = response.data?.accounts || [];
        setAccounts(accountList);

        if (accountList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            fromAccount: accountList[0]._id,
          }));
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load accounts");
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      formData.fromAccount &&
      formData.toAccount &&
      Number(formData.amount) > 0 &&
      !isSubmitting &&
      !isLoadingAccounts
    );
  }, [formData, isLoadingAccounts, isSubmitting]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit) {
      setError("Please fill all fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/transactions", {
        fromAccount: formData.fromAccount,
        toAccount: formData.toAccount.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        idempotencyKey: createIdempotencyKey(),
      }, {
        timeout: 30000,
      });

      setSuccess("Transfer submitted successfully.");
      setFormData((prev) => ({
        ...prev,
        toAccount: "",
        amount: "",
        category: "TRANSFER",
      }));
    } catch (requestError) {
      if (requestError.code === "ECONNABORTED") {
        setError("Transfer request timed out. The transaction may still complete, so check transaction history before retrying.");
      } else {
        setError(
          requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Failed to submit transfer."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Transfer Money"
      subtitle="Move funds between accounts securely."
    >
      <div className="max-w-2xl ui-surface rounded-3xl p-5 sm:p-6">
        {error ? (
          <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fromAccount" className="mb-1 block text-sm font-medium text-slate-700">
              Sender Account
            </label>
            <select
              id="fromAccount"
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleChange}
              disabled={isLoadingAccounts}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account._id} ({account.currency} - {account.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toAccount" className="mb-1 block text-sm font-medium text-slate-700">
              Receiver Account
            </label>
            <input
              id="toAccount"
              name="toAccount"
              type="text"
              value={formData.toAccount}
              onChange={handleChange}
              placeholder="Enter receiver account id"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-slate-700">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl bg-gradient-to-r from-slate-900 to-teal-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:from-slate-800 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Transaction"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default TransferPage;
