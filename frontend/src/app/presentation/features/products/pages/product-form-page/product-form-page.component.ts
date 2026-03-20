import { Component, OnInit, ChangeDetectionStrategy, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../../../../domain/models/product.model';
import { SkeletonComponent } from '../../../../../shared/ui/skeleton/skeleton.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { futureDateValidator, urlValidator } from '../../../../../shared/utils/validators.utils';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkeletonComponent],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormPageComponent implements OnInit {
  // Services
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProductFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  // Form
  readonly form: FormGroup = this.initForm();

  // UI State Signals
  readonly loading = signal(false);
  readonly isEditing = signal(false);
  
  private productId: string | null = null;

  ngOnInit(): void {
    this.setupDateRevisionLogic();
    
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditing.set(true);
      this.form.get('id')?.disable();
      this.loadProductToEdit();
    }
  }

  private initForm(): FormGroup {
    return this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [this.uniqueIdValidator()]
      }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, urlValidator()]],
      dateRelease: ['', [Validators.required, futureDateValidator()]],
      dateRevision: [{ value: '', disabled: true }, Validators.required],
    });
  }

  private uniqueIdValidator() {
    return async (control: any) => {
      // Don't validate if empty or if we are in EDIT mode (ID is disabled/read-only)
      if (!control.value || this.isEditing()) return null;
      
      try {
        const exists = await this.facade.verifyId(control.value);
        return exists ? { duplicateId: true } : null;
      } catch (e) {
        return null; 
      }
    };
  }

  private setupDateRevisionLogic(): void {
    this.form.get('dateRelease')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value) {
          this.form.get('dateRevision')?.setValue('', { emitEvent: false });
          return;
        }

        // Ensure we parse the local date correctly at midnight
        const date = new Date(value + 'T00:00:00');
        date.setFullYear(date.getFullYear() + 1);

        // Format back to YYYY-MM-DD
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');

        this.form.patchValue({
          dateRevision: `${y}-${m}-${d}`
        }, { emitEvent: false });
      });
  }

  resetForm(): void {
    // If we are editing, we don't want to reset the ID
    if (this.isEditing()) {
      const currentId = this.form.get('id')?.value;
      this.form.reset();
      this.form.patchValue({ id: currentId });
    } else {
      this.form.reset();
    }
  }

  async loadProductToEdit(): Promise<void> {
    this.loading.set(true);
    try {
      const product = await this.facade.getProductById(this.productId!);
      if (product) {
        const formatDate = (d: string) => d ? new Date(d).toISOString().split('T')[0] : '';
        
        this.form.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          dateRelease: formatDate(product.dateRelease),
          dateRevision: formatDate(product.dateRevision)
        });
      } else {
        this.notificationService.error('Producto no encontrado');
        this.router.navigate(['/']);
      }
    } catch (e) {
      console.error('Error loading product for edit:', e);
      this.notificationService.error('Error cargando datos del producto');
    } finally {
      this.loading.set(false);
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.loading.set(true);
      const rawValue = this.form.getRawValue();

      let response;
      if (this.isEditing() && this.productId) {
        response = await this.facade.update(this.productId, rawValue as Product);
      } else {
        response = await this.facade.create(rawValue as Product);
      }

      this.notificationService.success(response.message);
      this.router.navigate(['/']);

    } catch (e: any) {
      console.error('Submit error:', e);
      this.notificationService.error(e?.message || 'Error al guardar el producto');
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
