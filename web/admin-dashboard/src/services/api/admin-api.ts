import axiosInstance from "./axios-instance";

export const adminApi = {
  // Dashboard Overview
  getStats: () => axiosInstance.get("/admin/dashboard"),

  // Users Management
  getUsers: (role?: string) => axiosInstance.get("/admin/users", { params: { role } }),
  getUserById: (id: string) => axiosInstance.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) => axiosInstance.patch(`/admin/users/${id}/status`, { status }),

  // Vendors Management
  getVendors: () => axiosInstance.get("/vendors"),
  getVendorById: (id: string) => axiosInstance.get(`/vendors/${id}`),
  updateVendorStatus: (id: string, status: string) => axiosInstance.patch(`/vendors/${id}/status`, { status }),

  // Orders Management
  getOrders: () => axiosInstance.get("/orders"),
  getOrderById: (id: string) => axiosInstance.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => axiosInstance.patch(`/orders/${id}/status`, { status }),

  // Delivery Monitoring
  getDeliveries: () => axiosInstance.get("/deliveries"),
  getCouriers: () => axiosInstance.get("/couriers/available"),

  // Financial Overview
  getRevenue: () => axiosInstance.get("/admin/revenue"),
  getPayouts: () => axiosInstance.get("/admin/payouts"),
};
