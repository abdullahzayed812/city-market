import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api/auth.service";

interface AuthContextType {
  user: any;
  vendor: any;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("vendor_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("vendor_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setVendor(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);

    localStorage.setItem("vendor_token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("vendor_refresh_token", data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem("vendor_user", JSON.stringify(data.user));
      setUser(data.user);
      setVendor(data.user);
    }
    setToken(data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem("vendor_token");
    setToken(null);
    setUser(null);
    setVendor(null);
  };

  return (
    <AuthContext.Provider value={{ user, vendor, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
