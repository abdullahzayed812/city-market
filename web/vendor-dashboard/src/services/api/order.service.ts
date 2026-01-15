import apiClient from "./client";

export const orderService = {
    getVendorOrders: async (vendorId: string) => {
        const response = await apiClient.get(`/orders/vendor/${vendorId}`);
        return response.data;
    },
    getOrderById: async (id: string) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },
    updateOrderStatus: async (id: string, status: string) => {
        const response = await apiClient.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
    cancelOrder: async (id: string) => {
        const response = await apiClient.post(`/orders/${id}/cancel`);
        return response.data;
    },
};
