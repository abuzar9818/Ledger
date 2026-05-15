import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

const PIE_COLORS = ["#0f766e", "#14b8a6", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#84cc16"];

export function TrendBarChart({ data = [] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `₹${val/1000}k`} />
          <Tooltip 
            cursor={{ fill: "rgba(20, 184, 166, 0.05)" }}
            contentStyle={{ borderRadius: "16px", border: "1px solid rgba(226, 232, 240, 0.6)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}
            formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }}/>
          <Bar dataKey="income" name="Income" fill="#0f766e" radius={[6, 6, 0, 0]} barSize={20} />
          <Bar dataKey="expense" name="Expense" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ data = [] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", background: "#fff" }}
            formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
          />
          <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Activity Heatmap representing transaction density over the last 30 days
export function ActivityHeatmap({ data = [] }) {
  // We'll build a grid of 30 boxes
  // data should be an array of { date: 'YYYY-MM-DD', count: number }
  
  // Fill missing days for the last 30 days
  const today = new Date();
  const heatmapData = [];
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const existing = data.find(item => item.date === dateStr);
    heatmapData.push({
      date: dateStr,
      count: existing ? existing.count : 0,
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
    });
  }

  const getIntensityClass = (count) => {
    if (count === 0) return "bg-slate-100";
    if (count <= 2) return "bg-teal-200";
    if (count <= 5) return "bg-teal-400";
    if (count <= 10) return "bg-teal-600";
    return "bg-teal-800";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {heatmapData.map((day, idx) => (
          <div 
            key={idx} 
            className={`w-10 h-10 rounded-md transition-all hover:scale-110 flex items-center justify-center cursor-crosshair group relative ${getIntensityClass(day.count)}`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-semibold z-10 shadow-xl">
              {day.count} txns on {day.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500">
        <span>Less</span>
        <div className="w-4 h-4 rounded-sm bg-slate-100"></div>
        <div className="w-4 h-4 rounded-sm bg-teal-200"></div>
        <div className="w-4 h-4 rounded-sm bg-teal-400"></div>
        <div className="w-4 h-4 rounded-sm bg-teal-600"></div>
        <div className="w-4 h-4 rounded-sm bg-teal-800"></div>
        <span>More</span>
      </div>
    </div>
  );
}
