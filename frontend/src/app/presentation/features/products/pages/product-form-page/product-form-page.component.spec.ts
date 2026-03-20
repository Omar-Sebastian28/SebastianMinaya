import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductFormPageComponent } from './product-form-page.component';
import { ProductFacade } from '../../facade/product.facade';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../../../../domain/models/product.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ProductFormPageComponent', () => {
  let component: ProductFormPageComponent;
  let fixture: ComponentFixture<ProductFormPageComponent>;
  let facadeMock: any;
  let routerMock: any;
  let activatedRouteMock: any;
  let notificationServiceMock: any;

  const mockProduct: Product = {
    id: 'prod-123',
    name: 'New Product',
    description: 'This is a description description',
    logo: 'logo.png',
    dateRelease: '2027-01-01',
    dateRevision: '2028-01-01'
  };

  beforeEach(async () => {
    facadeMock = {
      create: vi.fn(),
      update: vi.fn(),
      verifyId: vi.fn().mockResolvedValue(false),
      getProductById: vi.fn().mockResolvedValue(mockProduct),
      loadProducts: vi.fn().mockResolvedValue(undefined)
    };

    routerMock = {
      navigate: vi.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    notificationServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormPageComponent],
      providers: [
        { provide: ProductFacade, useValue: facadeMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form if fields are missing', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate and submit for creation', async () => {
    facadeMock.create.mockResolvedValue({ message: 'Created successfully', data: mockProduct });
    component.form.patchValue(mockProduct);
    await component.submit();
    
    expect(facadeMock.verifyId).toHaveBeenCalledWith('prod-123');
    expect(facadeMock.create).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Created successfully');
  });

  it('should not allow duplicate ID during creation', async () => {
    facadeMock.verifyId.mockResolvedValue(true);
    component.form.patchValue(mockProduct);
    await component.submit();
    
    expect(notificationServiceMock.error).toHaveBeenCalledWith('El ID ya existe en el sistema');
    expect(facadeMock.create).not.toHaveBeenCalled();
  });

  it('should update existing product in edit mode', async () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('prod-123');
    component.ngOnInit();
    await component.loadProductToEdit();
    
    expect(component.isEditing()).toBe(true);
    expect(facadeMock.getProductById).toHaveBeenCalledWith('prod-123');
    
    facadeMock.update.mockResolvedValue({ message: 'Updated successfully', data: mockProduct });
    await component.submit();
    expect(facadeMock.update).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Updated successfully');
  });

  it('should auto-calculate revision date when release date changes', () => {
    component.form.get('dateRelease')?.setValue('2025-01-01');
    expect(component.form.get('dateRevision')?.value).toBe('2026-01-01');
  });

  it('should navigate back', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
