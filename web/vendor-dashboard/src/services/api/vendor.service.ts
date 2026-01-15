import apiClient from "./client";

export const vendorService = {
    getMyProfile: async () => {
        const response = await apiClient.get("/vendors/me");
        return response.data;
    },
    updateProfile: async (id: string, data: any) => {
        const response = await apiClient.patch(`/vendors/${id}`, data);
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await apiClient.patch(`/vendors/${id}/status`, { status });
        return response.data;
    },
    setWorkingHours: async (id: string, workingHours: any[]) => {
        const response = await apiClient.post(`/vendors/${id}/working-hours`, workingHours);
        return response.data;
    },
    getWorkingHours: async (id: string) => {
        const response = await apiClient.get(`/vendors/${id}/working-hours`);
        return response.data;
    },
};
