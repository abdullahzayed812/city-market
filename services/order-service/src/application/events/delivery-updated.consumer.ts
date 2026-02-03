import { BaseEvent, EventSubscriber, EventType, Logger, OrderStatus } from "@city-market/shared";
import { OrderService } from "../services/order.service";

export class DeliveryUpdatedConsumer implements EventSubscriber {
    constructor(private orderService: OrderService) { }

    async handle(event: BaseEvent): Promise<void> {
        try {
            const { orderId } = event.payload;
            Logger.info(`Processing delivery update event ${event.type} for order ${orderId}`);

            if (event.type === EventType.ORDER_PICKED_UP) {
                await this.orderService.updateOrderStatus(orderId, {
                    status: OrderStatus.PICKED_UP,
                    notes: "Order picked up by courier"
                });
            } else if (event.type === EventType.ORDER_ON_THE_WAY) {
                await this.orderService.updateOrderStatus(orderId, {
                    status: OrderStatus.ON_THE_WAY,
                    notes: "Order is on the way"
                });
            } else if (event.type === EventType.ORDER_DELIVERED) {
                await this.orderService.updateOrderStatus(orderId, {
                    status: OrderStatus.DELIVERED,
                    notes: "Order delivered successfully"
                });
            }
        } catch (error) {
            Logger.error(`Failed to process event ${event.type} for order ${event.payload?.orderId}`, error);
        }
    }
}
