import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

export const createProductRoutes = (controller: ProductController): Router => {
  const router = Router();

  router.post("/products", controller.create);
  router.get("/products/search", controller.search);
  router.get("/products/vendor/:vendorId", controller.getByVendor);
  router.get("/products/category/:categoryId", controller.getByCategory);
  router.get("/products/:id", controller.getById);
  router.patch("/products/:id", controller.update);
  router.patch("/products/:id/stock", controller.updateStock);
  router.delete("/products/:id", controller.delete);

  return router;
};
