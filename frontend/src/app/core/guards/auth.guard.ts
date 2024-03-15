import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

export const notLoggedGuard: CanActivateFn = (route, state) => {
  return (
    inject(AuthService).isLogged() || inject(Router).createUrlTree(['/login'])
  );
};

export const loggedGuard: CanActivateFn = (route, state) => {
  return (
    !inject(AuthService).isLogged() || inject(Router).createUrlTree(['/login'])
  );
};
