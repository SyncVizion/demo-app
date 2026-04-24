import { Route } from '@angular/router';
import { HelpCenterComponent } from 'src/app/pages/help-center/help-center.component';

export const HELP_CENTER_ROUTER: Route = {
  path: 'help-center',
  children: [
    {
      path: '',
      component: HelpCenterComponent,
      pathMatch: 'full',
    },
  ],
};
