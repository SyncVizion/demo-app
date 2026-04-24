import { Route } from '@angular/router';
import { NotVerifiedComponent } from 'src/app/pages/not-verified/not-verified.component';
import { NOT_VERIFIED_GUARD } from '../guards/not-verified.guard';

export const NOT_VERIFIED_ROUTE: Route = {
  path: 'not-verified',
  canActivate: [NOT_VERIFIED_GUARD],
  children: [
    {
      path: '',
      component: NotVerifiedComponent,
      pathMatch: 'full',
    },
  ],
};
