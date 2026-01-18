import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorize, UserRole } from "@city-market/shared";

export const createAdminRoutes = (controller: AdminController): Router => {
  const router = Router();

  router.get("/dashboard", authenticate, authorize(UserRole.ADMIN), controller.getDashboard);
  router.get("/orders", authenticate, authorize(UserRole.ADMIN), controller.getAllOrders);
  router.get("/vendors", authenticate, authorize(UserRole.ADMIN), controller.getAllVendors);
  router.patch(
    "/vendors/:vendorId/commission",
    authenticate,
    authorize(UserRole.ADMIN),
    controller.updateVendorCommission
  );
  router.post("/vendors/:vendorId/suspend", authenticate, authorize(UserRole.ADMIN), controller.suspendVendor);
  router.get("/couriers", authenticate, authorize(UserRole.ADMIN), controller.getAllCouriers);
  router.post("/couriers/:courierId/deactivate", authenticate, authorize(UserRole.ADMIN), controller.deactivateCourier);

  return router;
};
