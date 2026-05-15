import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

// 1. Shimmer Skeleton Loader
export function SkeletonLoader({ className = "", type = "rectangle", rows = 1 }) {
  const baseClasses = "relative overflow-hidden bg-slate-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";
  
  const typeClasses = {
    circle: "rounded-full",
    rectangle: "rounded-xl",
    text: "rounded h-4 w-3/4",
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className={`${baseClasses} ${typeClasses[type]} ${type === 'text' && i === rows - 1 && rows > 1 ? 'w-1/2' : ''}`}
          style={{ height: type === 'circle' ? undefined : '100%' }}
        />
      ))}
    </div>
  );
}

// 2. Empty State Illustration
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-6 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"></div>
        {Icon && <Icon size={40} className="relative z-10" />}
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  );
}

// 3. Error / Retry Card
export function ErrorRetryCard({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-rose-100 p-2 rounded-full text-rose-600 mt-1">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-rose-900 mb-1">{title}</h3>
          <p className="text-sm text-rose-700 leading-relaxed mb-4">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 text-sm font-bold text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 px-4 py-2 rounded-xl transition"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
