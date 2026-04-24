import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

export const NOT_VERIFIED_GUARD: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((res) => {
      if (res?.email_verified) {
        router.navigate(['/profile']);
        return false;
      }
      return true;
    }),
  );
};
