import axios from "axios";

export class ServiceClient {
  constructor(
    private orderServiceUrl: string,
    private vendorServiceUrl: string,
    private deliveryServiceUrl: string,
    private userServiceUrl: string
  ) {}

  async getAllOrders(page: number = 1, limit: number = 50) {
    const response = await axios.get(`${this.orderServiceUrl}/orders`, {
      params: { page, limit },
    });
    return response.data;
  }

  async getAllVendors(page: number = 1, limit: number = 50) {
    const response = await axios.get(`${this.vendorServiceUrl}/vendors`, {
      params: { page, limit },
    });
    return response.data;
  }

  async updateVendorCommission(vendorId: string, rate: number) {
    const response = await axios.patch(`${this.vendorServiceUrl}/vendors/${vendorId}/commission`, { rate });
    return response.data;
  }

  async suspendVendor(vendorId: string) {
    const response = await axios.patch(`${this.vendorServiceUrl}/vendors/${vendorId}/status`, { status: "SUSPENDED" });
    return response.data;
  }

  async getAllCouriers(page: number = 1, limit: number = 50) {
    const response = await axios.get(`${this.deliveryServiceUrl}/couriers`, {
      params: { page, limit },
    });
    return response.data;
  }

  async deactivateCourier(courierId: string) {
    const response = await axios.patch(`${this.deliveryServiceUrl}/couriers/${courierId}/deactivate`);
    return response.data;
  }
}
