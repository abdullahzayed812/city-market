export interface Product {
  id: string;
  vendorId: string;
  categoryId?: string;
  categoryName?: string | null;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
