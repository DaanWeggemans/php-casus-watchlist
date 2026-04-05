import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const unauthorizedGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let isAuthorized = authService.isAuthorized === undefined
    ? await authService.user() !== undefined
    : authService.isAuthorized;

  return isAuthorized ? true : router.createUrlTree(['/login']);
};
