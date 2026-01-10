export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  notes?: string;
  createdAt: Date;
}
