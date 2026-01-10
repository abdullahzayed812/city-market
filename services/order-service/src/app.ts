import express from "express";
import { createOrderRoutes } from "./presentation/routes/order.routes";
import { OrderController } from "./presentation/controllers/order.controller";
import { OrderService } from "./application/services/order.service";
import { OrderRepository } from "./infrastructure/repositories/order.repository";
import { OrderItemRepository } from "./infrastructure/repositories/order-item.repository";
import { OrderStatusHistoryRepository } from "./infrastructure/repositories/order-status-history.repository";
import { CatalogHttpClient } from "./infrastructure/http/catalog-http-client";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { createPool } from "./config/database";
import { eventBus } from "../../shared/events/event-bus";
import { config } from "./config/env";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const pool = createPool();

  const orderRepo = new OrderRepository(pool);
  const orderItemRepo = new OrderItemRepository(pool);
  const statusHistoryRepo = new OrderStatusHistoryRepository(pool);
  const catalogClient = new CatalogHttpClient(config.catalogServiceUrl);

  const orderService = new OrderService(orderRepo, orderItemRepo, statusHistoryRepo, catalogClient, eventBus);

  const orderController = new OrderController(orderService);

  app.use("/", createOrderRoutes(orderController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "order-service" });
  });

  app.use(errorHandler);

  return app;
};
