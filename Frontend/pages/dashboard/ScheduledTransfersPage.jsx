import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const recurrenceOptions = ["DAILY", "WEEKLY", "MONTHLY"];

function toLocalDateTimeInputValue(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isFuturePending(schedule) {
  return schedule.status === "PENDING" && new Date(schedule.nextRunAt).getTime() > Date.now();
}

function ScheduledTransfersPage() {
  const [accounts, setAccounts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelingId, setCancelingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    recurrence: "DAILY",
    startDate: "",
  });

  const accountOptions = useMemo(() => {
    return accounts.map((account) => ({
      id: account._id,
      label: `${account._id} (${account.currency} - ${account.status})`,
    }));
  }, [accounts]);

  const resetForm = () => {
    setEditingId("");
    setFormData((prev) => ({
      fromAccount: accountOptions[0]?.id || prev.fromAccount,
      toAccount: "",
      amount: "",
      recurrence: "DAILY",
      startDate: "",
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [accountsResponse, schedulesResponse] = await Promise.all([
        api.get("/accounts"),
        api.get("/scheduled-transactions/my-schedules"),
      ]);

      const accountList = accountsResponse.data?.accounts || [];
      const scheduleList = schedulesResponse.data?.schedules || [];

      setAccounts(accountList);
      setSchedules(scheduleList);

      if (!editingId) {
        setFormData((prev) => ({
          ...prev,
          fromAccount: prev.fromAccount || accountList[0]?._id || "",
        }));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load scheduled transfers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit =
    formData.fromAccount &&
    formData.toAccount &&
    Number(formData.amount) > 0 &&
    formData.recurrence &&
    !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit) {
      setError("Please fill all fields correctly.");
      return;
    }

    const payload = {
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount.trim(),
      amount: Number(formData.amount),
      recurrence: formData.recurrence,
      ...(formData.startDate ? { startDate: new Date(formData.startDate).toISOString() } : {}),
    };

    setIsSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/scheduled-transactions/${editingId}`, payload);
        setSuccess("Scheduled transfer updated successfully.");
      } else {
        await api.post("/scheduled-transactions", payload);
        setSuccess("Scheduled transfer created successfully.");
      }

      await fetchData();
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to submit schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (schedule) => {
    setError("");
    setSuccess("");
    setEditingId(schedule._id);
    setFormData({
      fromAccount: schedule.fromaccount,
      toAccount: schedule.toaccount,
      amount: String(schedule.amount),
      recurrence: schedule.recurrence,
      startDate: toLocalDateTimeInputValue(schedule.nextRunAt),
    });
  };

  const handleCancel = async (scheduleId) => {
    setError("");
    setSuccess("");
    setCancelingId(scheduleId);

    try {
      await api.patch(`/scheduled-transactions/${scheduleId}/cancel`);

      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule._id === scheduleId
            ? {
                ...schedule,
                status: "CANCELLED",
              }
            : schedule
        )
      );

      setSuccess("Scheduled transfer cancelled successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to cancel schedule.");
    } finally {
      setCancelingId("");
    }
  };

  return (
    <DashboardLayout
      title="Scheduled Transfers"
      subtitle="Automate recurring transfers and manage future schedules."
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="ui-surface rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Scheduler</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {editingId ? "Edit Scheduled Transfer" : "Create Scheduled Transfer"}
              </h2>
            </div>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fromAccount" className="mb-1 block text-sm font-medium text-slate-700">
                From Account
              </label>
              <select
                id="fromAccount"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Select account</option>
                {accountOptions.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="toAccount" className="mb-1 block text-sm font-medium text-slate-700">
                To Account
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

            <div className="grid gap-4 sm:grid-cols-2">
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
                <label htmlFor="recurrence" className="mb-1 block text-sm font-medium text-slate-700">
                  Recurrence
                </label>
                <select
                  id="recurrence"
                  name="recurrence"
                  value={formData.recurrence}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                >
                  {recurrenceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-slate-700">
                First Run At (optional)
              </label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-gradient-to-r from-slate-900 to-teal-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:from-slate-800 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : editingId ? "Save Schedule" : "Submit Schedule"}
            </button>
          </form>
        </section>

        <section className="ui-surface rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Your scheduled transfers</h3>
          <p className="mt-2 text-sm text-slate-600">
            Edit or cancel future schedules before the next run. Active schedules execute automatically based on recurrence.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-teal-50 p-3">
              <p className="text-xs uppercase tracking-wide text-teal-700">Total</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{schedules.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="text-xs uppercase tracking-wide text-amber-700">Pending</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {schedules.filter((schedule) => schedule.status === "PENDING").length}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-600">Cancelled</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {schedules.filter((schedule) => schedule.status === "CANCELLED").length}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="ui-surface overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Recurrence</th>
                <th className="px-4 py-3">Next Run</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Loading schedules...
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    No scheduled transfers found.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => {
                  const canManage = isFuturePending(schedule);

                  return (
                    <tr key={schedule._id} className="text-slate-700">
                      <td className="px-4 py-3 font-medium">{schedule.fromaccount}</td>
                      <td className="px-4 py-3">{schedule.toaccount}</td>
                      <td className="px-4 py-3">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 2,
                        }).format(schedule.amount || 0)}
                      </td>
                      <td className="px-4 py-3">{schedule.recurrence}</td>
                      <td className="px-4 py-3">{formatDate(schedule.nextRunAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            schedule.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : schedule.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-700",
                          ].join(" ")}
                        >
                          {schedule.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(schedule)}
                            disabled={!canManage}
                            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancel(schedule._id)}
                            disabled={!canManage || cancelingId === schedule._id}
                            className="rounded-lg border border-rose-300 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancelingId === schedule._id ? "Cancelling..." : "Cancel"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default ScheduledTransfersPage;