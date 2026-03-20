import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { PRODUCT_REPOSITORY } from './domain/repositories/product-repository.token';
import { ProductApiRepository } from './infrastructure/repositories/product-api.repository';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { headerInterceptor } from './core/interceptors/header.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        headerInterceptor,
        errorInterceptor
      ])
    ),

    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductApiRepository,
    },
  ],
};
