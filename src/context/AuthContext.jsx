import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("lumiere_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("lumiere_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("lumiere_token");
      if (storedToken) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem("lumiere_user", JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("lumiere_token", res.token);
      localStorage.setItem("lumiere_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || "Login failed");
  };

  const register = async (name, email, phone, password) => {
    const res = await api.auth.register({ name, email, phone, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("lumiere_token", res.token);
      localStorage.setItem("lumiere_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || "Registration failed");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("lumiere_token");
    localStorage.removeItem("lumiere_user");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
