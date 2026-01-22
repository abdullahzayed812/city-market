import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api/auth.service";

interface AuthContextType {
  user: any;
  courier: any;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [courier, setCourier] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("courier_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("courier_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setCourier(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);

    localStorage.setItem("courier_token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("courier_refresh_token", data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem("courier_user", JSON.stringify(data.user));
      setUser(data.user);
      setCourier(data.user);
    }
    setToken(data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem("courier_token");
    setToken(null);
    setUser(null);
    setCourier(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, courier, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
