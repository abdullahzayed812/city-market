import express from "express";
import { createAdminRoutes } from "./presentation/routes/admin.routes";
import { AdminController } from "./presentation/controllers/admin.controller";
import { AdminService } from "./application/services/admin.service";
import { ServiceClient } from "./infrastructure/http/service-client";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { config } from "./config/env";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const serviceClient = new ServiceClient(
    config.orderServiceUrl,
    config.vendorServiceUrl,
    config.deliveryServiceUrl,
    config.userServiceUrl
  );

  const adminService = new AdminService(serviceClient);

  const adminController = new AdminController(adminService);

  app.use("/", createAdminRoutes(adminController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "admin-service" });
  });

  app.use(errorHandler);

  return app;
};
