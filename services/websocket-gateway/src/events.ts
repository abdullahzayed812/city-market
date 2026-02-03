
import { Server } from "socket.io";
import { rabbitMQBus, EventType, UserRole } from "@city-market/shared";
import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3005";

export const setupEventConsumer = async (io: Server) => {
    const channelName = "websocket-gateway-queue";

    const handleEvent = async (event: any) => {
        console.log(`Received event: ${event.type}`, event.payload);
        const { type, payload } = event;

        // Enrich payload if missing critical routing info and orderId is present
        if (payload.orderId && (!payload.customerId || !payload.vendorId)) {
            try {
                // Only fetch if we really need to broadcast to specific users and don't have IDs
                // But we actually always want to broadcast to customer/vendor for order events.
                // Using a simple cache or just fetching.
                const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${payload.orderId}`);
                const order = response.data; // Assuming response structure { order: ... } or just order object
                // The OrderService.getOrderById returns { order, items }
                if (order && order.order) {
                    payload.customerId = order.order.customerId;
                    payload.vendorId = order.order.vendorId;
                } else if (order && order.customerId) {
                    // In case endpoint returns order directly
                    payload.customerId = order.customerId;
                    payload.vendorId = order.vendorId;
                }
            } catch (error: any) {
                console.warn(`Failed to enrich payload for event ${type}: ${error.message}`);
            }
        }

        // Broadcast to Admin
        io.to(`role:${UserRole.ADMIN}`).emit(type, payload);

        // Broadcast to Customer
        if (payload.customerId) {
            io.to(`user:${payload.customerId}`).emit(type, payload);
        }

        // Broadcast to Vendor
        if (payload.vendorId) {
            io.to(`vendor:${payload.vendorId}`).emit(type, payload);
        }

        // Broadcast to Courier
        if (payload.courierId) {
            io.to(`courier:${payload.courierId}`).emit(type, payload);
        }

        // Broadcast to Delivery Manager
        // They are subscribed to specific events? Or just all order updates?
        // Let's send all order updates to delivery managers.
        io.to(`role:${UserRole.DELIVERY_MANAGER}`).emit(type, payload);

        // Special case for unassigned ready orders -> broadcast to all available couriers?
        // Use care. For now, specific roles check their lists. 
        // Real-time update just refreshes their list.
    };

    // Subscribe to all event types
    for (const type of Object.values(EventType)) {
        await rabbitMQBus.subscribe(type as EventType, channelName, async (event) => {
            if (event.type === type) {
                await handleEvent(event);
            }
        });
    }
};
