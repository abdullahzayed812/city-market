import { Router } from "express";
import { VendorController } from "../controllers/vendor.controller";

export const createVendorRoutes = (controller: VendorController): Router => {
  const router = Router();

  router.post("/vendors", controller.create);
  router.get("/vendors/me", controller.getMyVendor);
  router.get("/vendors/open", controller.getOpen);
  router.get("/vendors/:id", controller.getById);
  router.get("/vendors", controller.getAll);
  router.patch("/vendors/:id", controller.update);
  router.patch("/vendors/:id/status", controller.updateStatus);
  router.post("/vendors/:id/working-hours", controller.setWorkingHours);
  router.get("/vendors/:id/working-hours", controller.getWorkingHours);

  return router;
};
