import { Customer } from "../entities/customer.entity";

export interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByUserId(userId: string): Promise<Customer | null>;
  update(id: string, data: Partial<Customer>): Promise<void>;
}
