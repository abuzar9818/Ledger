import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import Navbar from "../common/Navbar";
import MobileBottomNav from "./MobileBottomNav";
import CommandPalette from "../common/CommandPalette";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <section className="relative isolate min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-50 to-teal-50/50">
      <CommandPalette userRole={user?.role} />
      <Navbar />
      <div className="mx-auto flex flex-1 w-full max-w-[1700px]">
        <DashboardSidebar role={user?.role} />

        <div className="flex flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
          <DashboardTopbar title={title} subtitle={subtitle} />
          <main className="flex-1 space-y-5 p-4 pb-8 pt-5 sm:p-6 lg:p-7 overflow-y-auto">{children}</main>
        </div>
      </div>
      <MobileBottomNav />
    </section>
  );
}

export default DashboardLayout;
