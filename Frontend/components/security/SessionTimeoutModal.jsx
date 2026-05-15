import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SessionTimeoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds warning
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Mocking an idle timer for demonstration
  // In a real app, this would track mouse/keyboard activity globally
  useEffect(() => {
    let idleTimer;
    let countdownTimer;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      clearInterval(countdownTimer);
      setIsOpen(false);
      setTimeLeft(60);

      // Show warning after 14 minutes of inactivity (mocked to 3 minutes for testing)
      idleTimer = setTimeout(() => {
        setIsOpen(true);
        // Start 60s countdown
        countdownTimer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 3 * 60 * 1000); // 3 mins idle trigger
    };

    // Listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (!isOpen) resetIdleTimer();
    };

    events.forEach(e => window.addEventListener(e, handleActivity));
    resetIdleTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      clearTimeout(idleTimer);
      clearInterval(countdownTimer);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/auth/login?reason=timeout");
  };

  const handleStayLoggedIn = () => {
    setIsOpen(false);
    setTimeLeft(60);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 overflow-hidden text-center border-4 border-amber-100"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <motion.div 
            initial={{ width: "100%" }} 
            animate={{ width: "0%" }} 
            transition={{ duration: timeLeft, ease: "linear" }}
            className="h-full bg-amber-500"
          />
        </div>

        <div className="mb-6 inline-flex p-4 rounded-full bg-amber-50 text-amber-500">
          <Clock size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Session Expiring</h3>
        <p className="text-sm text-slate-500 mb-6">
          For your security, you will be automatically logged out due to inactivity in <span className="font-bold text-amber-600">{timeLeft} seconds</span>.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleStayLoggedIn}
            className="w-full py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition"
          >
            Stay Logged In
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-3.5 bg-slate-100 text-slate-700 hover:text-rose-600 hover:bg-rose-50 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Log Out Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
