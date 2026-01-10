import express from "express";
import { createVendorRoutes } from "./presentation/routes/vendor.routes";
import { VendorController } from "./presentation/controllers/vendor.controller";
import { VendorService } from "./application/services/vendor.service";
import { VendorRepository } from "./infrastructure/repositories/vendor.repository";
import { WorkingHoursRepository } from "./infrastructure/repositories/working-hours.repository";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { createPool } from "./config/database";
import { eventBus } from "../../shared/events/event-bus";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const pool = createPool();

  const vendorRepo = new VendorRepository(pool);
  const workingHoursRepo = new WorkingHoursRepository(pool);

  const vendorService = new VendorService(vendorRepo, workingHoursRepo, eventBus);

  const vendorController = new VendorController(vendorService);

  app.use("/", createVendorRoutes(vendorController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "vendor-service" });
  });

  app.use(errorHandler);

  return app;
};
