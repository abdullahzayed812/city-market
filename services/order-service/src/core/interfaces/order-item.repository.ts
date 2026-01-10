import { OrderItem } from "../entities/order-item.entity";

export interface IOrderItemRepository {
  createMany(items: OrderItem[]): Promise<void>;
  findByOrderId(orderId: string): Promise<OrderItem[]>;
}
