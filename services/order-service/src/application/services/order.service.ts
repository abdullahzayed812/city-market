import { randomUUID } from "crypto";
import { IOrderRepository } from "../../core/interfaces/order.repository";
import { IOrderItemRepository } from "../../core/interfaces/order-item.repository";
import { IOrderStatusHistoryRepository } from "../../core/interfaces/order-status-history.repository";
import { Order } from "../../core/entities/order.entity";
import { OrderItem } from "../../core/entities/order-item.entity";
import { OrderStatusHistory } from "../../core/entities/order-status-history.entity";
import { CreateOrderDto, UpdateOrderStatusDto, OrderWithItems } from "../../core/dto/order.dto";
import { OrderStatus } from "@city-market/shared";
import { ValidationError, NotFoundError } from "@city-market/shared";
import { RabbitMQBus, EventType } from "@city-market/shared";
import { CatalogHttpClient } from "../../infrastructure/http/catalog-http-client";

const DELIVERY_FEE = 15.0;
const COMMISSION_RATE = 0.1;

export class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private orderItemRepo: IOrderItemRepository,
    private statusHistoryRepo: IOrderStatusHistoryRepository,
    private catalogClient: CatalogHttpClient,
    private eventBus: RabbitMQBus
  ) { }

  async createOrder(dto: CreateOrderDto, token?: string): Promise<OrderWithItems> {
    if (dto.items.length === 0) {
      throw new ValidationError("Order must have at least one item");
    }

    // Fetch product information
    const productInfos = await Promise.all(
      dto.items.map((item) => this.catalogClient.getProduct(item.productId, token))
    );

    // Validate products
    for (let i = 0; i < productInfos.length; i++) {
      const product = productInfos[i];
      const orderItem = dto.items[i];

      if (!product) {
        throw new ValidationError(`Product ${orderItem.productId} not found`);
      }

      if (!product.isAvailable) {
        throw new ValidationError(`Product ${product.name} is not available`);
      }

      if (product.stockQuantity < orderItem.quantity) {
        throw new ValidationError(`Insufficient stock for ${product.name}`);
      }
    }

    // Calculate totals
    let subtotal = 0;
    const items: OrderItem[] = [];

    for (let i = 0; i < dto.items.length; i++) {
      const product = productInfos[i]!;
      const orderItem = dto.items[i];

      const itemTotal = product.price * orderItem.quantity;
      subtotal += itemTotal;

      items.push({
        id: randomUUID(),
        orderId: "", // Will be set after order creation
        productId: product.id,
        productName: product.name,
        quantity: orderItem.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });
    }

    const deliveryFee = DELIVERY_FEE;
    const commissionAmount = subtotal * COMMISSION_RATE;
    const totalAmount = subtotal + deliveryFee;

    // Create order
    const order: Order = {
      id: randomUUID(),
      customerId: dto.customerId,
      vendorId: dto.vendorId,
      status: OrderStatus.CREATED,
      subtotal,
      deliveryFee,
      commissionAmount,
      totalAmount,
      deliveryAddress: dto.deliveryAddress,
      deliveryLatitude: dto.deliveryLatitude,
      deliveryLongitude: dto.deliveryLongitude,
      customerNotes: dto.customerNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.orderRepo.create(order);

    // Set order ID for items
    items.forEach((item) => (item.orderId = order.id));
    await this.orderItemRepo.createMany(items);

    // Record status history
    await this.recordStatusChange(order.id, OrderStatus.CREATED);

    // Decrement stock
    for (let i = 0; i < dto.items.length; i++) {
      await this.catalogClient.checkAndDecrementStock(dto.items[i].productId, dto.items[i].quantity);
    }

    // Emit event
    // await this.eventBus.publish({
    //   id: randomUUID(),
    //   type: EventType.ORDER_CREATED,
    //   timestamp: new Date(),
    //   payload: { orderId: order.id, customerId: order.customerId, vendorId: order.vendorId },
    // });

    return { order, items };
  }

  async getOrderById(id: string): Promise<OrderWithItems> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const items = await this.orderItemRepo.findByOrderId(id);
    return { order, items };
  }

  async getCustomerOrders(customerId: string, page: number = 1, limit: number = 20): Promise<Order[]> {
    const offset = (page - 1) * limit;
    return this.orderRepo.findByCustomer(customerId, limit, offset);
  }

  async getVendorOrders(vendorId: string, page: number = 1, limit: number = 20): Promise<Order[]> {
    const offset = (page - 1) * limit;
    return this.orderRepo.findByVendor(vendorId, limit, offset);
  }

  async getAllOrders(page: number = 1, limit: number = 20): Promise<Order[]> {
    const offset = (page - 1) * limit;
    return this.orderRepo.findAll(limit, offset);
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto, token?: string): Promise<void> {
    const { order } = await this.getOrderById(orderId);

    // Validate status transition
    if (!this.isValidStatusTransition(order.status, dto.status)) {
      throw new ValidationError(`Cannot transition from ${order.status} to ${dto.status}`);
    }

    await this.orderRepo.updateStatus(orderId, dto.status);
    await this.recordStatusChange(orderId, dto.status, dto.notes);

    // Emit events
    const eventType = this.getEventTypeForStatus(dto.status);
    if (eventType) {
      await this.eventBus.publish({
        id: randomUUID(),
        type: eventType,
        timestamp: new Date(),
        payload: { orderId, status: dto.status, token },
      });
    }
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    const { order } = await this.getOrderById(orderId);

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new ValidationError("Cannot cancel this order");
    }

    await this.orderRepo.update(orderId, {
      status: OrderStatus.CANCELLED,
      cancellationReason: reason,
    });

    await this.recordStatusChange(orderId, OrderStatus.CANCELLED, reason);

    // await this.eventBus.publish({
    //   id: randomUUID(),
    //   type: EventType.ORDER_CANCELLED,
    //   timestamp: new Date(),
    //   payload: { orderId, reason },
    // });
  }

  private async recordStatusChange(orderId: string, status: OrderStatus, notes?: string): Promise<void> {
    const history: OrderStatusHistory = {
      id: randomUUID(),
      orderId,
      status,
      notes,
      createdAt: new Date(),
    };
    await this.statusHistoryRepo.create(history);
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.CREATED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.ON_THE_WAY, OrderStatus.CANCELLED],
      [OrderStatus.ON_THE_WAY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return transitions[currentStatus]?.includes(newStatus) || false;
  }

  private getEventTypeForStatus(status: OrderStatus): EventType | null {
    const mapping: Partial<Record<OrderStatus, EventType>> = {
      [OrderStatus.CONFIRMED]: EventType.ORDER_CONFIRMED,
      [OrderStatus.READY]: EventType.ORDER_READY,
      [OrderStatus.DELIVERED]: EventType.ORDER_DELIVERED,
    };
    return mapping[status] || null;
  }
}
