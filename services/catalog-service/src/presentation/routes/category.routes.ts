import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

export const createCategoryRoutes = (controller: CategoryController): Router => {
  const router = Router();

  router.post("/categories", controller.create);
  router.get("/categories", controller.getAll);
  router.get("/categories/:id", controller.getById);
  router.patch("/categories/:id", controller.update);
  router.delete("/categories/:id", controller.delete);

  return router;
};
