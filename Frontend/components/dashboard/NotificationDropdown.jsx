import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, Shield, ArrowRightLeft, Settings, X, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import { Link } from "react-router-dom";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, UNREAD
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotifications = activeTab === "UNREAD" ? notifications.filter(n => !n.read) : notifications;

  const getIcon = (type) => {
    switch (type) {
      case "TRANSACTION": return <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full"><ArrowRightLeft size={16}/></div>;
      case "SECURITY": return <div className="p-2 bg-rose-100 text-rose-600 rounded-full"><Shield size={16}/></div>;
      case "SYSTEM": return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full"><Settings size={16}/></div>;
      case "ACCOUNT": return <div className="p-2 bg-amber-100 text-amber-600 rounded-full"><CalendarCheck size={16}/></div>;
      default: return <div className="p-2 bg-slate-100 text-slate-600 rounded-full"><Bell size={16}/></div>;
    }
  };

  const formatTime = (timestamp) => {
    const d = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(d);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-500 hover:text-slate-900 transition hover:bg-slate-100 rounded-full"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+8px)] z-[100] w-[340px] sm:w-[380px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">
                  Mark all as read
                </button>
              )}
            </div>

            <div className="flex border-b border-slate-100 px-4">
              <button 
                onClick={() => setActiveTab("ALL")}
                className={`py-2.5 text-xs font-bold mr-4 border-b-2 transition-colors ${activeTab === "ALL" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab("UNREAD")}
                className={`py-2.5 text-xs font-bold border-b-2 transition-colors ${activeTab === "UNREAD" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Unread {unreadCount > 0 && <span className="ml-1 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center">
                    <Bell className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                    <p className="text-sm font-semibold text-slate-500">No notifications here</p>
                    <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={notification.id}
                      className={`relative flex items-start gap-3 p-4 border-b border-slate-50 transition hover:bg-slate-50 group ${!notification.read ? "bg-indigo-50/30" : ""}`}
                    >
                      {!notification.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                      
                      <div className="shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button onClick={() => markAsRead(notification.id)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Mark as read">
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(notification.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" title="Remove">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-3 border-t border-slate-100 text-center bg-slate-50 hover:bg-slate-100 transition">
              <Link to="/dashboard/settings" onClick={() => setOpen(false)} className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5">
                <Settings size={14} /> Notification Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
