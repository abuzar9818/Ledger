import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TransferPage from "../pages/dashboard/TransferPage";
import TransactionHistoryPage from "../pages/dashboard/TransactionHistoryPage";
import ScheduledTransfersPage from "../pages/dashboard/ScheduledTransfersPage";
import ReportsPage from "../pages/dashboard/ReportsPage";
import AdminPage from "../pages/admin/AdminPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute";

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
        <Route path="/dashboard/reports" element={<ReportsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
