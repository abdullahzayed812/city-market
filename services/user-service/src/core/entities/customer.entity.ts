export interface Customer {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
