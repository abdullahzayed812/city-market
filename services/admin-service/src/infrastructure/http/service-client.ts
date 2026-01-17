import axios from "axios";

export class ServiceClient {
  constructor(
    private orderServiceUrl: string,
    private vendorServiceUrl: string,
    private deliveryServiceUrl: string,
    private userServiceUrl: string
  ) {}

  async getAllOrders(page: number = 1, limit: number = 50, token?: string) {
    const response = await axios.get(`${this.orderServiceUrl}/orders`, {
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
}
