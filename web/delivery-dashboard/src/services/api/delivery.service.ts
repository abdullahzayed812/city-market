import apiClient from "./client";

export const deliveryService = {
    // Courier Profile
    getProfile: async () => {
        const response = await apiClient.get("/delivery/couriers/me");
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await apiClient.patch("/delivery/couriers/me", data);
        return response.data;
    },
    updateAvailability: async (isOnline: boolean) => {
        const response = await apiClient.patch("/delivery/couriers/me/availability", { isOnline });
        return response.data;
    },

    // Deliveries
    getAssignedDeliveries: async () => {
        const response = await apiClient.get("/delivery/orders/assigned");
        return response.data;
    },
    getDeliveryDetails: async (id: string) => {
        const response = await apiClient.get(`/delivery/orders/${id}`);
        return response.data;
    },
    updateDeliveryStatus: async (id: string, status: string, otp?: string) => {
        const response = await apiClient.patch(`/delivery/orders/${id}/status`, { status, otp });
        return response.data;
    },

    // Earnings
    getEarnings: async (period: "daily" | "weekly" | "monthly" = "daily") => {
        const response = await apiClient.get("/delivery/earnings", { params: { period } });
        return response.data;
    },
    getEarningsHistory: async () => {
        const response = await apiClient.get("/delivery/earnings/history");
        return response.data;
    },
};
