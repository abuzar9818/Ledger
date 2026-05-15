import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, Edit3, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

const recurrenceOptions = ["DAILY", "WEEKLY", "MONTHLY"];

function toLocalDateTimeInputValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(date);
}

function isFuturePending(schedule) {
  return schedule.status === "PENDING" && new Date(schedule.nextRunAt).getTime() > Date.now();
}

export default function ScheduledTransfersPage() {
  const [accounts, setAccounts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [apiFeedback, setApiFeedback] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting, isDirty } } = useForm({
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: "",
      recurrence: "DAILY",
      startDate: "",
    }
  });

  const accountOptions = useMemo(() => {
    return accounts.filter(a => a.status === "ACTIVE").map((account) => ({
      id: account._id,
      label: `...${account._id.slice(-4)} (${account.currency})`,
      balance: account.balance
    }));
  }, [accounts]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [accountsRes, schedulesRes] = await Promise.all([
        api.get("/accounts"),
        api.get("/scheduled-transactions/my-schedules"),
      ]);

      const accountList = accountsRes.data?.accounts || [];
      // Fetch balances for active accounts just to show them in dropdown (optional but good UI)
      const accountsWithBalances = await Promise.all(
        accountList.map(async (acc) => {
          try {
            if (acc.status !== "ACTIVE") return acc;
            const balRes = await api.get(`/accounts/balance/${acc._id}`);
            return { ...acc, balance: balRes.data?.balance ?? 0 };
          } catch {
            return { ...acc, balance: 0 };
          }
        })
      );

      setAccounts(accountsWithBalances);
      setSchedules(schedulesRes.data?.schedules || []);

      if (!editingId && accountsWithBalances.length > 0 && !watch("fromAccount")) {
        setValue("fromAccount", accountsWithBalances.find(a => a.status === "ACTIVE")?._id || "");
      }
    } catch (err) {
      setApiFeedback({ type: "error", message: err.response?.data?.message || "Failed to load scheduled transfers." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelEdit = () => {
    setEditingId("");
    reset({
      fromAccount: accountOptions[0]?.id || "",
      toAccount: "",
      amount: "",
      recurrence: "DAILY",
      startDate: "",
    });
    setApiFeedback(null);
  };

  const onSubmit = async (data) => {
    setApiFeedback(null);
    const payload = {
      fromAccount: data.fromAccount,
      toAccount: data.toAccount.trim(),
      amount: Number(data.amount),
      recurrence: data.recurrence,
      ...(data.startDate ? { startDate: new Date(data.startDate).toISOString() } : {}),
    };

    try {
      if (editingId) {
        await api.put(`/scheduled-transactions/${editingId}`, payload);
        setApiFeedback({ type: "success", message: "Schedule updated successfully." });
      } else {
        await api.post("/scheduled-transactions", payload);
        setApiFeedback({ type: "success", message: "Schedule created successfully." });
      }
      await fetchData();
      handleCancelEdit();
    } catch (err) {
      setApiFeedback({ type: "error", message: err.response?.data?.message || "Failed to save schedule." });
    }
  };

  const handleEdit = (schedule) => {
    setApiFeedback(null);
    setEditingId(schedule._id);
    setValue("fromAccount", schedule.fromaccount);
    setValue("toAccount", schedule.toaccount);
    setValue("amount", schedule.amount);
    setValue("recurrence", schedule.recurrence);
    setValue("startDate", toLocalDateTimeInputValue(schedule.nextRunAt));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled transfer?")) return;
    setCancelingId(scheduleId);
    setApiFeedback(null);
    try {
      await api.patch(`/scheduled-transactions/${scheduleId}/cancel`);
      setSchedules((prev) =>
        prev.map((s) => s._id === scheduleId ? { ...s, status: "CANCELLED" } : s)
      );
      setApiFeedback({ type: "success", message: "Schedule cancelled." });
    } catch (err) {
      setApiFeedback({ type: "error", message: err.response?.data?.message || "Failed to cancel." });
    } finally {
      setCancelingId("");
    }
  };

  return (
    <DashboardLayout title="Scheduled Transfers" subtitle="Automate recurring payments and manage future schedules.">
      
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        
        {/* Form Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ui-surface rounded-3xl p-6 h-fit"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Scheduler</p>
              <h2 className="text-2xl font-black text-slate-900">
                {editingId ? "Edit Schedule" : "New Schedule"}
              </h2>
            </div>
            {editingId && (
              <button onClick={handleCancelEdit} className="text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition">
                Cancel
              </button>
            )}
          </div>

          <AnimatePresence>
            {apiFeedback && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className={`flex items-start gap-3 p-4 rounded-2xl border ${apiFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {apiFeedback.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18}/> : <AlertCircle className="shrink-0 mt-0.5" size={18}/>}
                  <p className="text-sm font-semibold">{apiFeedback.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">From Account</label>
              <select
                {...register("fromAccount", { required: "Source account is required" })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="" disabled>Select account</option>
                {accountOptions.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.label} {acc.balance !== undefined ? ` - Balance: ₹${acc.balance}` : ""}
                  </option>
                ))}
              </select>
              {errors.fromAccount && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.fromAccount.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">To Account ID</label>
              <input
                type="text"
                {...register("toAccount", { 
                  required: "Receiver account ID is required",
                  validate: value => value !== watch("fromAccount") || "Cannot transfer to the same account"
                })}
                placeholder="Enter 24-character account ID"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-mono"
              />
              {errors.toAccount && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.toAccount.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Amount (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", { 
                    required: "Amount is required", 
                    min: { value: 1, message: "Must be at least ₹1" } 
                  })}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                {errors.amount && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Recurrence</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
                    <RefreshCw size={18} />
                  </div>
                  <select
                    {...register("recurrence", { required: true })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none"
                  >
                    {recurrenceOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">First Run (Optional)</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
                  <Calendar size={18} />
                </div>
                <input
                  type="datetime-local"
                  {...register("startDate")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (!isDirty && editingId)}
              className="w-full mt-2 rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? <RefreshCw className="animate-spin" size={18}/> : null}
              {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Create Schedule"}
            </button>
          </form>
        </motion.section>

        {/* Timeline Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <div className="ui-surface rounded-3xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Upcoming Timeline</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h4 className="text-lg font-bold text-slate-700">No Schedules Active</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Create your first scheduled transfer to automate your payments seamlessly.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-indigo-100 ml-4 space-y-6 pb-4">
                <AnimatePresence mode="popLayout">
                  {schedules.map((schedule, idx) => {
                    const isPending = isFuturePending(schedule);
                    const isCancelled = schedule.status === "CANCELLED";
                    
                    return (
                      <motion.div 
                        key={schedule._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative pl-6"
                      >
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-4 h-4 w-4 rounded-full border-4 border-white ${isCancelled ? 'bg-slate-300' : 'bg-indigo-500 shadow-sm shadow-indigo-500/40'}`}></div>
                        
                        <div className={`p-5 rounded-2xl border transition-all ${isCancelled ? 'border-slate-100 bg-slate-50 opacity-60 grayscale-[0.5]' : 'border-indigo-100 bg-white shadow-sm hover:shadow-md'}`}>
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                  isCancelled ? 'bg-slate-200 text-slate-600' : 
                                  isPending ? 'bg-indigo-100 text-indigo-700' : 
                                  'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {schedule.status}
                                </span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <RefreshCw size={10}/> {schedule.recurrence}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-900 mt-2">
                                ₹{schedule.amount}
                              </h4>
                              <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                                To: <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{schedule.toaccount.slice(-6)}</span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Next Run</p>
                              <p className="text-sm font-semibold text-slate-700 flex items-center justify-end gap-1.5">
                                <Clock size={14} className={isCancelled ? 'text-slate-400' : 'text-indigo-500'}/>
                                {formatDate(schedule.nextRunAt)}
                              </p>
                              
                              {isPending && (
                                <div className="flex items-center justify-end gap-2 mt-4">
                                  <button onClick={() => handleEdit(schedule)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit">
                                    <Edit3 size={16}/>
                                  </button>
                                  <button onClick={() => handleCancelSchedule(schedule._id)} disabled={cancelingId === schedule._id} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Cancel">
                                    <Trash2 size={16}/>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}