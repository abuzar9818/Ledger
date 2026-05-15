import { useEffect, useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { TrendBarChart, CategoryPieChart, ActivityHeatmap } from "../../components/dashboard/charts/ReportsCharts";
import api from "../../services/api";

export default function ReportsPage() {
  const reportRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState("6M"); // 1M, 3M, 6M, 1Y
  
  const [analyticsData, setAnalyticsData] = useState({ incomeExpense: [], spending: [] });
  const [heatmapData, setHeatmapData] = useState([]);
  const [rawTransactions, setRawTransactions] = useState([]);

  const fetchReportsData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, txRes] = await Promise.all([
        api.get("/reports/dashboard-analytics"),
        api.get("/transactions/my-transactions?limit=500")
      ]);

      setAnalyticsData({
        incomeExpense: analyticsRes.data?.incomeExpense || [],
        spending: analyticsRes.data?.spending || []
      });

      const txs = txRes.data?.transactions || [];
      setRawTransactions(txs);

      // Process heatmap data (transactions count per day for last 30 days)
      const heatMapCount = {};
      txs.forEach(tx => {
        const dStr = new Date(tx.createdAt).toISOString().split('T')[0];
        heatMapCount[dStr] = (heatMapCount[dStr] || 0) + 1;
      });

      const processedHeatmap = Object.keys(heatMapCount).map(date => ({
        date, count: heatMapCount[date]
      }));
      setHeatmapData(processedHeatmap);

    } catch (error) {
      console.error("Failed to fetch reports data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExportingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ledger_Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      setShowExportModal(false);
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to export PDF.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCSV = () => {
    if (rawTransactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }

    const headers = ["ID", "Date", "Category", "Amount", "Status", "From", "To"];
    const csvContent = [
      headers.join(","),
      ...rawTransactions.map(tx => [
        tx._id,
        new Date(tx.createdAt).toISOString(),
        tx.category,
        tx.amount,
        tx.status,
        tx.fromaccount,
        tx.toaccount
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Ledger_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="Comprehensive insights and data exports for your finances.">
      
      {/* Topbar Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          {['1M', '3M', '6M', '1Y'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${dateRange === range ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {range}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setShowExportModal(true)}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition flex items-center gap-2"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <RefreshCw className="animate-spin mb-4" size={32} />
          <p className="font-medium text-sm">Crunching the numbers...</p>
        </div>
      ) : (
        <motion.div 
          ref={reportRef} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 bg-[#FAFAFA] -m-6 p-6 sm:m-0 sm:p-0 sm:bg-transparent"
        >
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="ui-surface rounded-3xl p-6 border-t-4 border-t-indigo-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Processed Volume</p>
              <h3 className="text-3xl font-black text-slate-900">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                  .format(rawTransactions.reduce((acc, tx) => acc + tx.amount, 0))}
              </h3>
              <p className="text-xs text-slate-400 mt-2">Across {rawTransactions.length} total transactions</p>
            </div>
            <div className="ui-surface rounded-3xl p-6 border-t-4 border-t-emerald-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Top Category</p>
              <h3 className="text-xl font-black text-slate-900 mt-2 truncate">
                {analyticsData.spending.length > 0 ? analyticsData.spending.sort((a,b)=>b.value-a.value)[0].name : "N/A"}
              </h3>
            </div>
            <div className="ui-surface rounded-3xl p-6 border-t-4 border-t-amber-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Transaction Value</p>
              <h3 className="text-3xl font-black text-slate-900">
                {rawTransactions.length > 0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rawTransactions.reduce((acc, tx) => acc + tx.amount, 0) / rawTransactions.length) : "₹0"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="ui-surface rounded-3xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Income vs Expense Trends</h3>
                <p className="text-sm text-slate-500">Cashflow comparison over the selected period</p>
              </div>
              <TrendBarChart data={analyticsData.incomeExpense} />
            </div>
            
            <div className="ui-surface rounded-3xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Expense Breakdown</h3>
                <p className="text-sm text-slate-500">Spending categorization</p>
              </div>
              <CategoryPieChart data={analyticsData.spending} />
            </div>
          </div>

          <div className="ui-surface rounded-3xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Transaction Activity Map</h3>
              <p className="text-sm text-slate-500">Daily transaction density over the last 30 days</p>
            </div>
            <ActivityHeatmap data={heatmapData} />
          </div>

        </motion.div>
      )}

      {/* Download Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Export Options</h3>
              <p className="text-sm text-slate-500 mb-6">Choose how you'd like to download your financial data.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={handleExportPDF}
                  disabled={isExportingPdf}
                  className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition group disabled:opacity-50"
                >
                  {isExportingPdf ? <RefreshCw className="animate-spin text-indigo-500 mb-3" size={32}/> : <FileText className="text-indigo-400 group-hover:text-indigo-600 mb-3" size={32} strokeWidth={1.5} />}
                  <span className="font-bold text-slate-700 text-sm">{isExportingPdf ? "Generating..." : "Visual PDF"}</span>
                  <span className="text-[10px] text-slate-400 mt-1">Charts & Summaries</span>
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition group"
                >
                  <FileSpreadsheet className="text-emerald-400 group-hover:text-emerald-600 mb-3" size={32} strokeWidth={1.5} />
                  <span className="font-bold text-slate-700 text-sm">Raw CSV</span>
                  <span className="text-[10px] text-slate-400 mt-1">Data table for Excel</span>
                </button>
              </div>
              
              <button onClick={() => setShowExportModal(false)} className="w-full py-3 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition">
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
