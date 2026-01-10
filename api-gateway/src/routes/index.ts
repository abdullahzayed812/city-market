import { Router } from "express";
import { config } from "../config/env";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { createProxyMiddleware } from "../middlewares/proxy.middleware";
import { UserRole } from "../../shared/enums/roles";

export const createRoutes = (): Router => {
  const router = Router();

  // Auth routes (public)
  router.use("/auth", createProxyMiddleware(config.authServiceUrl));

  // User routes (authenticated)
  router.use("/users", authenticate, createProxyMiddleware(config.userServiceUrl));

  // Vendor routes (vendors only, except GET which is public)
  router.get("/vendors*", createProxyMiddleware(config.vendorServiceUrl));
  router.use(
    "/vendors",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    createProxyMiddleware(config.vendorServiceUrl)
  );

  // Product/Catalog routes
  router.get("/products*", createProxyMiddleware(config.catalogServiceUrl));
  router.use(
    "/products",
    authenticate,
    authorize(UserRole.VENDOR, UserRole.ADMIN),
    createProxyMiddleware(config.catalogServiceUrl)
  );

  // Order routes (authenticated customers, vendors, couriers)
  router.use("/orders", authenticate, createProxyMiddleware(config.orderServiceUrl));

  // Delivery routes (couriers and admin)
  router.use(
    "/delivery",
    authenticate,
    authorize(UserRole.COURIER, UserRole.ADMIN),
    createProxyMiddleware(config.deliveryServiceUrl)
  );

  // Admin routes (admin only)
  router.use("/admin", authenticate, authorize(UserRole.ADMIN), createProxyMiddleware(config.adminServiceUrl));

  return router;
};
