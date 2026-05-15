import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Lock, Smartphone, Laptop, Shield, User as UserIcon, Monitor, Bell, Moon, Sun, CheckCircle2, QrCode } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import OTPModal from "../security/OTPModal";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

export function ProfileTab() {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || ""
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.put("/users/profile", { name: data.name });
      updateUser({ name: res.data.user.name });
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h3>
      
      <div className="flex items-center gap-6 mb-8">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition">
            Change Avatar
          </button>
          <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">Full Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
          <input
            type="email"
            disabled
            {...register("email")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3.5 text-sm font-medium outline-none text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed directly. Contact support if needed.</p>
        </div>
        
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export function SecurityTab() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState("idle"); 
  
  const newPasswordVal = watch("newPassword", "");

  const calculateStrength = (pwd) => {
    let s = 0;
    if (pwd.length > 7) s += 1;
    if (/[A-Z]/.test(pwd)) s += 1;
    if (/[0-9]/.test(pwd)) s += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 1;
    return s;
  };

  const strength = calculateStrength(newPasswordVal);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"];

  const onPasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    await new Promise(r => setTimeout(r, 1000));
    alert("Password updated successfully! (Mocked)");
    reset();
  };

  const start2FASetup = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
    } else {
      setSetupStep("qr");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl space-y-10">
      
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-6">Change Password</h3>
        <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Current Password</label>
            <input
              type="password"
              {...register("currentPassword", { required: true })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">New Password</label>
              <input
                type="password"
                {...register("newPassword", { required: true, minLength: 8 })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {newPasswordVal.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 w-full mb-1">
                    {[1,2,3,4].map(level => (
                      <div key={level} className={`h-full flex-1 rounded-full transition-colors duration-300 ${level <= strength ? strengthColors[strength] : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${strengthColors[strength].replace('bg-', 'text-')}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", { required: true })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50 mt-2"
          >
            Update Password
          </button>
        </form>
      </section>

      <div className="h-px w-full bg-slate-100"></div>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-6">Two-Factor Authentication</h3>
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Protect your account</p>
                <p className="text-xs text-slate-500">Adds an extra layer of security using an authenticator app.</p>
              </div>
            </div>
            <button 
              onClick={start2FASetup}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <AnimatePresence>
            {setupStep === "qr" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-4 bg-white rounded-xl border border-slate-200 mt-4 text-center">
                  <p className="text-sm font-bold text-slate-900 mb-2">1. Scan this QR Code</p>
                  <p className="text-xs text-slate-500 mb-4">Use Google Authenticator or Authy to scan.</p>
                  <div className="mx-auto bg-slate-100 border-2 border-dashed border-slate-300 w-40 h-40 flex items-center justify-center rounded-lg mb-4">
                    <QrCode size={64} className="text-slate-400" />
                  </div>
                  <button 
                    onClick={() => setSetupStep("otp")}
                    className="w-full py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition"
                  >
                    I have scanned it
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {setupStep === "otp" && (
        <OTPModal 
          isOpen={true} 
          onClose={() => setSetupStep("idle")} 
          onSuccess={() => {
            setTwoFactorEnabled(true);
            setSetupStep("idle");
          }} 
        />
      )}
    </div>
  );
}

export function PreferencesTab() {
  const { user, updateUser } = useAuth();
  const [theme, setTheme] = useState(user?.theme || "system");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add('dark');
    } else if (theme === "light") {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    try {
      await api.put("/users/profile", { theme: newTheme });
      updateUser({ theme: newTheme });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl space-y-10">
      <section>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Theme Settings</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "system", icon: Monitor, label: "System" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition ${theme === t.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}
            >
              <t.icon size={24} className="mb-2" />
              <span className="text-sm font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-slate-100"></div>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
            <div>
              <p className="text-sm font-bold text-slate-900">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive transactional alerts via email.</p>
            </div>
            <button 
              onClick={() => setNotifyEmail(!notifyEmail)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifyEmail ? 'bg-indigo-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifyEmail ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
            <div>
              <p className="text-sm font-bold text-slate-900">Push Notifications</p>
              <p className="text-xs text-slate-500">Get alerts directly in your browser.</p>
            </div>
            <button 
              onClick={() => setNotifyPush(!notifyPush)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifyPush ? 'bg-indigo-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifyPush ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function DeviceTab() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get("/users/sessions");
      setSessions(res.data.sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.delete(`/users/sessions/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
      alert("Session revoked.");
    } catch (err) {
      alert("Failed to revoke session.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Active Sessions</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="p-5 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-5 border border-slate-100 rounded-2xl text-center text-slate-400">No active sessions found.</div>
        ) : (
          sessions.map(session => (
            <div key={session._id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${session.isCurrent ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                  {session.device.toLowerCase().includes('mobile') || session.device.toLowerCase().includes('iphone') || session.device.toLowerCase().includes('android') ? <Smartphone size={20} /> : <Laptop size={20} />}
                </div>
                <div className="max-w-[200px] sm:max-w-[300px]">
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate">
                    {session.device} 
                    {session.isCurrent && <span className="shrink-0 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">Current</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{session.ip} • {new Date(session.loginTime).toLocaleString()}</p>
                </div>
              </div>
              {!session.isCurrent && (
                <button onClick={() => handleRevoke(session._id)} className="shrink-0 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition">
                  Revoke
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        <p className="text-sm text-slate-600 mb-3">If you notice any suspicious activity, we recommend logging out of all devices and changing your password.</p>
        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition">
          Log out of all other devices
        </button>
      </div>
    </div>
  );
}
