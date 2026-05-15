import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { Search, Download, Filter, ChevronLeft, ChevronRight, RefreshCw, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["ALL", "TRANSFER", "FOOD", "RENT", "SALARY", "OTHER"];
const statuses = ["ALL", "PENDING", "COMPLETED", "FAILED", "REVERSED"];

function TransactionDetailsModal({ tx, accountIds, onClose, onReverse, isReversing }) {
  if (!tx) return null;

  const isOutgoing = accountIds.has(tx.fromaccount);
  const isCompleted = tx.status === "COMPLETED";
  const ageMs = Date.now() - new Date(tx.createdAt).getTime();
  const canReverse = isOutgoing && isCompleted && ageMs <= 60000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Transaction Details</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X size={20}/></button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isOutgoing ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isOutgoing ? <ArrowUpRight size={32}/> : <ArrowDownLeft size={32}/>}
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              {isOutgoing ? "-" : "+"}₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
              tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              tx.status === 'FAILED' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {tx.status}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Category</span>
              <span className="font-bold text-slate-900">{tx.category}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Date</span>
              <span className="font-bold text-slate-900">{new Date(tx.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">{isOutgoing ? "Sent To" : "Received From"}</span>
              <span className="font-mono text-slate-700">{isOutgoing ? tx.toaccount : tx.fromaccount}</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium mb-1">Transaction ID</span>
              <span className="font-mono text-xs text-slate-400 break-all">{tx._id}</span>
            </div>
          </div>

          {canReverse && (
            <div className="mt-8">
              <button 
                onClick={() => onReverse(tx._id)}
                disabled={isReversing}
                className="w-full py-3 bg-amber-100 text-amber-700 text-sm font-bold rounded-xl hover:bg-amber-200 transition flex justify-center items-center gap-2"
              >
                {isReversing ? <RefreshCw size={16} className="animate-spin" /> : null}
                {isReversing ? "Reversing..." : "Reverse Transaction"}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">You can only reverse a transaction within 60 seconds of creation.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [accountIds, setAccountIds] = useState(new Set());
  
  // Query States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt"); // createdAt, amount
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [isLoading, setIsLoading] = useState(true);
  const [reversingId, setReversingId] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const [accountsRes, txRes] = await Promise.all([
        api.get("/accounts"),
        api.get(categoryFilter === "ALL" ? "/transactions/my-transactions" : `/transactions/category/${categoryFilter}`, {
          params: {
            page,
            limit: 10,
            ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
            sortBy,
            sortOrder
          }
        })
      ]);

      const ids = new Set((accountsRes.data?.accounts || []).map(a => a._id));
      setAccountIds(ids);
      setTransactions(txRes.data?.transactions || []);
      setTotalPages(txRes.data?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, categoryFilter, statusFilter, sortBy, sortOrder]);

  const handleReverse = async (txId) => {
    setReversingId(txId);
    try {
      await api.post(`/transactions/${txId}/reverse`);
      await fetchTransactions(); // Refresh the list
      if (selectedTx && selectedTx._id === txId) {
        setSelectedTx({ ...selectedTx, status: "REVERSED" });
      }
      alert("Transaction reversed successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reverse.");
    } finally {
      setReversingId("");
    }
  };

  const exportCSV = () => {
    if (transactions.length === 0) return alert("No transactions to export");
    const headers = ["ID", "Date", "Amount", "Category", "Status", "From", "To"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(tx => [
        tx._id,
        new Date(tx.createdAt).toISOString(),
        tx.amount,
        tx.category,
        tx.status,
        tx.fromaccount,
        tx.toaccount
      ].map(f => `"${f}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_page_${page}.csv`;
    link.click();
  };

  return (
    <DashboardLayout title="Transactions" subtitle="Advanced ledger overview and history.">
      
      {/* Controls */}
      <div className="ui-surface rounded-3xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
          <div className="flex flex-wrap items-end gap-4 w-full lg:w-auto">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={categoryFilter} onChange={e => {setCategoryFilter(e.target.value); setPage(1);}} className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none bg-slate-50 min-w-[140px]">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
              <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setPage(1);}} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none bg-slate-50 min-w-[140px]">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Sort By</label>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                <select value={sortBy} onChange={e => {setSortBy(e.target.value); setPage(1);}} className="px-4 py-2 bg-slate-50 text-sm font-medium outline-none border-r border-slate-200">
                  <option value="createdAt">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <button onClick={() => {setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setPage(1);}} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 transition">
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
              </div>
            </div>
          </div>
          
          <button onClick={exportCSV} className="shrink-0 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center gap-2 w-full lg:w-auto justify-center">
            <Download size={16}/> Export Page
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ui-surface rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-10 w-48 bg-slate-100 animate-pulse rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 animate-pulse rounded-md"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 animate-pulse rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 animate-pulse rounded-md"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg ml-auto"></div></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <p className="font-semibold text-sm">No transactions found.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isOutgoing = accountIds.has(tx.fromaccount);
                  return (
                    <tr key={tx._id} className="hover:bg-slate-50/50 transition cursor-pointer group" onClick={() => setSelectedTx(tx)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isOutgoing ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {isOutgoing ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{tx.category}</p>
                            <p className="text-xs font-mono text-slate-500 truncate w-32 sm:w-auto">{isOutgoing ? `To: ${tx.toaccount.slice(-6)}` : `From: ${tx.fromaccount.slice(-6)}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${isOutgoing ? 'text-slate-900' : 'text-emerald-600'}`}>
                          {isOutgoing ? "-" : "+"}₹{Number(tx.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                          tx.status === 'PENDING' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                          tx.status === 'FAILED' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition">View</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <span className="text-sm font-bold text-slate-600">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTx && (
          <TransactionDetailsModal 
            tx={selectedTx} 
            accountIds={accountIds} 
            onClose={() => setSelectedTx(null)} 
            onReverse={handleReverse}
            isReversing={reversingId === selectedTx._id}
          />
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
