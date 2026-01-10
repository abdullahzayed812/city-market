import { ShopStatus } from "../../../../shared/enums/shop-status";

export interface Vendor {
  id: string;
  userId: string;
  shopName: string;
  shopDescription?: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: ShopStatus;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
