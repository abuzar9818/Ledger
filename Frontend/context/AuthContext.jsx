import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function getStoredAuth() {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("authUser");

  if (!token || !userJson) {
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(userJson);
    return { token, user };
  } catch (_error) {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getStoredAuth);

  useEffect(() => {
    const handleForcedLogout = () => {
      setAuthState({ token: null, user: null });
    };

    window.addEventListener("auth:logout", handleForcedLogout);
    return () => {
      window.removeEventListener("auth:logout", handleForcedLogout);
    };
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuthState({ token, user });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_error) {
      // Local logout should still proceed even if API call fails.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      setAuthState({ token: null, user: null });
    }
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...authState.user, ...updatedUserData };
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setAuthState((prev) => ({ ...prev, user: newUser }));
  };

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
      updateUser,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
