import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // Common requirement for this technical test: authorId header
  const authorId = '1'; // Standard ID for this test structure
  
  const modifiedReq = req.clone({
    setHeaders: {
      authorId
    }
  });

  return next(modifiedReq);
};
