import { Route } from '@angular/router';
import { SetsDetailComponent } from 'src/app/pages/sets/detail/sets-detail.component';
import { SetsGridComponent } from 'src/app/pages/sets/sets-grid.component';
import { SetsService } from 'src/services/pokemon/sets.service';
import { RouteDataResolver } from 'src/services/request/route-data.resolver';

export const SETS_ROUTE: Route = {
  path: 'sets',
  children: [
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },
    {
      path: '',
      component: SetsGridComponent,
    },
    {
      path: ':id',
      component: SetsDetailComponent,
      resolve: { set: RouteDataResolver.for(SetsService) },
    },
  ],
};
