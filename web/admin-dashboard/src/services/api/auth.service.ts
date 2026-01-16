import axiosInstance from "./axios-instance";

export const authService = {
  login: async (credentials: any) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data.data;
  },
  logout: async (refreshToken: string) => {
    const response = await axiosInstance.post("/auth/logout", { refreshToken });
    return response.data.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post("/auth/refresh", { refreshToken });
    return response.data.data;
  },
};
