import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate } from "@city-market/shared";

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.post("/orders", authenticate, controller.create);
  router.get("/orders/customer/me", authenticate, controller.getMyOrders);
  router.get("/orders/vendor/:vendorId", authenticate, controller.getVendorOrders);
  router.get("/orders/:id", authenticate, controller.getById);
  router.get("/orders", authenticate, controller.getAllOrders);
  router.patch("/orders/:id/status", authenticate, controller.updateStatus);
  router.post("/orders/:id/cancel", authenticate, controller.cancel);

  return router;
};
