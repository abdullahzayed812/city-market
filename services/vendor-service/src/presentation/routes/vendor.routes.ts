import { Router } from "express";
import { VendorController } from "../controllers/vendor.controller";
import { authenticate, authorize, UserRole } from "@city-market/shared";

export const createVendorRoutes = (controller: VendorController): Router => {
  const router = Router();

  router.post("/vendors", authenticate, authorize(UserRole.VENDOR, UserRole.ADMIN), controller.create);
  router.get("/vendors/me", authenticate, authorize(UserRole.VENDOR, UserRole.ADMIN), controller.getMyVendor);
  router.get("/vendors/open", authenticate, authorize(UserRole.VENDOR, UserRole.ADMIN), controller.getOpen);
  router.get("/vendors/:id", authenticate, authorize(UserRole.VENDOR, UserRole.ADMIN), controller.getById);
  router.get("/vendors", authenticate, authorize(UserRole.VENDOR, UserRole.ADMIN), controller.getAll);
  router.patch("/vendors/:id", authenticate, authorize(UserRole.VENDOR, UserRole.ADMIN), controller.update);
  router.patch(
    "/vendors/:id/status",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    controller.updateStatus
  );
  router.post(
    "/vendors/:id/working-hours",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    controller.setWorkingHours
  );
  router.get(
    "/vendors/:id/working-hours",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    controller.getWorkingHours
  );

  return router;
};
