import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate } from "@city-market/shared";

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.post("/", authenticate, controller.create);
  router.get("/customer/me", authenticate, controller.getMyOrders);
  router.get("/vendor/:vendorId", authenticate, controller.getVendorOrders);
  router.get("/:id", authenticate, controller.getById);
  router.get("/", authenticate, controller.getAllOrders);
  router.patch("/:id/status", authenticate, controller.updateStatus);
  router.post("/:id/cancel", authenticate, controller.cancel);

  return router;
};
