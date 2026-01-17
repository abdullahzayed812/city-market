import { ServiceClient } from "../../infrastructure/http/service-client";
import { Logger } from "@city-market/shared";

export interface DashboardStats {
  totalOrders: number;
  totalVendors: number;
  totalCouriers: number;
  revenueToday: number;
}

export class AdminService {
  constructor(private serviceClient: ServiceClient) { }

  async getDashboardStats(token?: string): Promise<DashboardStats> {
    Logger.info("Fetching dashboard statistics");

    const [ordersData, vendorsData, couriersData] = await Promise.all([
      this.serviceClient.getAllOrders(1, 100, token),
      this.serviceClient.getAllVendors(1, 100, token),
      this.serviceClient.getAllCouriers(1, 100, token),
    ]);

    const stats: DashboardStats = {
      totalOrders: ordersData.data?.length || 0,
      totalVendors: vendorsData.data?.length || 0,
      totalCouriers: couriersData.data?.length || 0,
      revenueToday: 0, // Calculate from orders
    };

    return stats;
  }

  async getAllOrders(page: number = 1, limit: number = 50, token?: string) {
    return this.serviceClient.getAllOrders(page, limit, token);
  }

  async getAllVendors(page: number = 1, limit: number = 50, token?: string) {
    return this.serviceClient.getAllVendors(page, limit, token);
  }

  async updateVendorCommission(vendorId: string, rate: number, token?: string) {
    if (rate < 0 || rate > 100) {
      throw new Error("Commission rate must be between 0 and 100");
    }
    return this.serviceClient.updateVendorCommission(vendorId, rate, token);
  }

  async suspendVendor(vendorId: string, token?: string) {
    Logger.warn(`Suspending vendor ${vendorId}`);
    return this.serviceClient.suspendVendor(vendorId, token);
  }

  async getAllCouriers(page: number = 1, limit: number = 50, token?: string) {
    return this.serviceClient.getAllCouriers(page, limit, token);
  }

  async deactivateCourier(courierId: string, token?: string) {
    Logger.warn(`Deactivating courier ${courierId}`);
    return this.serviceClient.deactivateCourier(courierId, token);
  }
}
