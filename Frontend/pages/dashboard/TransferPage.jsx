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
      });

      setSuccess("Transfer submitted successfully.");
      setFormData((prev) => ({
        ...prev,
        toAccount: "",
        amount: "",
        category: "TRANSFER",
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Failed to submit transfer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Transfer Money"
      subtitle="Move funds between accounts securely."
    >
      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
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
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Transaction"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default TransferPage;
