import { OrderStatusHistory } from "../entities/order-status-history.entity";

export interface IOrderStatusHistoryRepository {
  create(history: OrderStatusHistory): Promise<void>;
  findByOrderId(orderId: string): Promise<OrderStatusHistory[]>;
}
