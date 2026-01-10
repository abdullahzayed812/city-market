import { DeliveryStatus } from "../../../../shared/enums/delivery-status";

export interface Delivery {
  id: string;
  orderId: string;
  courierId?: string;
  status: DeliveryStatus;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  assignedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
