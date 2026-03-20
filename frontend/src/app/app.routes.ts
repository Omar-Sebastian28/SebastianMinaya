import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/features/products/pages/product-list-page/product-list-page.component')
        .then(m => m.ProductListPageComponent),
  },
   {
    path: 'create',
    loadComponent: () =>
      import('./presentation/features/products/pages/product-form-page/product-form-page.component')
        .then(m => m.ProductFormPageComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./presentation/features/products/pages/product-form-page/product-form-page.component')
        .then(m => m.ProductFormPageComponent),
  },
];
