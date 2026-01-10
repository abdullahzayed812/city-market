import express from "express";
import { createAuthRoutes } from "./presentation/routes/auth.routes";
import { AuthController } from "./presentation/controllers/auth.controller";
import { AuthService } from "./application/services/auth.service";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { RefreshTokenRepository } from "./infrastructure/repositories/refresh-token.repository";
import { errorHandler } from "./presentation/middlewares/error-handler";
import { createPool } from "./config/database";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Database
  const pool = createPool();

  // Repositories
  const userRepo = new UserRepository(pool);
  const refreshTokenRepo = new RefreshTokenRepository(pool);

  // Services
  const authService = new AuthService(userRepo, refreshTokenRepo);

  // Controllers
  const authController = new AuthController(authService);

  // Routes
  app.use("/auth", createAuthRoutes(authController));

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "auth-service" });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};
