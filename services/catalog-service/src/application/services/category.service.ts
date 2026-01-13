import { randomUUID } from "crypto";
import { ICategoryRepository } from "../../core/interfaces/category.repository";
import { Category } from "../../core/entities/category.entity";
import { NotFoundError } from "@city-market/shared";

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export class CategoryService {
  constructor(private categoryRepo: ICategoryRepository) { }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const category: Category = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
    };

    return this.categoryRepo.create(category);
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    await this.getCategoryById(id);
    await this.categoryRepo.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id);
    await this.categoryRepo.delete(id);
  }
}
