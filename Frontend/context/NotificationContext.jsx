import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("ledger_read_notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [deletedIds, setDeletedIds] = useState(() => {
    const saved = localStorage.getItem("ledger_deleted_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      const response = await api.get('/users/notifications');
      if (response.data?.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("ledger_read_notifications", JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    localStorage.setItem("ledger_deleted_notifications", JSON.stringify(deletedIds));
  }, [deletedIds]);

  // Merge backend notifications with local read/deleted state
  const activeNotifications = notifications
    .filter(n => !deletedIds.includes(n.id))
    .map(n => ({
      ...n,
      read: readIds.includes(n.id)
    }));

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setReadIds(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  };

  const markAllAsRead = () => {
    const newReadIds = [...readIds];
    activeNotifications.forEach(n => {
      if (!newReadIds.includes(n.id)) newReadIds.push(n.id);
    });
    setReadIds(newReadIds);
  };

  const deleteNotification = (id) => {
    setDeletedIds(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications: activeNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
