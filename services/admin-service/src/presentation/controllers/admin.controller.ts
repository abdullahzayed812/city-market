import { Request, Response, NextFunction } from "express";
import { AdminService } from "../../application/services/admin.service";
import { ApiResponse } from "@city-market/shared";

export class AdminController {
  constructor(private adminService: AdminService) {}

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const stats = await this.adminService.getDashboardStats(token);
      res.json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
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
      const token = req.headers.authorization?.split(" ")[1];
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
      const token = req.headers.authorization?.split(" ")[1];
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
      const token = req.headers.authorization?.split(" ")[1];
      const { vendorId } = req.params;
      const result = await this.adminService.suspendVendor(vendorId, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllCouriers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
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
      const token = req.headers.authorization?.split(" ")[1];
      const { courierId } = req.params;
      const result = await this.adminService.deactivateCourier(courierId, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const users = await this.adminService.getAllUsers(page, limit, token);
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id } = req.params;
      const user = await this.adminService.getUserById(id, token);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.adminService.updateUserStatus(id, status, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id } = req.params;
      const vendor = await this.adminService.getVendorById(id, token);
      res.json(vendor);
    } catch (error) {
      next(error);
    }
  };

  updateVendorStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.adminService.updateVendorStatus(id, status, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id } = req.params;
      const order = await this.adminService.getOrderById(id, token);
      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.adminService.updateOrderStatus(id, status, token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const deliveries = await this.adminService.getDeliveries(token);
      res.json(deliveries);
    } catch (error) {
      next(error);
    }
  };

  getAvailableCouriers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const couriers = await this.adminService.getAvailableCouriers(token);
      res.json(couriers);
    } catch (error) {
      next(error);
    }
  };

  getRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const revenue = await this.adminService.getRevenue(token);
      res.json(revenue);
    } catch (error) {
      next(error);
    }
  };

  getPayouts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const payouts = await this.adminService.getPayouts(token);
      res.json(payouts);
    } catch (error) {
      next(error);
    }
  };
}
