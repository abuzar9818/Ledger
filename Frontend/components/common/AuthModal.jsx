import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function getHomePathByRole(role) {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}

function AuthModal({ mode = "login", onClose, onSwitchMode }) {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const isLoginMode = useMemo(() => mode !== "register", [mode]);

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    setApiError("");
    setApiSuccess("");
  }, [mode]);

  const handleLogin = async (formData) => {
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

      setTimeout(() => {
        onClose();
        navigate(getHomePathByRole(user.role), { replace: true });
      }, 400);
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = async (formData) => {
    setApiError("");
    setApiSuccess("");

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setApiSuccess("Registration successful. Please sign in.");
      setTimeout(() => {
        onSwitchMode("login");
      }, 700);
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={isLoginMode ? "Login" : "Register"}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Secure Access</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {isLoginMode ? "Welcome back" : "Create your account"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-btn ui-btn-soft px-3 py-1.5 text-xs font-semibold"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              isLoginMode ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode("register")}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              !isLoginMode ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            Register
          </button>
        </div>

        {apiSuccess ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {apiSuccess}
          </p>
        ) : null}

        {apiError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {apiError}
          </p>
        ) : null}

        {isLoginMode ? (
          <form className="mt-5 space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
            <div>
              <label htmlFor="modal-login-email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="modal-login-email"
                type="email"
                className="ui-input"
                {...loginForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {loginForm.formState.errors.email ? (
                <p className="mt-1 text-xs text-rose-600">{loginForm.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="modal-login-password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="modal-login-password"
                type="password"
                className="ui-input"
                {...loginForm.register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {loginForm.formState.errors.password ? (
                <p className="mt-1 text-xs text-rose-600">{loginForm.formState.errors.password.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              className="ui-btn ui-btn-primary w-full px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginForm.formState.isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={registerForm.handleSubmit(handleRegister)} noValidate>
            <div>
              <label htmlFor="modal-register-name" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="modal-register-name"
                type="text"
                className="ui-input"
                {...registerForm.register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {registerForm.formState.errors.name ? (
                <p className="mt-1 text-xs text-rose-600">{registerForm.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="modal-register-email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="modal-register-email"
                type="email"
                className="ui-input"
                {...registerForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {registerForm.formState.errors.email ? (
                <p className="mt-1 text-xs text-rose-600">{registerForm.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="modal-register-password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="modal-register-password"
                type="password"
                className="ui-input"
                {...registerForm.register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {registerForm.formState.errors.password ? (
                <p className="mt-1 text-xs text-rose-600">{registerForm.formState.errors.password.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="modal-register-confirm" className="mb-1 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="modal-register-confirm"
                type="password"
                className="ui-input"
                {...registerForm.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value, values) => value === values.password || "Passwords do not match",
                })}
              />
              {registerForm.formState.errors.confirmPassword ? (
                <p className="mt-1 text-xs text-rose-600">{registerForm.formState.errors.confirmPassword.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={registerForm.formState.isSubmitting}
              className="ui-btn ui-btn-primary w-full px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {registerForm.formState.isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
