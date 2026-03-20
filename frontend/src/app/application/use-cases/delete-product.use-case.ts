import { Injectable, Inject } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
@Injectable({
  providedIn: 'root',
})
export class DeleteProductUseCase {

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    return this.repository.delete(id);
  }
}
