import { Inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/models/product.model';

import { ProductValidator } from '../../domain/validators/product.validator';

@Injectable({ providedIn: 'root' })
export class UpdateProductUseCase {

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private repository: ProductRepository
  ) {}

  async execute(id: string, product: Product): Promise<{ message: string; data: Product }> {
    if (id !== product.id) {
      throw new Error('El ID del path y el ID del producto no coinciden');
    }

    const errors = ProductValidator.validate(product);

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.repository.update(id, product);
  }
}
