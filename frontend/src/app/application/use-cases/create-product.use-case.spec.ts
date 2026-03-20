import { TestBed } from '@angular/core/testing';
import { CreateProductUseCase } from './create-product.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
import { Product } from '../../domain/models/product.model';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      create: (product: any) => Promise.resolve({ message: 'Success', data: product }),
    };

    TestBed.configureTestingModule({
      providers: [
        CreateProductUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(CreateProductUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should create a valid product', async () => {
    const validProduct: Product = {
      id: 'prod-123',
      name: 'Valid Product Name',
      description: 'A long description for a valid product',
      logo: 'http://example.com/logo.png',
      dateRelease: new Date(new Date().getTime() + 86400000).toISOString(),
      dateRevision: new Date(new Date().getTime() + 86400000 * 366).toISOString()
    };
    const result = await useCase.execute(validProduct);
    expect(result.message).toBe('Success');
  });

  it('should throw an error for invalid product', async () => {
    const invalidProduct: Product = {
      id: '12', // too short
      name: 'Test', // too short
      description: 'Short', // too short
      logo: '',
      dateRelease: '',
      dateRevision: ''
    };
    try {
      await useCase.execute(invalidProduct);
      throw new Error('Should have thrown');
    } catch (e: any) {
      expect(e.message).toContain('El ID debe tener entre 3 y 10 caracteres');
    }
  });
});
