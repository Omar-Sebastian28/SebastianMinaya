import { Injectable, Inject } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
import { Product } from '../../domain/models/product.model';
import { ProductValidator } from '../../domain/validators/product.validator';

@Injectable({
  providedIn: 'root',
})
export class CreateProductUseCase {

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(product: Product): Promise<{ message: string; data: Product }> {

    const errors = ProductValidator.validate(product);

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.repository.create(product);
  }
}
