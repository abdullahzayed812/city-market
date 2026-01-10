import { Request, Response, NextFunction } from "express";
import axios, { AxiosRequestConfig } from "axios";
import { Logger } from "../../shared/utils/logger";

export const createProxyMiddleware = (targetUrl: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = `${targetUrl}${req.path}`;

      const config: AxiosRequestConfig = {
        method: req.method as any,
        url,
        headers: {
          ...req.headers,
          host: undefined, // Remove gateway host
        },
        params: req.query,
        data: req.body,
        validateStatus: () => true, // Accept any status code
      };

      Logger.info(`Proxying request`, { method: req.method, url });

      const response = await axios(config);

      res.status(response.status).json(response.data);
    } catch (error) {
      Logger.error("Proxy error", error);
      next(error);
    }
  };
};
