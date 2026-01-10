import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../application/services/category.service";
import { ApiResponse } from "../../../../shared/utils/response";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(ApiResponse.success(category, "Category created"));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(ApiResponse.success(categories));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.json(ApiResponse.success(category));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.updateCategory(req.params.id, req.body);
      res.json(ApiResponse.success(null, "Category updated"));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.json(ApiResponse.success(null, "Category deleted"));
    } catch (error) {
      next(error);
    }
  };
}
