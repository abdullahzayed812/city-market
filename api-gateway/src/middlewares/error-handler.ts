import { Request, Response, NextFunction } from "express";
import { AppError, ApiResponse, Logger } from "@city-market/shared";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    Logger.warn("Operational error", { message: err.message, statusCode: err.statusCode });
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  Logger.error("Unexpected error", err);
  res.status(500).json(ApiResponse.error("Internal server error"));
};
