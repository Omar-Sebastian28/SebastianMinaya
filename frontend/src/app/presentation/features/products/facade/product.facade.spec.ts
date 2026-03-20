import { TestBed } from '@angular/core/testing';
import { ProductFacade } from './product.facade';
import { GetProductsUseCase } from '../../../../application/use-cases/get-products.use-case';
import { DeleteProductUseCase } from '../../../../application/use-cases/delete-product.use-case';
import { CreateProductUseCase } from '../../../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../../../application/use-cases/update-product.use-case';
import { VerifyProductIdUseCase } from '../../../../application/use-cases/verify-product-id.use-case';
import { Product } from '../../../../domain/models/product.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let mockGetProducts: any;
  let mockDeleteProduct: any;
  let mockCreateProduct: any;
  let mockUpdateProduct: any;
  let mockVerifyId: any;

  const mockProduct: Product = {
    id: '1',
    name: 'Test',
    description: 'Description',
    logo: 'logo.png',
    dateRelease: '2025-01-01',
    dateRevision: '2026-01-01'
  };

  beforeEach(() => {
    mockGetProducts = { execute: vi.fn().mockResolvedValue([mockProduct]) };
    mockDeleteProduct = { execute: vi.fn().mockResolvedValue({ message: 'Deleted' }) };
    mockCreateProduct = { execute: vi.fn().mockResolvedValue({ message: 'Created', data: mockProduct }) };
    mockUpdateProduct = { execute: vi.fn().mockResolvedValue({ message: 'Updated', data: mockProduct }) };
    mockVerifyId = { execute: vi.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        ProductFacade,
        { provide: GetProductsUseCase, useValue: mockGetProducts },
        { provide: DeleteProductUseCase, useValue: mockDeleteProduct },
        { provide: CreateProductUseCase, useValue: mockCreateProduct },
        { provide: UpdateProductUseCase, useValue: mockUpdateProduct },
        { provide: VerifyProductIdUseCase, useValue: mockVerifyId },
      ],
    });

    facade = TestBed.inject(ProductFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load products', async () => {
    await facade.loadProducts();
    const products = await firstValueFrom(facade.products$);
    expect(products.length).toBe(1);
    expect(products[0]).toEqual(mockProduct);
    expect(facade.products().length).toBe(1);
  });

  it('should handle error when loading products', async () => {
    mockGetProducts.execute.mockRejectedValue(new Error('API Err'));
    await facade.loadProducts();
    const error = await firstValueFrom(facade.error$);
    expect(error).toBe('Ocurrió un error al cargar los productos');
    expect(facade.error()).toBe('Ocurrió un error al cargar los productos');
  });

  it('should delete product and reload', async () => {
    const loadSpy = vi.spyOn(facade, 'loadProducts');
    const result = await facade.delete('1');
    expect(result.message).toBe('Deleted');
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should create product and reload', async () => {
    const loadSpy = vi.spyOn(facade, 'loadProducts');
    const result = await facade.create(mockProduct);
    expect(result.message).toBe('Created');
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should update product and reload', async () => {
    const loadSpy = vi.spyOn(facade, 'loadProducts');
    const result = await facade.update('1', mockProduct);
    expect(result.message).toBe('Updated');
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should verify id', async () => {
    const result = await facade.verifyId('1');
    expect(result).toBe(true);
  });

  it('should get product by id', async () => {
    const product = await facade.getProductById('1');
    expect(product).toEqual(mockProduct);
  });
});
