import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api/auth.service";
import { vendorService } from "@/services/api/vendor.service";

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
            if (token) {
                try {
                    const vendorData = await vendorService.getMyProfile();
                    setVendor(vendorData);
                    // Assuming user data is part of the vendor profile or can be fetched separately
                    setUser(vendorData.user);
                } catch (error) {
                    console.error("Failed to fetch vendor profile", error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (credentials: any) => {
        const data = await authService.login(credentials);
        localStorage.setItem("vendor_token", data.token);
        setToken(data.token);
    };

    const logout = () => {
        localStorage.removeItem("vendor_token");
        setToken(null);
        setUser(null);
        setVendor(null);
    };

    return (
        <AuthContext.Provider value={{ user, vendor, token, login, logout, isLoading }}>
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
