import { TestBed } from '@angular/core/testing';
import { UpdateProductUseCase } from './update-product.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';
import { Product } from '../../domain/models/product.model';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      update: (id: string, product: any) => Promise.resolve({ message: 'Success', data: product }),
    };

    TestBed.configureTestingModule({
      providers: [
        UpdateProductUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(UpdateProductUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should update a valid product', async () => {
    const validProduct: Product = {
      id: 'prod-123',
      name: 'Valid Product Name',
      description: 'A long description for a valid product',
      logo: 'http://example.com/logo.png',
      dateRelease: new Date(new Date().getTime() + 86400000).toISOString(),
      dateRevision: new Date(new Date().getTime() + 86400000 * 366).toISOString()
    };
    const result = await useCase.execute('prod-123', validProduct);
    expect(result.message).toBe('Success');
  });

  it('should throw an error for invalid product update', async () => {
    const invalidProduct: Product = {
      id: '12', 
      name: 'Test', 
      description: 'Short', 
      logo: '',
      dateRelease: '',
      dateRevision: ''
    };
    try {
      await useCase.execute('12', invalidProduct);
      throw new Error('Should have thrown');
    } catch (e: any) {
      expect(e.message).toContain('El ID debe tener entre 3 y 10 caracteres');
    }
  });

  it('should throw an error if id does not match payload id', async () => {
    const validProduct: Product = {
      id: 'prod-456',
      name: 'Valid Product Name',
      description: 'A long description for a valid product',
      logo: 'http://example.com/logo.png',
      dateRelease: new Date(new Date().getTime() + 86400000).toISOString(),
      dateRevision: new Date(new Date().getTime() + 86400000 * 366).toISOString()
    };
    try {
      await useCase.execute('prod-123', validProduct);
      throw new Error('Should have thrown');
    } catch (e: any) {
      expect(e.message).toContain('El ID del path y el ID del producto no coinciden');
    }
  });
});
