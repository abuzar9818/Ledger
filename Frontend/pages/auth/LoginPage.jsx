import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function getHomePathByRole(role) {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setApiError("");
    setApiSuccess("");

    try {
      const response = await api.post("/auth/login", formData);
      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      login({ token, user });
      setApiSuccess(response.data?.message || "Logged in successfully");

      const requestedPath = location.state?.from?.pathname;
      const fallbackPath = getHomePathByRole(user.role);
      const nextPath = requestedPath || fallbackPath;

      setTimeout(() => {
        navigate(nextPath, { replace: true });
      }, 600);
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to continue to your ledger dashboard.</p>

      {apiSuccess ? (
        <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {apiSuccess}
        </p>
      ) : null}

      {apiError ? (
        <p className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {apiError}
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-slate-900 to-teal-900 px-4 py-2.5 text-white shadow-lg shadow-slate-900/15 transition hover:from-slate-800 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        New here?{" "}
        <Link to="/auth/register" className="font-medium text-slate-900 hover:underline">
          Create account
        </Link>
        </p>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-teal-700 transition hover:text-teal-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default LoginPage;
