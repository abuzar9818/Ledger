import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TransferPage from "../pages/dashboard/TransferPage";
import TransactionHistoryPage from "../pages/dashboard/TransactionHistoryPage";
import ScheduledTransfersPage from "../pages/dashboard/ScheduledTransfersPage";
import AdminPage from "../pages/admin/AdminPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/transfer" element={<TransferPage />} />
        <Route path="/dashboard/transactions" element={<TransactionHistoryPage />} />
        <Route path="/dashboard/scheduled-transfers" element={<ScheduledTransfersPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route path="/auth/login" element={<Navigate to="/?auth=login" replace />} />
      <Route path="/auth/register" element={<Navigate to="/?auth=register" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
