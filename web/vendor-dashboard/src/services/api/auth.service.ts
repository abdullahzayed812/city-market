import apiClient from "./client";

export const authService = {
    login: async (credentials: any) => {
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    },
    register: async (data: any) => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },
    logout: async (refreshToken: string) => {
        const response = await apiClient.post("/auth/logout", { refreshToken });
        return response.data;
    },
    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post("/auth/refresh", { refreshToken });
        return response.data;
    },
};
