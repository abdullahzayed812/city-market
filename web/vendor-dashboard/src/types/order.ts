export enum OrderStatus {
    CREATED = "CREATED",
    CONFIRMED = "CONFIRMED",
    PREPARING = "PREPARING",
    READY = "READY",
    PICKED_UP = "PICKED_UP",
    ON_THE_WAY = "ON_THE_WAY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export interface Order {
    id: string;
    customerId: string;
    vendorId: string;
    status: OrderStatus;
    subtotal: number;
    deliveryFee: number;
    commissionAmount: number;
    totalAmount: number;
    deliveryAddress: string;
    customerNotes?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
    customerName?: string;
}
