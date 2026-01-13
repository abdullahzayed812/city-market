import express from "express";
import { createProductRoutes } from "./presentation/routes/product.routes";
import { createCategoryRoutes } from "./presentation/routes/category.routes";
import { ProductController } from "./presentation/controllers/product.controller";
import { CategoryController } from "./presentation/controllers/category.controller";
import { ProductService } from "./application/services/product.service";
import { CategoryService } from "./application/services/category.service";
import { ProductRepository } from "./infrastructure/repositories/product.repository";
import { CategoryRepository } from "./infrastructure/repositories/category.repository";
import { errorHandler } from "@city-market/shared";
export const createApp = () => {
  const app = express();

  app.use(express.json());

  const productRepo = new ProductRepository();
  const categoryRepo = new CategoryRepository();

  const productService = new ProductService(productRepo);
  const categoryService = new CategoryService(categoryRepo);

  const productController = new ProductController(productService);
  const categoryController = new CategoryController(categoryService);

  app.use("/", createProductRoutes(productController));
  app.use("/", createCategoryRoutes(categoryController));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "catalog-service" });
  });

  app.use(errorHandler);

  return app;
};
