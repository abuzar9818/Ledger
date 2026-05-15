import { motion } from "framer-motion";

function AccountCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-slate-100/50 blur-2xl" />
      <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-slate-100/40 blur-2xl" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="relative z-10 mt-6 space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="flex items-baseline gap-2">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-8 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="relative z-10 mt-6 border-t border-slate-100 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default AccountCardSkeleton;
