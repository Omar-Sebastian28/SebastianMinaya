import { Injectable, inject, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Product, UIState } from '../../../../domain/models/product.model';
import { GetProductsUseCase } from '../../../../application/use-cases/get-products.use-case';
import { DeleteProductUseCase } from '../../../../application/use-cases/delete-product.use-case';
import { CreateProductUseCase } from '../../../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../../../application/use-cases/update-product.use-case';
import { VerifyProductIdUseCase } from '../../../../application/use-cases/verify-product-id.use-case';

@Injectable({
  providedIn: 'root',
})
export class ProductFacade {
  // Use Cases
  private readonly getProductsUseCase = inject(GetProductsUseCase);
  private readonly deleteUseCase = inject(DeleteProductUseCase);
  private readonly createUseCase = inject(CreateProductUseCase);
  private readonly updateUseCase = inject(UpdateProductUseCase);
  private readonly verifyUseCase = inject(VerifyProductIdUseCase);

  // Centralized State using Signals
  private readonly state = signal<UIState<readonly Product[]>>({
    data: [],
    status: 'idle',
    error: null
  });

  // Public Selectors (computed Signals for performance)
  readonly products = computed(() => this.state().data);
  readonly loading = computed(() => this.state().status === 'loading');
  readonly error = computed(() => this.state().error);

  // Backward compatibility for existing Observables if needed (though we'll prefer signals)
  readonly products$ = toObservable(this.products);
  readonly loading$ = toObservable(this.loading);
  readonly error$ = toObservable(this.error);

  async loadProducts(): Promise<void> {
    this.updateState({ status: 'loading', error: null });

    try {
      const products = await this.getProductsUseCase.execute();
      this.updateState({ data: [...products], status: 'success' });
    } catch (err: unknown) {
      console.error('Error loading products:', err);
      this.updateState({ 
        status: 'error', 
        error: 'Ocurrió un error al cargar los productos' 
      });
    }
  }

  async create(product: Product): Promise<{ message: string; data: Product }> {
    const response = await this.createUseCase.execute(product);
    await this.loadProducts();
    return response;
  }

  async update(id: string, product: Product): Promise<{ message: string; data: Product }> {
    const response = await this.updateUseCase.execute(id, product);
    await this.loadProducts();
    return response;
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await this.deleteUseCase.execute(id);
    await this.loadProducts();
    return response;
  }

  async verifyId(id: string): Promise<boolean> {
    return await this.verifyUseCase.execute(id);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const list = this.products();
    if (list.length > 0) {
      return list.find(p => p.id === id);
    }
    // Fallback if list is empty
    const products = await this.getProductsUseCase.execute();
    return products.find(p => p.id === id);
  }

  private updateState(patch: Partial<UIState<readonly Product[]>>): void {
    this.state.update(current => ({ ...current, ...patch }));
  }
}
