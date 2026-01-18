import axios from "axios";

export class ServiceClient {
  constructor(
    private orderServiceUrl: string,
    private vendorServiceUrl: string,
    private deliveryServiceUrl: string,
    private userServiceUrl: string,
    private authServiceUrl: string
  ) {}

  async getAllOrders(page: number = 1, limit: number = 50, token?: string) {
    const response = await axios.get(`${this.orderServiceUrl}/orders`, {
      params: { page, limit },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async getAllUsers(page: number = 1, limit: number = 50, token?: string) {
    const response = await axios.get(`${this.authServiceUrl}/users`, {
      params: { page, limit },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async getAllVendors(page: number = 1, limit: number = 50, token?: string) {
    const response = await axios.get(`${this.vendorServiceUrl}/vendors`, {
      params: { page, limit },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async updateVendorCommission(vendorId: string, rate: number, token?: string) {
    const response = await axios.patch(
      `${this.vendorServiceUrl}/vendors/${vendorId}/commission`,
      { rate },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  }

  async suspendVendor(vendorId: string, token?: string) {
    const response = await axios.patch(
      `${this.vendorServiceUrl}/vendors/${vendorId}/status`,
      { status: "SUSPENDED" },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  }

  async getAllCouriers(page: number = 1, limit: number = 50, token?: string) {
    const response = await axios.get(`${this.deliveryServiceUrl}/couriers`, {
      params: { page, limit },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async deactivateCourier(courierId: string, token?: string) {
    const response = await axios.patch(`${this.deliveryServiceUrl}/couriers/${courierId}/deactivate`, null, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async getUserById(id: string, token?: string) {
    const response = await axios.get(`${this.authServiceUrl}/users/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async updateUserStatus(id: string, status: string, token?: string) {
    const response = await axios.patch(
      `${this.authServiceUrl}/users/${id}/status`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  }

  async getVendorById(id: string, token?: string) {
    const response = await axios.get(`${this.vendorServiceUrl}/vendors/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async updateVendorStatus(id: string, status: string, token?: string) {
    const response = await axios.patch(
      `${this.vendorServiceUrl}/vendors/${id}/status`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  }

  async getOrderById(id: string, token?: string) {
    const response = await axios.get(`${this.orderServiceUrl}/orders/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async updateOrderStatus(id: string, status: string, token?: string) {
    const response = await axios.patch(
      `${this.orderServiceUrl}/orders/${id}/status`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  }

  async getDeliveries(token?: string) {
    const response = await axios.get(`${this.deliveryServiceUrl}/deliveries`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async getAvailableCouriers(token?: string) {
    const response = await axios.get(`${this.deliveryServiceUrl}/couriers/available`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }
}
