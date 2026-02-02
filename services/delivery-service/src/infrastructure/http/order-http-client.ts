import axios from "axios";
import { Logger } from "@city-market/shared";

export class OrderHttpClient {
  constructor(private baseUrl: string) {}

  async getOrder(orderId: string, token?: string): Promise<any | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      Logger.error(`Failed to fetch order ${orderId}`, error);
      return null;
    }
  }
}
