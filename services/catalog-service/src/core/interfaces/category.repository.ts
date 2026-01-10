import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(id: string, data: Partial<Category>): Promise<void>;
  delete(id: string): Promise<void>;
}
