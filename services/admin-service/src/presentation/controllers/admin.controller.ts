import { Request, Response, NextFunction } from "express";
import { AdminService } from "../../application/services/admin.service";
import { ApiResponse } from "../../../../shared/utils/response";

export class AdminController {
  constructor(private adminService: AdminService) {}

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const orders = await this.adminService.getAllOrders(page, limit);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

  getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const vendors = await this.adminService.getAllVendors(page, limit);
      res.json(vendors);
    } catch (error) {
      next(error);
    }
  };

  updateVendorCommission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = req.params;
      const { rate } = req.body;
      const result = await this.adminService.updateVendorCommission(vendorId, rate);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  suspendVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = req.params;
      const result = await this.adminService.suspendVendor(vendorId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllCouriers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const couriers = await this.adminService.getAllCouriers(page, limit);
      res.json(couriers);
    } catch (error) {
      next(error);
    }
  };

  deactivateCourier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courierId } = req.params;
      const result = await this.adminService.deactivateCourier(courierId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
