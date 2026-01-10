import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/auth.service";
import { ApiResponse } from "../../../../shared/utils/response";
import { Logger } from "../../../../shared/utils/logger";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.register(req.body);
      Logger.info("User registered", { email: req.body.email });
      res.status(201).json(ApiResponse.success(tokens, "Registration successful"));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.login(req.body);
      Logger.info("User logged in", { email: req.body.email });
      res.json(ApiResponse.success(tokens, "Login successful"));
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);
      res.json(ApiResponse.success(tokens, "Token refreshed"));
    } catch (error) {
      next(error);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json(ApiResponse.error("No token provided"));
      }
      const payload = await this.authService.validateToken(token);
      res.json(ApiResponse.success(payload, "Token is valid"));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      await this.authService.logout(userId);
      res.json(ApiResponse.success(null, "Logged out successfully"));
    } catch (error) {
      next(error);
    }
  };
}
