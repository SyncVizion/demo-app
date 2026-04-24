import { Route } from '@angular/router';
import { PortfolioDetailComponent } from 'src/app/pages/portfolio/detail/portfolio-detail.component';
import { PortfolioComponent } from 'src/app/pages/portfolio/portfolio.component';
import { CollectionPublicService } from 'src/services/portfolio/collection-public.service';
import { CollectionService } from 'src/services/portfolio/collection.service';
import { RouteDataResolver } from 'src/services/request/route-data.resolver';

export const PORTFOLIO_ROUTE: Route = {
  path: 'portfolio',
  children: [
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },
    {
      path: '',
      component: PortfolioComponent,
    },
    {
      path: 'public/:id',
      component: PortfolioDetailComponent,
      resolve: { collection: RouteDataResolver.for(CollectionPublicService) },
    },
    {
      path: ':id',
      component: PortfolioDetailComponent,
      resolve: { collection: RouteDataResolver.for(CollectionService) },
    },
  ],
};
