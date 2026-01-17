import { Request, Response, NextFunction } from "express";
import { AdminService } from "../../application/services/admin.service";
import { ApiResponse } from "@city-market/shared";

export class AdminController {
  constructor(private adminService: AdminService) { }

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const stats = await this.adminService.getDashboardStats(token);
      res.json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const orders = await this.adminService.getAllOrders(page, limit, token);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

  getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const vendors = await this.adminService.getAllVendors(page, limit, token);
      res.json(vendors);
    } catch (error) {
      next(error);
    }
  };

  updateVendorCommission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const { vendorId } = req.params;
      const { rate } = req.body;
      const result = await this.adminService.updateVendorCommission(vendorId, rate, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  suspendVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const { vendorId } = req.params;
      const result = await this.adminService.suspendVendor(vendorId, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllCouriers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const couriers = await this.adminService.getAllCouriers(page, limit, token);
      res.json(couriers);
    } catch (error) {
      next(error);
    }
  };

  deactivateCourier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      const { courierId } = req.params;
      const result = await this.adminService.deactivateCourier(courierId, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
