import { TestBed } from '@angular/core/testing';
import { VerifyProductIdUseCase } from './verify-product-id.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product-repository.token';

describe('VerifyProductIdUseCase', () => {
  let useCase: VerifyProductIdUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      verifyId: (id: string) => Promise.resolve(id === 'exists'),
    };

    TestBed.configureTestingModule({
      providers: [
        VerifyProductIdUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(VerifyProductIdUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return true if id exists', async () => {
    const exists = await useCase.execute('exists');
    expect(exists).toBe(true);
  });

  it('should return false if id does not exist', async () => {
    const exists = await useCase.execute('newid');
    expect(exists).toBe(false);
  });
});
