import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
