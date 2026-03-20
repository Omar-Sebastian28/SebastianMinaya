import { Product } from '../models/product.model';

export abstract class ProductRepository {
  abstract getAll(): Promise<Product[]>;
  abstract create(product: Product): Promise<{ message: string; data: Product }>;
  abstract update(id: string, product: Product): Promise<{ message: string; data: Product }>;
  abstract verifyId(id: string): Promise<boolean>;
  abstract delete(id: string): Promise<{ message: string }>;
}
