import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserAccessService } from 'src/services/auth/user-access.service';

export const USER_EXISTS_GUARD: CanActivateFn = (route, state) => {
  const userAccessService = inject(UserAccessService);
  const router = inject(Router);

  return userAccessService.user$.pipe(
    map((user) => {
      if (!user?.id && state.url !== '/profile/setup') {
        router.navigate(['/profile/setup']);
        return false;
      } else if (user?.id && state.url === '/profile/setup') {
        router.navigate(['/profile']);
        return false;
      }
      return true;
    }),
  );
};
