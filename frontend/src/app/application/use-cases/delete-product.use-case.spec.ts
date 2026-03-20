import { TestBed } from '@angular/core/testing';
import { DeleteProductUseCase } from './delete-product.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      delete: (id: string) => Promise.resolve({ message: 'Deleted successfully' }),
    };

    TestBed.configureTestingModule({
      providers: [
        DeleteProductUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(DeleteProductUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should delete a product', async () => {
    const result = await useCase.execute('prod-123');
    expect(result.message).toBe('Deleted successfully');
  });
});
