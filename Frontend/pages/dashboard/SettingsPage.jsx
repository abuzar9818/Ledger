import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { ProfileTab, SecurityTab, PreferencesTab, DeviceTab } from "../../components/settings/SettingsTabs";
import { User, Shield, Settings, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security & Password", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "devices", label: "Device Management", icon: Smartphone },
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences and security.">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 ui-surface rounded-3xl p-6 md:p-8 min-h-[500px]">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "preferences" && <PreferencesTab />}
          {activeTab === "devices" && <DeviceTab />}
        </div>
        
      </div>
    </DashboardLayout>
  );
}
