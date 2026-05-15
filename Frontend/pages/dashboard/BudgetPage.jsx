import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Target, TrendingDown, AlertTriangle, CheckCircle2, Edit2, Plus, ArrowUpRight } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

const CATEGORY_COLORS = {
  FOOD: "#f59e0b", // amber-500
  RENT: "#3b82f6", // blue-500
  OTHER: "#8b5cf6", // violet-500
  TRANSFER: "#10b981", // emerald-500
};

const CATEGORY_ICONS = {
  FOOD: "🍔",
  RENT: "🏠",
  OTHER: "🛍️",
  TRANSFER: "💸",
};

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("FOOD");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [period, setPeriod] = useState("");

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets/progress');
      if (res.data) {
        setBudgets(res.data.budgets || []);
        setPeriod(res.data.period);
      }
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleUpsertBudget = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/budgets', {
        category: selectedCategory,
        limit: Number(budgetLimit),
        period
      });
      setIsModalOpen(false);
      setBudgetLimit("");
      await fetchBudgets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBudgetModal = (category, currentLimit) => {
    setSelectedCategory(category);
    setBudgetLimit(currentLimit ? String(currentLimit) : "");
    setIsModalOpen(true);
  };

  const totalBudget = useMemo(() => budgets.reduce((acc, b) => acc + b.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + b.spent, 0), [budgets]);
  const overspentCount = useMemo(() => budgets.filter(b => b.isExceeded).length, [budgets]);

  const pieData = useMemo(() => {
    return budgets.filter(b => b.spent > 0).map(b => ({
      name: b.category,
      value: b.spent,
      color: CATEGORY_COLORS[b.category] || "#94a3b8"
    }));
  }, [budgets]);

  const barData = useMemo(() => {
    return budgets.filter(b => b.limit > 0 || b.spent > 0).map(b => ({
      name: b.category,
      Budget: b.limit,
      Spent: b.spent,
    }));
  }, [budgets]);

  if (isLoading) {
    return (
      <DashboardLayout title="Budget Planner" subtitle="Manage your monthly spending limits.">
        <div className="flex items-center justify-center py-20 text-slate-400">Loading your budgets...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Budget Planner" subtitle="Manage your monthly spending limits and track your goals.">
      
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ui-surface p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-teal-100/50"><Target size={120} /></div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Budget</h3>
            <div className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-slate-500 font-medium">For {period}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="ui-surface p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-rose-100/50"><TrendingDown size={120} /></div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Spent</h3>
            <div className={`text-3xl font-black mb-2 ${totalSpent > totalBudget && totalBudget > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {formatCurrency(totalSpent)}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${totalSpent > totalBudget ? 'bg-rose-500' : 'bg-teal-500'}`} 
                style={{ width: `${Math.min(totalBudget > 0 ? (totalSpent/totalBudget)*100 : 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${overspentCount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${overspentCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>Status</h3>
            <div className="flex items-center gap-3">
              {overspentCount > 0 ? (
                <>
                  <AlertTriangle size={32} className="text-rose-500" />
                  <div>
                    <div className="text-lg font-bold text-rose-900">Over budget</div>
                    <p className="text-xs text-rose-600">in {overspentCount} categor{overspentCount > 1 ? 'ies' : 'y'}</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 size={32} className="text-emerald-500" />
                  <div>
                    <div className="text-lg font-bold text-emerald-900">On Track</div>
                    <p className="text-xs text-emerald-600">All budgets within limits</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Category Budgets */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Category Budgets</h2>
            <button 
              onClick={() => openBudgetModal("FOOD", 0)}
              className="ui-btn ui-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> New Limit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.filter(b => b.limit > 0 || b.spent > 0).length === 0 ? (
              <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                <Target className="mx-auto text-slate-300 mb-3" size={40} />
                <h3 className="text-sm font-bold text-slate-700">No Budgets Set</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Set up limits to track your spending.</p>
              </div>
            ) : null}

            {budgets.map((b) => (
              b.limit > 0 || b.spent > 0 ? (
                <motion.div layout key={b.category} className="ui-surface p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100">
                        {CATEGORY_ICONS[b.category] || "📦"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{b.category}</h4>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          {b.limit > 0 ? `${formatCurrency(b.limit)} Limit` : "No Limit Set"}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => openBudgetModal(b.category, b.limit)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className={`text-xl font-black ${b.isExceeded ? 'text-rose-600' : 'text-slate-700'}`}>
                        {formatCurrency(b.spent)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {b.percentage.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${b.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${b.isExceeded ? 'bg-rose-500' : CATEGORY_COLORS[b.category] || 'bg-slate-500'}`}
                      />
                    </div>
                    
                    {b.isExceeded && (
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1 mt-1">
                        <AlertTriangle size={10} /> Limit Exceeded by {formatCurrency(b.spent - b.limit)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : null
            ))}
          </div>

          {/* Bar Chart Overview */}
          {barData.length > 0 && (
            <div className="ui-surface p-6 rounded-3xl border border-slate-100 mt-8">
              <h3 className="text-sm font-bold text-slate-900 mb-6">Budget vs Actual</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Spent" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="ui-surface p-6 rounded-3xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Spending Distribution</h3>
            {pieData.length > 0 ? (
              <>
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                    <span className="text-lg font-black text-slate-800">{formatCurrency(totalSpent)}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="font-semibold text-slate-600">{d.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No spending data</div>
            )}
          </div>

          <div className="ui-surface p-6 rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden">
             <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-2xl"></div>
             <h3 className="text-sm font-bold mb-2 relative z-10">Pro Tip</h3>
             <p className="text-xs text-indigo-100 relative z-10 leading-relaxed mb-4">
               A good rule of thumb is the 50/30/20 rule: 50% for needs (Rent, Groceries), 30% for wants, and 20% for savings or debt payoff.
             </p>
             <button className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition relative z-10">
               Learn more <ArrowUpRight size={14} />
             </button>
          </div>
        </div>

      </div>

      {/* Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Set Budget Limit</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <AlertTriangle size={16} className="opacity-0" /> {/* Spacer */}
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            
            <form onSubmit={handleUpsertBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                >
                  {["FOOD", "RENT", "OTHER", "TRANSFER"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Monthly Limit</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold">₹</div>
                  <input 
                    type="number" 
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    required
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">Enter 0 to remove the budget limit.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition text-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Limit"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </DashboardLayout>
  );
}
