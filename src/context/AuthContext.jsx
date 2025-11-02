import { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  logout as logoutService,
  getProfile,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("access");
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const data = await loginService(credentials);
    const userData = await getProfile();
    setUser(userData);
    return data;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
