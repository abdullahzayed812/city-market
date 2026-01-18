import { Delivery } from "../entities/delivery.entity";

export interface IDeliveryRepository {
  create(delivery: Delivery): Promise<Delivery>;
  findById(id: string): Promise<Delivery | null>;
  findByOrderId(orderId: string): Promise<Delivery | null>;
  findByCourier(courierId: string, limit: number, offset: number): Promise<Delivery[]>;
  findPending(): Promise<Delivery[]>;
  findByStatus(status: string): Promise<Delivery[]>;
  findAll(limit: number, offset: number): Promise<Delivery[]>;
  update(id: string, data: Partial<Delivery>): Promise<void>;
  assignCourier(id: string, courierId: string): Promise<void>;
}
