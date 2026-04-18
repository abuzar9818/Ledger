import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TransferPage from "../pages/dashboard/TransferPage";
import TransactionHistoryPage from "../pages/dashboard/TransactionHistoryPage";
import AdminPage from "../pages/admin/AdminPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />

      <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/transfer" element={<TransferPage />} />
        <Route path="/dashboard/transactions" element={<TransactionHistoryPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
