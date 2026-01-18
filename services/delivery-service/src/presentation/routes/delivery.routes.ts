import { Router } from "express";
import { DeliveryController } from "../controllers/delivery.controller";
import { authenticate, authorize, UserRole } from "@city-market/shared";

export const createDeliveryRoutes = (controller: DeliveryController): Router => {
  const router = Router();

  // Courier routes
  router.post("/couriers", authenticate, authorize(UserRole.COURIER, UserRole.ADMIN), controller.registerCourier);
  router.get("/couriers", authenticate, authorize(UserRole.COURIER, UserRole.ADMIN), controller.getAllCouriers);
  router.get("/couriers/me", authenticate, authorize(UserRole.COURIER, UserRole.ADMIN), controller.getMyCourier);
  router.get(
    "/couriers/available",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    controller.getAvailableCouriers
  );
  router.patch("/couriers/:id", authenticate, authorize(UserRole.COURIER, UserRole.ADMIN), controller.updateCourier);
  router.patch(
    "/couriers/:id/availability",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    controller.updateAvailability
  );

  // Delivery routes
  router.post("/deliveries", authenticate, authorize(UserRole.COURIER, UserRole.ADMIN), controller.createDelivery);
  router.get(
    "/deliveries/pending",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    controller.getPendingDeliveries
  );
  router.get(
    "/deliveries/my",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    controller.getMyCourierDeliveries
  );
  router.get("/deliveries/:id", authenticate, authorize(UserRole.COURIER, UserRole.ADMIN), controller.getDeliveryById);
  router.post(
    "/deliveries/:id/assign",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    controller.assignCourier
  );
  router.patch(
    "/deliveries/:id/status",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    controller.updateDeliveryStatus
  );

  return router;
};
