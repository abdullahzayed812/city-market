import { randomUUID } from "crypto";
import { ICourierRepository } from "../../core/interfaces/courier.repository";
import { IDeliveryRepository } from "../../core/interfaces/delivery.repository";
import { Courier } from "../../core/entities/courier.entity";
import { Delivery } from "../../core/entities/delivery.entity";
import { RegisterCourierDto, UpdateCourierDto } from "../../core/dto/courier.dto";
import { CreateDeliveryDto, AssignCourierDto, UpdateDeliveryStatusDto } from "../../core/dto/delivery.dto";
import { DeliveryStatus } from "@city-market/shared";
import { ValidationError, NotFoundError } from "@city-market/shared";
import { EventBus, EventType } from "@city-market/shared";

export class DeliveryService {
  constructor(
    private courierRepo: ICourierRepository,
    private deliveryRepo: IDeliveryRepository,
    private eventBus: EventBus
  ) { }

  // Courier management
  async registerCourier(dto: RegisterCourierDto): Promise<Courier> {
    const existing = await this.courierRepo.findByUserId(dto.userId);
    if (existing) {
      throw new ValidationError("Courier already registered for this user");
    }

    const courier: Courier = {
      id: randomUUID(),
      userId: dto.userId,
      fullName: dto.fullName,
      phone: dto.phone,
      vehicleType: dto.vehicleType,
      licensePlate: dto.licensePlate,
      isAvailable: true,
      isActive: true,
      rating: 5.0,
      totalDeliveries: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.courierRepo.create(courier);
  }

  async getCourierById(id: string): Promise<Courier> {
    const courier = await this.courierRepo.findById(id);
    if (!courier) {
      throw new NotFoundError("Courier not found");
    }
    return courier;
  }

  async getCourierByUserId(userId: string): Promise<Courier> {
    const courier = await this.courierRepo.findByUserId(userId);
    if (!courier) {
      throw new NotFoundError("Courier not found");
    }
    return courier;
  }

  async getAvailableCouriers(): Promise<Courier[]> {
    return this.courierRepo.findAvailable();
  }

  async updateCourier(id: string, dto: UpdateCourierDto): Promise<void> {
    await this.getCourierById(id);
    await this.courierRepo.update(id, dto);
  }

  async updateCourierAvailability(id: string, isAvailable: boolean): Promise<void> {
    await this.getCourierById(id);
    await this.courierRepo.updateAvailability(id, isAvailable);
  }

  // Delivery management
  async createDelivery(dto: CreateDeliveryDto): Promise<Delivery> {
    const delivery: Delivery = {
      id: randomUUID(),
      orderId: dto.orderId,
      status: DeliveryStatus.PENDING,
      pickupAddress: dto.pickupAddress,
      deliveryAddress: dto.deliveryAddress,
      pickupLatitude: dto.pickupLatitude,
      pickupLongitude: dto.pickupLongitude,
      deliveryLatitude: dto.deliveryLatitude,
      deliveryLongitude: dto.deliveryLongitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.deliveryRepo.create(delivery);
  }

  async getDeliveryById(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findById(id);
    if (!delivery) {
      throw new NotFoundError("Delivery not found");
    }
    return delivery;
  }

  async getDeliveryByOrderId(orderId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findByOrderId(orderId);
    if (!delivery) {
      throw new NotFoundError("Delivery not found");
    }
    return delivery;
  }

  async getPendingDeliveries(): Promise<Delivery[]> {
    return this.deliveryRepo.findPending();
  }

  async getCourierDeliveries(courierId: string, page: number = 1, limit: number = 20): Promise<Delivery[]> {
    const offset = (page - 1) * limit;
    return this.deliveryRepo.findByCourier(courierId, limit, offset);
  }

  async assignCourier(deliveryId: string, dto: AssignCourierDto): Promise<void> {
    const delivery = await this.getDeliveryById(deliveryId);
    const courier = await this.getCourierById(dto.courierId);

    if (delivery.status !== DeliveryStatus.PENDING) {
      throw new ValidationError("Delivery already assigned");
    }

    if (!courier.isAvailable) {
      throw new ValidationError("Courier is not available");
    }

    await this.deliveryRepo.assignCourier(deliveryId, dto.courierId);
    await this.courierRepo.updateAvailability(dto.courierId, false);

    await this.eventBus.publish({
      id: randomUUID(),
      type: EventType.COURIER_ASSIGNED,
      timestamp: new Date(),
      payload: { deliveryId, courierId: dto.courierId, orderId: delivery.orderId },
    });
  }

  async updateDeliveryStatus(deliveryId: string, dto: UpdateDeliveryStatusDto): Promise<void> {
    const delivery = await this.getDeliveryById(deliveryId);

    const updates: Partial<Delivery> = {
      status: dto.status,
      notes: dto.notes,
    };

    if (dto.status === DeliveryStatus.PICKED_UP) {
      updates.pickedUpAt = new Date();
      await this.eventBus.publish({
        id: randomUUID(),
        type: EventType.ORDER_PICKED_UP,
        timestamp: new Date(),
        payload: { deliveryId, orderId: delivery.orderId },
      });
    }

    if (dto.status === DeliveryStatus.DELIVERED) {
      updates.deliveredAt = new Date();
      if (delivery.courierId) {
        await this.courierRepo.updateAvailability(delivery.courierId, true);
        await this.courierRepo.incrementDeliveries(delivery.courierId);
      }
      await this.eventBus.publish({
        id: randomUUID(),
        type: EventType.ORDER_DELIVERED,
        timestamp: new Date(),
        payload: { deliveryId, orderId: delivery.orderId },
      });
    }

    await this.deliveryRepo.update(deliveryId, updates);
  }
}
