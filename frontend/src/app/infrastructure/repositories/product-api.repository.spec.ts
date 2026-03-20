import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiRepository } from './product-api.repository';
import { API_CONFIG } from '../../core/config/api.config';
import { Product } from '../../domain/models/product.model';

describe('ProductApiRepository', () => {
  let repository: ProductApiRepository;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: '1',
    name: 'Test',
    description: 'Description',
    logo: 'logo.png',
    dateRelease: '2025-01-01',
    dateRevision: '2026-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductApiRepository],
    });

    repository = TestBed.inject(ProductApiRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should get all products', async () => {
    const productsPromise = repository.getAll();
    const req = httpMock.expectOne(API_CONFIG.baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [mockProduct] });

    const products = await productsPromise;
    expect(products.length).toBe(1);
    expect(products[0].id).toBe('1');
  });

  it('should create product', async () => {
    const createPromise = repository.create(mockProduct);
    const req = httpMock.expectOne(API_CONFIG.baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Created', data: mockProduct });

    const result = await createPromise;
    expect(result.message).toBe('Created');
    expect(result.data.id).toBe('1');
  });

  it('should verify id', async () => {
    const verifyPromise = repository.verifyId('1');
    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);

    const result = await verifyPromise;
    expect(result).toBe(true);
  });

  it('should delete product', async () => {
    const deletePromise = repository.delete('1');
    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Deleted' });

    const result = await deletePromise;
    expect(result.message).toBe('Deleted');
  });

  it('should update product', async () => {
    const updatePromise = repository.update('1', mockProduct);
    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Updated', data: mockProduct });

    const result = await updatePromise;
    expect(result.message).toBe('Updated');
    expect(result.data.id).toBe('1');
  });
});
