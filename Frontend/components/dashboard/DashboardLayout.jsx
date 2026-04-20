import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-100/60 via-slate-50 to-teal-50/60">
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] rounded-3xl border border-slate-200/70 bg-white/40 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-sm">
        <DashboardSidebar role={user?.role} />

        <div className="flex flex-1 flex-col">
          <DashboardTopbar title={title} subtitle={subtitle} />
          <main className="flex-1 space-y-5 p-4 pb-8 pt-5 sm:p-6 lg:p-7">{children}</main>
        </div>
      </div>
    </section>
  );
}

export default DashboardLayout;
