import { motion } from "framer-motion";
import { Wallet, ShieldCheck, ArrowRight, Activity, CreditCard } from "lucide-react";

function getStatusTone(status) {
  if (status === "pending") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (status === "approved") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (status === "rejected") return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  return "bg-slate-500/10 text-slate-600 border-slate-500/20";
}

function AccountCard({
  account,
  closureRequest,
  reopenRequest,
  canManageRequests = false,
  isClosing = false,
  isReopening = false,
  onRequestClose,
  onRequestReopen,
  feedback,
}) {
  const closeStatus = closureRequest?.status || "none";
  const reopenStatus = reopenRequest?.status || "none";
  const canRequestClose = canManageRequests && account.status !== "CLOSED" && closeStatus !== "pending";
  const canRequestReopen = canManageRequests && account.status === "CLOSED" && reopenStatus !== "pending";

  const isClosed = account.status === "CLOSED";
  const isPending = account.status === "PENDING";
  const isRejected = account.status === "REJECTED";
  const isActive = account.status === "ACTIVE";

  return (
    <motion.article 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-3xl border p-6 transition-all ${
        (isClosed || isRejected)
          ? "border-slate-200 bg-slate-50/80 grayscale-[0.5]" 
          : isPending
          ? "border-amber-100 bg-amber-50/30"
          : "border-teal-100 bg-gradient-to-b from-teal-50/50 to-white shadow-sm hover:shadow-xl hover:shadow-teal-900/5"
      }`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-100/50 blur-2xl" />
      <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-amber-100/40 blur-2xl" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            (isClosed || isRejected) ? "bg-slate-200 text-slate-500" : 
            isPending ? "bg-amber-100 text-amber-600" : 
            "bg-teal-600 text-white shadow-inner"
          }`}>
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account ID</p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 font-mono tracking-tight">{account._id.substring(0, 8)}...{account._id.substring(account._id.length - 4)}</p>
          </div>
        </div>
        <span
          className={[
            "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
            isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : account.status === "FROZEN"
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : isPending
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          {account.status}
        </span>
      </div>

      <div className="relative z-10 mt-6">
        <p className="text-sm font-medium text-slate-500 mb-1">Available Balance</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: account.currency || "INR",
              maximumFractionDigits: 2,
            }).format(account.balance ?? 0)}
          </span>
          <span className="text-sm font-bold text-slate-400">{account.currency || "INR"}</span>
        </div>
      </div>

      {canManageRequests && (
        <div className="relative z-10 mt-6 border-t border-slate-100 pt-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-white/60 p-3 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Close Status</p>
              <span className={["rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", getStatusTone(closeStatus)].join(" ")}>
                {closeStatus}
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/60 p-3 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Reopen Status</p>
              <span className={["rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", getStatusTone(reopenStatus)].join(" ")}>
                {reopenStatus}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!canRequestClose || isClosing}
              onClick={() => onRequestClose?.(account._id)}
              className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClosing ? "Processing..." : "Close Account"}
            </button>

            <button
              type="button"
              disabled={!canRequestReopen || isReopening}
              onClick={() => onRequestReopen?.(account._id)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReopening ? "Processing..." : "Reopen Account"}
            </button>
          </div>

          {feedback?.message && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={[
                "mt-3 rounded-lg px-3 py-2 text-xs font-medium border",
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-100",
              ].join(" ")}
            >
              {feedback.message}
            </motion.p>
          )}
        </div>
      )}
    </motion.article>
  );
}

export default AccountCard;
