import { Injectable, Inject } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
import { Product } from '../../domain/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class GetProductsUseCase {

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
