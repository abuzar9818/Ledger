import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-teal-50/40">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DashboardSidebar role={user?.role} />

        <div className="flex flex-1 flex-col">
          <DashboardTopbar title={title} subtitle={subtitle} />
          <main className="flex-1 space-y-4 p-4 pb-6 pt-5 sm:p-6 lg:p-6">{children}</main>
        </div>
      </div>
    </section>
  );
}

export default DashboardLayout;
