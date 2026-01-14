import { Router } from "express";
import { config } from "../config/env";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { setupProxy } from "../middlewares/proxy.middleware";
import { AppError, ApiResponse, Logger, UserRole } from "@city-market/shared";

export const createRoutes = (): Router => {
  const router = Router();

  // Auth routes (public)
  router.use("/auth", setupProxy("/auth", config.authServiceUrl));

  // User routes (authenticated)
  router.use("/users", authenticate, setupProxy("/users", config.userServiceUrl));

  // Vendor routes (vendors only, except GET which is public)
  router.get("/vendors*", setupProxy("/vendors", config.vendorServiceUrl));
  router.use(
    "/vendors",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    setupProxy("/vendors", config.vendorServiceUrl)
  );

  // Product/Catalog routes
  router.get("/catalog*", setupProxy("/catalog", config.catalogServiceUrl));
  router.use(
    "/catalog",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    setupProxy("/catalog", config.catalogServiceUrl)
  );

  // Order routes (authenticated customers, vendors, couriers)
  router.use("/orders", authenticate, setupProxy("/orders", config.orderServiceUrl));

  // Delivery routes (couriers and admin)
  router.use(
    "/delivery",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    setupProxy("/delivery", config.deliveryServiceUrl)
  );

  // Admin routes (admin only)
  router.use("/admin", authenticate, authorize(UserRole.ADMIN), setupProxy("/admin", config.adminServiceUrl));

  return router;
};
