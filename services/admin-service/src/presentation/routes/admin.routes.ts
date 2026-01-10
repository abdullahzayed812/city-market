import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";

export const createAdminRoutes = (controller: AdminController): Router => {
  const router = Router();

  router.get("/dashboard", controller.getDashboard);
  router.get("/orders", controller.getAllOrders);
  router.get("/vendors", controller.getAllVendors);
  router.patch("/vendors/:vendorId/commission", controller.updateVendorCommission);
  router.post("/vendors/:vendorId/suspend", controller.suspendVendor);
  router.get("/couriers", controller.getAllCouriers);
  router.post("/couriers/:courierId/deactivate", controller.deactivateCourier);

  return router;
};
