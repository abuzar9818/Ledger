import { useState } from "react";
import { Search } from "lucide-react";

export default function AuditLogsTab({ auditLogs }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = auditLogs.filter(log => {
    const term = searchTerm.toLowerCase();
    const actionMatch = log.actionType?.toLowerCase().includes(term);
    const userMatch = log.userId?.name?.toLowerCase().includes(term) || log.userId?.email?.toLowerCase().includes(term);
    const metadataMatch = JSON.stringify(log.metadata || {}).toLowerCase().includes(term);
    
    return actionMatch || userMatch || metadataMatch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ui-surface rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search logs by action, user or details..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-white"
            />
          </div>
          <div className="text-sm font-bold text-slate-500">
            {filteredLogs.length} logs found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{log.userId?.name || "System"}</p>
                    <p className="text-xs text-slate-500">{log.userId?.email || ""}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">
                    {log.userId?.role || "-"}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate" title={JSON.stringify(log.metadata)}>
                    {JSON.stringify(log.metadata || {})}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
