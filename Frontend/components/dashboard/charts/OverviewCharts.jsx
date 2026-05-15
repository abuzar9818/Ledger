import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PIE_COLORS = ["#0f766e", "#14b8a6", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#84cc16"];

export function IncomeExpenseChart({ data = [] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip 
            cursor={{ fill: "rgba(20, 184, 166, 0.05)" }}
            contentStyle={{ borderRadius: "16px", border: "1px solid rgba(226, 232, 240, 0.6)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}
            itemStyle={{ color: "#0f172a", fontWeight: 600 }}
          />
          <Bar dataKey="income" name="Income" fill="#0f766e" radius={[6, 6, 0, 0]} barSize={16} />
          <Bar dataKey="expense" name="Expense" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpendingPieChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  
  return (
    <div className="h-64 w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={95}
            paddingAngle={6}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", background: "#fff" }}
            itemStyle={{ color: "#0f172a", fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total</span>
        <span className="text-2xl font-bold text-slate-900">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total)}
        </span>
      </div>
    </div>
  );
}

export function SavingsLineChart({ data = [] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip 
            contentStyle={{ borderRadius: "16px", border: "1px solid rgba(226, 232, 240, 0.6)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}
            itemStyle={{ color: "#0f766e", fontWeight: 700 }}
          />
          <Area type="monotone" dataKey="balance" stroke="#0f766e" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
