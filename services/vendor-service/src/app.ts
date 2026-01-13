import express from "express";
import { createVendorRoutes } from "./presentation/routes/vendor.routes";
import { VendorController } from "./presentation/controllers/vendor.controller";
import { VendorService } from "./application/services/vendor.service";
import { VendorRepository } from "./infrastructure/repositories/vendor.repository";
import { WorkingHoursRepository } from "./infrastructure/repositories/working-hours.repository";
import { errorHandler } from "@city-market/shared";
import { eventBus } from "@city-market/shared";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const vendorRepo = new VendorRepository();
  const workingHoursRepo = new WorkingHoursRepository();

  const vendorService = new VendorService(vendorRepo, workingHoursRepo, eventBus);

  const vendorController = new VendorController(vendorService);

  app.use("/", createVendorRoutes(vendorController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "vendor-service" });
  });

  app.use(errorHandler);

  return app;
};
