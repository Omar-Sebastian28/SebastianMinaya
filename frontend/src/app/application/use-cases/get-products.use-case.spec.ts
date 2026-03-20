import { TestBed } from '@angular/core/testing';
import { GetProductsUseCase } from './get-products.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
import { Product } from '../../domain/models/product.model';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      getAll: () => Promise.resolve([
        { id: '1', name: 'Product 1', description: 'desc', logo: 'logo.jpg', dateRelease: '2025-01-01', dateRevision: '2026-01-01' }
      ] as Product[]),
    };

    TestBed.configureTestingModule({
      providers: [
        GetProductsUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(GetProductsUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return a list of products', async () => {
    const products = await useCase.execute();
    expect(products.length).toBe(1);
    expect(products[0].id).toBe('1');
  });
});
