import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/services/api/client";

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
            if (token) {
                try {
                    const response = await apiClient.get("/delivery/couriers/me");
                    setCourier(response.data);
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Failed to fetch courier profile", error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (credentials: any) => {
        const response = await apiClient.post("/auth/login", credentials);
        const { token: newToken } = response.data;
        localStorage.setItem("courier_token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("courier_token");
        setToken(null);
        setUser(null);
        setCourier(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, courier, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
