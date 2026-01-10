import { Courier } from "../entities/courier.entity";

export interface ICourierRepository {
  create(courier: Courier): Promise<Courier>;
  findById(id: string): Promise<Courier | null>;
  findByUserId(userId: string): Promise<Courier | null>;
  findAvailable(): Promise<Courier[]>;
  findAll(limit: number, offset: number): Promise<Courier[]>;
  update(id: string, data: Partial<Courier>): Promise<void>;
  updateAvailability(id: string, isAvailable: boolean): Promise<void>;
  incrementDeliveries(id: string): Promise<void>;
}
