import express from "express";
import { createDeliveryRoutes } from "./presentation/routes/delivery.routes";
import { DeliveryController } from "./presentation/controllers/delivery.controller";
import { DeliveryService } from "./application/services/delivery.service";
import { CourierRepository } from "./infrastructure/repositories/courier.repository";
import { DeliveryRepository } from "./infrastructure/repositories/delivery.repository";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { createPool } from "./config/database";
import { eventBus } from "../../shared/events/event-bus";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const pool = createPool();

  const courierRepo = new CourierRepository(pool);
  const deliveryRepo = new DeliveryRepository(pool);

  const deliveryService = new DeliveryService(courierRepo, deliveryRepo, eventBus);

  const deliveryController = new DeliveryController(deliveryService);

  app.use("/", createDeliveryRoutes(deliveryController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "delivery-service" });
  });

  app.use(errorHandler);

  return app;
};
