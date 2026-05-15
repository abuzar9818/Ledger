import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, XCircle, RefreshCw } from "lucide-react";

export default function OTPModal({ isOpen, onClose, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setStatus("idle");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all filled
    if (index === 5 && value !== "" && newOtp.every(v => v !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (code) => {
    setStatus("loading");
    // Mock API Call
    await new Promise(r => setTimeout(r, 1500));
    
    if (code === "123456") {
      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } else {
      setStatus("error");
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""]);
        setStatus("idle");
        inputRefs.current[0]?.focus();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={status !== 'loading' ? onClose : undefined}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 overflow-hidden text-center"
      >
        <div className="mb-6 inline-flex p-4 rounded-full bg-indigo-50 text-indigo-600">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Security Verification</h3>
        <p className="text-sm text-slate-500 mb-8">Enter the 6-digit code sent to your device. (Use 123456 for testing)</p>
        
        <div className="flex gap-2 justify-center mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={status === 'loading' || status === 'success'}
              className={`w-10 h-12 text-center text-xl font-bold rounded-xl border outline-none transition-all ${
                status === 'error' ? 'border-rose-500 bg-rose-50 text-rose-700' :
                status === 'success' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center gap-2 text-indigo-600 text-sm font-bold">
              <RefreshCw size={16} className="animate-spin"/> Verifying...
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center gap-2 text-emerald-600 text-sm font-bold">
              <ShieldCheck size={16}/> Verification Complete!
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-center items-center gap-2 text-rose-600 text-sm font-bold">
              <XCircle size={16}/> Invalid Code. Try again.
            </motion.div>
          )}
          {status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                Resend Code
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
