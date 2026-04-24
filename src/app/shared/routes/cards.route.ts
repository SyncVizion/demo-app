import { Route } from '@angular/router';
import { CardsGridComponent } from 'src/app/pages/cards/cards-grid.component';
import { CardsDetailComponent } from 'src/app/pages/cards/detail/cards-detail.component';
import { CardsService } from 'src/services/pokemon/cards.service';
import { RouteDataResolver } from 'src/services/request/route-data.resolver';

export const CARDS_ROUTE: Route = {
  path: 'cards',
  children: [
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    },
    {
      path: '',
      component: CardsGridComponent,
    },
    {
      path: ':id',
      component: CardsDetailComponent,
      resolve: { card: RouteDataResolver.for(CardsService) },
    },
  ],
};
