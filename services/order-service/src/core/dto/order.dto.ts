import { OrderStatus } from "../../../../shared/enums/order-status";
import { OrderItem } from "../entities/order-item.entity";
import { Order } from "../entities/order.entity";

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  customerId: string;
  vendorId: string;
  items: CreateOrderItemDto[];
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  customerNotes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}
