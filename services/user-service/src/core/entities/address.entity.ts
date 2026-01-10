export interface Address {
  id: string;
  customerId: string;
  label?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: Date;
}
