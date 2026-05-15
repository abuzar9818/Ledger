import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Snowflake, Eye, EyeOff, RotateCcw, ShieldCheck } from "lucide-react";

const themes = {
  emerald: "from-teal-600 via-emerald-600 to-teal-800",
  midnight: "from-slate-800 via-slate-900 to-indigo-950",
  amber: "from-amber-500 via-orange-600 to-red-700"
};

export default function VirtualCard({ userName = "Valued Member" }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [theme, setTheme] = useState("emerald");
  const [toast, setToast] = useState(null);

  const cardNumber = "4242 4242 4242 4242";
  const maskedNumber = "•••• •••• •••• 4242";
  const cvv = "123";
  const expiry = "12/28";

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setToast(`Copied ${type}`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full mx-auto font-sans">
      
      {/* 3D Scene Wrapper */}
      <div 
        className="relative w-[340px] h-[215px] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FROZEN OVERLAY - Applies to the entire 3D wrapper but doesn't rotate */}
          {isFrozen && (
            <div className="absolute inset-0 z-50 rounded-2xl overflow-hidden pointer-events-none" style={{ transform: `translateZ(1px)` }}>
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px]"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/ice.png')] opacity-30 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Snowflake size={16} className="text-blue-500" /> Card Frozen
                </div>
              </div>
            </div>
          )}

          {/* FRONT OF CARD */}
          <div 
            className={`absolute w-full h-full rounded-2xl p-6 text-white shadow-2xl bg-gradient-to-br ${themes[theme]} border border-white/20 overflow-hidden flex flex-col justify-between`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/20 to-transparent -skew-y-6 transform origin-top-left pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <span className="font-bold tracking-widest text-lg drop-shadow-md">LEDGER</span>
              <span className="font-semibold text-xs uppercase tracking-widest opacity-80">Debit</span>
            </div>

            <div className="relative z-10 mt-4">
              {/* EMV Chip */}
              <div className="w-11 h-8 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-md shadow-inner border border-amber-300 opacity-90 mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-full h-[1px] bg-amber-700/30 absolute"></div>
                <div className="w-[1px] h-full bg-amber-700/30 absolute"></div>
                <div className="w-6 h-4 border border-amber-700/30 rounded-sm"></div>
              </div>

              <div className="font-mono text-[22px] tracking-[0.15em] mb-2 drop-shadow-md font-medium text-white/95">
                {showNumber ? cardNumber : maskedNumber}
              </div>
              
              <div className="flex justify-between items-end mt-4 text-xs font-semibold uppercase tracking-wider text-white/80">
                <div className="flex flex-col">
                  <span className="text-[8px] opacity-70">Cardholder</span>
                  <span className="text-sm truncate max-w-[180px] drop-shadow-md text-white">{userName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] opacity-70">Valid Thru</span>
                  <span className="text-sm drop-shadow-md text-white">{expiry}</span>
                </div>
              </div>
            </div>
            
            {/* Visa/Mastercard Logo Mock */}
            <div className="absolute bottom-6 right-6 flex z-10">
              <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen"></div>
              <div className="w-8 h-8 rounded-full bg-amber-500/80 mix-blend-screen -ml-3"></div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div 
            className={`absolute w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br ${themes[theme]} border border-white/20 flex flex-col justify-between overflow-hidden`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="w-full h-12 bg-slate-900 mt-6 opacity-90 shadow-inner"></div>
            
            <div className="px-6 flex-1 mt-4">
              <div className="w-full h-10 bg-slate-100 rounded-sm flex items-center justify-end px-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 italic">CVV</span>
                  <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded shadow-sm text-sm border border-slate-200">
                    {cvv}
                  </span>
                </div>
              </div>
              <p className="text-[7px] text-white/60 leading-tight mt-3 text-justify">
                This card is issued by Ledger Bank pursuant to a license. Use of this card is subject to the cardholder agreement. If found, please return to Ledger Bank, 123 Finance St, NY 10001.
              </p>
            </div>
            
            <div className="px-6 pb-4 flex justify-between items-center">
              <div className="text-[10px] text-white/70 font-mono">Support: 1-800-LEDGER</div>
              <ShieldCheck size={16} className="text-white/50" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-8 w-full bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        
        {/* Toast Notification */}
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="absolute top-4 right-4 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50"
          >
            {toast}
          </motion.div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-6">
          <button 
            onClick={() => setIsFrozen(!isFrozen)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isFrozen ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' : 'hover:bg-slate-50 text-slate-600 border border-transparent'}`}
          >
            <Snowflake size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase">{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowNumber(!showNumber); }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${showNumber ? 'bg-teal-50 text-teal-600 border border-teal-200 shadow-sm' : 'hover:bg-slate-50 text-slate-600 border border-transparent'}`}
          >
            {showNumber ? <EyeOff size={20} className="mb-1" /> : <Eye size={20} className="mb-1" />}
            <span className="text-[10px] font-bold uppercase">{showNumber ? 'Hide' : 'Reveal'}</span>
          </button>
          
          <button 
            onClick={() => handleCopy(cardNumber, "Card Number")}
            className="flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:bg-slate-50 text-slate-600 border border-transparent active:scale-95"
          >
            <Copy size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase">Copy</span>
          </button>

          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isFlipped ? 'bg-slate-100 text-slate-800 border border-slate-200 shadow-sm' : 'hover:bg-slate-50 text-slate-600 border border-transparent'}`}
          >
            <RotateCcw size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase">Flip</span>
          </button>
        </div>

        {/* Theme Selector */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">Card Theme</p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => setTheme("emerald")} 
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-sm transition-transform ${theme === 'emerald' ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'hover:scale-105'}`}
            />
            <button 
              onClick={() => setTheme("midnight")} 
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-indigo-900 shadow-sm transition-transform ${theme === 'midnight' ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
            />
            <button 
              onClick={() => setTheme("amber")} 
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-red-600 shadow-sm transition-transform ${theme === 'amber' ? 'ring-2 ring-offset-2 ring-amber-500 scale-110' : 'hover:scale-105'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
