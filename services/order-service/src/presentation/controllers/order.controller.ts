import { Response, NextFunction } from "express";
import { OrderService } from "../../application/services/order.service";
import { ApiResponse } from "@city-market/shared";
import { Logger } from "@city-market/shared";
import { AuthRequest } from "@city-market/shared";

export class OrderController {
  constructor(private orderService: OrderService) { }

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const dto = { ...req.body, customerId: req.user!.userId };
      const order = await this.orderService.createOrder(dto, token);
      Logger.info("Order created", { orderId: order.order.id });
      res.status(201).json(ApiResponse.success(order, "Order created"));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.json(ApiResponse.success(order));
    } catch (error) {
      next(error);
    }
  };

  getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const orders = await this.orderService.getCustomerOrders(req.user!.userId, page, limit);
      res.json(ApiResponse.success(orders));
    } catch (error) {
      next(error);
    }
  };

  getVendorOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const orders = await this.orderService.getVendorOrders(req.params.vendorId, page, limit);
      res.json(ApiResponse.success(orders));
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const orders = await this.orderService.getAllOrders(page, limit);
      res.json(ApiResponse.success(orders));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      await this.orderService.updateOrderStatus(req.params.id, req.body, token);
      res.json(ApiResponse.success(null, "Order status updated"));
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.orderService.cancelOrder(req.params.id, req.body.reason);
      res.json(ApiResponse.success(null, "Order cancelled"));
    } catch (error) {
      next(error);
    }
  };
}
