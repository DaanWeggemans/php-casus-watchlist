import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthClient } from '../clients/clients';
import { getCookie } from '../helpers/cookie';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const laravelInterceptor: HttpInterceptorFn = (request, next) => {
  const api = inject(AuthClient);
  request = request.clone({
    withCredentials: true
  });

  const csrf_token = getCookie("XSRF-TOKEN");
  if (csrf_token) {
    request = request.clone({
      setHeaders: {
        "X-XSRF-TOKEN": decodeURIComponent(csrf_token.value)
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 419 && !error.url?.includes("sanctum/csrf-cookie")) {
        return from(api.csrf()).pipe(
          switchMap(() => {
            const csrf_token = getCookie("XSRF-TOKEN");
            const new_request = csrf_token
              ? request.clone({
                  setHeaders: {
                    "X-XSRF-TOKEN": decodeURIComponent(csrf_token.value)
                  }
                })
              : request;

            return next(new_request);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
