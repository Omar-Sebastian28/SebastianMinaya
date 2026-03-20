import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../../../../domain/models/product.model';
import { SkeletonComponent } from '../../../../../shared/ui/skeleton/skeleton.component';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  // Services
  private readonly facade = inject(ProductFacade);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  // Facade Selectors
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  
  // Local UI State
  readonly openMenuId = signal<string | null>(null);
  readonly productToDelete = signal<Product | null>(null);
  readonly showModal = signal(false);
  readonly pageSize = signal(5);
  readonly currentPage = signal(0);
  
  // Search logic
  private readonly searchInput$ = new Subject<string>();
  private readonly searchTerm = toSignal(
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    ),
    { initialValue: '' }
  );

  // Derived Reactive State (Memoized by computed)
  readonly filteredProducts = computed(() => {
    const list = this.facade.products();
    const term = this.searchTerm().toLowerCase();
    
    if (!term) return list;
    
    return list.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  });

  readonly paginatedProducts = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  readonly totalItems = computed(() => this.filteredProducts().length);
  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  // Constants / Utils
  readonly Math = Math;

  private boundClickListener = this.onDocumentClick.bind(this);

  ngOnInit(): void {
    this.facade.loadProducts();
    document.addEventListener('click', this.boundClickListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.boundClickListener);
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.openMenuId.set(null);
    }
  }

  toggleMenu(id: string) {
    this.openMenuId.update(current => current === id ? null : id);
  }

  goToEdit(product: Product) {
    this.router.navigate(['/edit', product.id]);
    this.openMenuId.set(null);
  }

  openDeleteModal(product: Product) {
    this.productToDelete.set(product);
    this.showModal.set(true);
    this.openMenuId.set(null);
  }

  cancelDelete() {
    this.showModal.set(false);
    this.productToDelete.set(null);
  }

  async confirmDelete() {
    const product = this.productToDelete();
    if (!product) return;

    try {
      const result = await this.facade.delete(product.id);
      this.showModal.set(false);
      this.productToDelete.set(null);
      this.notificationService.success(result.message);
    } catch (e: any) {
      console.error('Error eliminando producto:', e);
      this.notificationService.error(e?.message || 'Hubo un error al eliminar el producto.');
    }
  }

  goToCreate() {
    this.router.navigate(['/create']);
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(0);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput$.next(input.value);
    this.currentPage.set(0);
  }

  trackById(_index: number, product: Product) {
    return product.id;
  }

  nextPage() {
    if ((this.currentPage() + 1) * this.pageSize() < this.totalItems()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
    }
  }
}
