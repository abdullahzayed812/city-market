import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.post("/orders", controller.create);
  router.get("/orders/customer/me", controller.getMyOrders);
  router.get("/orders/vendor/:vendorId", controller.getVendorOrders);
  router.get("/orders/:id", controller.getById);
  router.get("/orders", controller.getAllOrders);
  router.patch("/orders/:id/status", controller.updateStatus);
  router.post("/orders/:id/cancel", controller.cancel);

  return router;
};
