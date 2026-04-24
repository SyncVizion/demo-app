import { Route } from '@angular/router';
import { UserDetailComponent } from 'src/app/pages/user-management/users/detail/users-detail.component';
import { UserGridComponent } from 'src/app/pages/user-management/users/users-grid.component';
import { RouteDataResolver } from 'src/services/request/route-data.resolver';
import { UserService } from 'src/services/user.service';

export const USER_MANAGEMENT_ROUTE: Route = {
  path: 'user-management',
  children: [
    {
      path: '',
      redirectTo: 'users',
      pathMatch: 'full',
    },
    {
      path: 'users',
      component: UserGridComponent,
    },
    {
      path: 'users/:id',
      component: UserDetailComponent,
      resolve: { user: RouteDataResolver.for(UserService) },
    },
  ],
};
