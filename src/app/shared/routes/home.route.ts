import { Route } from '@angular/router';
import { SubscriptionFormComponent } from '../components/common/subscription-form/subscription-form.component';

export const HOME_ROUTE: Route = {
  path: 'home',
  children: [
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },
    {
      path: '',
      component: SubscriptionFormComponent,
    },
  ],
};
