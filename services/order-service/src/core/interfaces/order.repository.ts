import { Order } from "../entities/order.entity";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByCustomer(customerId: string, limit: number, offset: number): Promise<Order[]>;
  findByVendor(vendorId: string, limit: number, offset: number): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  findAll(limit: number, offset: number): Promise<Order[]>;
  updateStatus(id: string, status: string): Promise<void>;
  update(id: string, data: Partial<Order>): Promise<void>;
}
