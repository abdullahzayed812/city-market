import express from "express";
import { createUserRoutes } from "./presentation/routes/user.routes";
import { UserController } from "./presentation/controllers/user.controller";
import { UserService } from "./application/services/user.service";
import { CustomerRepository } from "./infrastructure/repositories/customer.repository";
import { AddressRepository } from "./infrastructure/repositories/address.repository";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { createPool } from "./config/database";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  const pool = createPool();

  const customerRepo = new CustomerRepository(pool);
  const addressRepo = new AddressRepository(pool);

  const userService = new UserService(customerRepo, addressRepo);

  const userController = new UserController(userService);

  app.use("/", createUserRoutes(userController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "user-service" });
  });

  app.use(errorHandler);

  return app;
};
