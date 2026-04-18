import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <section className="-mx-4 -my-8 min-h-[calc(100vh-3rem)] bg-gradient-to-b from-slate-100 via-slate-100 to-teal-50/40 lg:-mx-6">
      <div className="flex min-h-[calc(100vh-3rem)]">
        <DashboardSidebar role={user?.role} />

        <div className="flex flex-1 flex-col">
          <DashboardTopbar title={title} subtitle={subtitle} />
          <main className="flex-1 space-y-6 p-4 pb-8 pt-6 sm:p-6">{children}</main>
        </div>
      </div>
    </section>
  );
}

export default DashboardLayout;
