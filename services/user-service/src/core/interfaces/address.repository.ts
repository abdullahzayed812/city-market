import { Address } from "../entities/address.entity";

export interface IAddressRepository {
  create(address: Address): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByCustomer(customerId: string): Promise<Address[]>;
  update(id: string, data: Partial<Address>): Promise<void>;
  delete(id: string): Promise<void>;
  clearDefaultForCustomer(customerId: string): Promise<void>;
}
