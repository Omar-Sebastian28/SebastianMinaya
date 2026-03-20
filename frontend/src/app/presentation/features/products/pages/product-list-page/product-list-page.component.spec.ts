import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListPageComponent } from './product-list-page.component';
import { ProductFacade } from '../../facade/product.facade';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../../../../domain/models/product.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let facadeMock: any;
  let routerMock: any;
  let notificationServiceMock: any;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'A product description',
    logo: 'logo.png',
    dateRelease: '2027-01-01',
    dateRevision: '2028-01-01'
  };

  const productsSignal = signal<readonly Product[]>([mockProduct]);
  const loadingSignal = signal<boolean>(false);
  const errorSignal = signal<string | null>(null);

  beforeEach(async () => {
    facadeMock = {
      products: productsSignal,
      loading: loadingSignal,
      error: errorSignal,
      loadProducts: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue({ message: 'Deleted' })
    };

    routerMock = {
      navigate: vi.fn()
    };

    notificationServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [
        { provide: ProductFacade, useValue: facadeMock },
        { provide: Router, useValue: routerMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProducts on init', () => {
    expect(facadeMock.loadProducts).toHaveBeenCalled();
  });

  it('should filter products when searching', async () => {
    component.onSearch({ target: { value: 'Test' } } as any);
    
    // Wait for debounceTime in RxJS stream
    await new Promise(r => setTimeout(r, 400));
    fixture.detectChanges();

    expect(component.filteredProducts().length).toBe(1);
  });

  it('should navigate to edit page', () => {
    component.goToEdit(mockProduct);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/edit', mockProduct.id]);
  });

  it('should show delete modal', () => {
    component.openDeleteModal(mockProduct);
    expect(component.showModal()).toBe(true);
    expect(component.productToDelete()).toEqual(mockProduct);
  });

  it('should hide delete modal when cancelled', () => {
    component.openDeleteModal(mockProduct);
    component.cancelDelete();
    expect(component.showModal()).toBe(false);
    expect(component.productToDelete()).toBeNull();
  });

  it('should delete and hide modal when confirmed', async () => {
    component.openDeleteModal(mockProduct);
    await component.confirmDelete();
    
    expect(facadeMock.delete).toHaveBeenCalledWith(mockProduct.id);
    expect(component.showModal()).toBe(false);
    expect(component.productToDelete()).toBeNull();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Deleted');
  });

  it('should change page size', () => {
    component.onPageSizeChange({ target: { value: '10' } } as any);
    expect(component.pageSize()).toBe(10);
    expect(component.currentPage()).toBe(0);
  });

  it('should navigate between pages', async () => {
    productsSignal.set(new Array(10).fill(mockProduct));
    fixture.detectChanges();

    component.pageSize.set(5);
    component.nextPage();
    expect(component.currentPage()).toBe(1);
    component.prevPage();
    expect(component.currentPage()).toBe(0);
  });
});
