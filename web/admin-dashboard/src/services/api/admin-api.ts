import axiosInstance from "./axios-instance";

export const adminApi = {
  // Dashboard Overview
  getStats: () => axiosInstance.get("/admin/dashboard"),

  // Users Management
  getUsers: (role?: string) => axiosInstance.get("/admin/users", { params: { role } }),
  getUserById: (id: string) => axiosInstance.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) => axiosInstance.patch(`/admin/users/${id}/status`, { status }),

  // Vendors Management
  getVendors: () => axiosInstance.get("/admin/vendors"),
  getVendorById: (id: string) => axiosInstance.get(`/admin/vendors/${id}`),
  updateVendorStatus: (id: string, status: string) => axiosInstance.patch(`/admin/vendors/${id}/status`, { status }),

  // Orders Management
  getOrders: () => axiosInstance.get("/admin/orders"),
  getOrderById: (id: string) => axiosInstance.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => axiosInstance.patch(`/admin/orders/${id}/status`, { status }),

  // Delivery Monitoring
  getDeliveries: () => axiosInstance.get("/admin/deliveries"),
  getCouriers: () => axiosInstance.get("/admin/couriers"),

  // Financial Overview
  getRevenue: () => axiosInstance.get("/admin/revenue"),
  getPayouts: () => axiosInstance.get("/admin/payouts"),
};
