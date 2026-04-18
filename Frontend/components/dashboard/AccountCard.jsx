function AccountCard({ account }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
          <dd className="font-semibold text-slate-900">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: account.currency || "INR",
              maximumFractionDigits: 2,
            }).format(account.balance ?? 0)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default AccountCard;
