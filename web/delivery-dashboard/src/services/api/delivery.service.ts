import apiClient from "./client";

export const deliveryService = {
  // Couriers Management
  getAllCouriers: async () => {
    const response = await apiClient.get("/delivery/couriers");
    return response.data?.data;
  },

  getAvailableCouriers: async () => {
    const response = await apiClient.get("/delivery/couriers/available");
    return response.data?.data;
  },

  // Deliveries Management
  getAllDeliveries: async () => {
    const response = await apiClient.get("/delivery/deliveries");
    return response.data?.data;
  },

  getPendingDeliveries: async () => {
    const response = await apiClient.get("/delivery/deliveries/pending");
    return response.data?.data;
  },

  getDeliveryDetails: async (id: string) => {
    const response = await apiClient.get(`/delivery/deliveries/${id}`);
    return response.data?.data;
  },

  assignCourier: async (deliveryId: string, courierId: string) => {
    const response = await apiClient.post(`/delivery/deliveries/${deliveryId}/assign`, { courierId });
    return response.data?.data;
  },

  updateDeliveryStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/delivery/deliveries/${id}/status`, { status });
    return response.data?.data;
  },
};
