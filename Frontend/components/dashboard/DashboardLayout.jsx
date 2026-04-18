import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <section className="-mx-4 -my-6 min-h-[calc(100vh-3rem)] bg-slate-100 lg:-mx-6">
      <div className="flex min-h-[calc(100vh-3rem)]">
        <DashboardSidebar role={user?.role} />

        <div className="flex flex-1 flex-col">
          <DashboardTopbar title={title} subtitle={subtitle} />
          <main className="flex-1 space-y-6 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </section>
  );
}

export default DashboardLayout;
