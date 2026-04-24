import { Route } from '@angular/router';
import { PaymentMethodsComponent } from 'src/app/pages/profile/payment-methods/payment-methods.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { SetupProfileComponent } from 'src/app/pages/profile/setup-profile/setup-profile.component';

export const PROFILE_ROUTE: Route = {
  path: 'profile',
  children: [
    {
      path: '',
      component: ProfileComponent,
      pathMatch: 'full',
    },
    {
      path: 'setup',
      component: SetupProfileComponent,
    },
    {
      path: 'payment-methods',
      component: PaymentMethodsComponent,
    },
  ],
};
