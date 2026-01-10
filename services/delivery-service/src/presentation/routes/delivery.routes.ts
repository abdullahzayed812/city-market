import { Router } from "express";
import { DeliveryController } from "../controllers/delivery.controller";

export const createDeliveryRoutes = (controller: DeliveryController): Router => {
  const router = Router();

  // Courier routes
  router.post("/couriers", controller.registerCourier);
  router.get("/couriers/me", controller.getMyCourier);
  router.get("/couriers/available", controller.getAvailableCouriers);
  router.patch("/couriers/:id", controller.updateCourier);
  router.patch("/couriers/:id/availability", controller.updateAvailability);

  // Delivery routes
  router.post("/deliveries", controller.createDelivery);
  router.get("/deliveries/pending", controller.getPendingDeliveries);
  router.get("/deliveries/my", controller.getMyCourierDeliveries);
  router.get("/deliveries/:id", controller.getDeliveryById);
  router.post("/deliveries/:id/assign", controller.assignCourier);
  router.patch("/deliveries/:id/status", controller.updateDeliveryStatus);

  return router;
};
