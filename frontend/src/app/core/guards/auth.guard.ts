import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  return (
    inject(AuthService).isLogged() || inject(Router).createUrlTree(['/login'])
  );
};
