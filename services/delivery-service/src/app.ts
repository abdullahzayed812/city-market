import express from "express";
import { createDeliveryRoutes } from "./presentation/routes/delivery.routes";
import { DeliveryController } from "./presentation/controllers/delivery.controller";
import { DeliveryService } from "./application/services/delivery.service";
import { CourierRepository } from "./infrastructure/repositories/courier.repository";
import { DeliveryRepository } from "./infrastructure/repositories/delivery.repository";
import { errorHandler } from "@city-market/shared";
import { eventBus } from "@city-market/shared";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const courierRepo = new CourierRepository();
  const deliveryRepo = new DeliveryRepository();

  const deliveryService = new DeliveryService(courierRepo, deliveryRepo, eventBus);

  const deliveryController = new DeliveryController(deliveryService);

  app.use("/", createDeliveryRoutes(deliveryController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "delivery-service" });
  });

  app.use(errorHandler);

  return app;
};
