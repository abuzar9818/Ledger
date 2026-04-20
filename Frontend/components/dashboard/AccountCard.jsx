function getStatusTone(status) {
  if (status === "pending") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "approved") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "rejected") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-slate-100 text-slate-600";
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

  return (
    <article className="ui-surface rounded-2xl p-4 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Account ID</p>
          <p className="mt-1 break-all text-sm font-medium text-slate-900">{account._id}</p>
        </div>
        <span
          className={[
            "rounded-full px-2 py-1 text-xs font-semibold",
            account.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-700"
              : account.status === "FROZEN"
              ? "bg-amber-100 text-amber-700"
              : "bg-rose-100 text-rose-700",
          ].join(" ")}
        >
          {account.status}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <dt>Currency</dt>
          <dd className="font-medium text-slate-900">{account.currency}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Balance</dt>
          <dd className="font-bold text-slate-900">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: account.currency || "INR",
              maximumFractionDigits: 2,
            }).format(account.balance ?? 0)}
          </dd>
        </div>
      </dl>

      {canManageRequests ? (
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Close request</p>
            <span className={["rounded-full px-2 py-1 text-[11px] font-semibold uppercase", getStatusTone(closeStatus)].join(" ")}>
              {closeStatus}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reopen request</p>
            <span className={["rounded-full px-2 py-1 text-[11px] font-semibold uppercase", getStatusTone(reopenStatus)].join(" ")}>
              {reopenStatus}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={!canRequestClose || isClosing}
              onClick={() => onRequestClose?.(account._id)}
              className="ui-btn ui-btn-soft px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClosing ? "Submitting..." : "Request Close"}
            </button>

            <button
              type="button"
              disabled={!canRequestReopen || isReopening}
              onClick={() => onRequestReopen?.(account._id)}
              className="ui-btn ui-btn-soft px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReopening ? "Submitting..." : "Request Reopen"}
            </button>
          </div>

          {feedback?.message ? (
            <p
              className={[
                "rounded-md px-2.5 py-2 text-xs",
                feedback.type === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700",
              ].join(" ")}
            >
              {feedback.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default AccountCard;
