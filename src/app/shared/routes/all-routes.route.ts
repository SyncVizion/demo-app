import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AuthenticatedLayoutComponent } from '../components/layouts/authenticated-layout/authenticated-layout.component';
import { USER_EXISTS_GUARD } from '../guards/user-exists.guard';
import { CARDS_ROUTE } from './cards.route';
import { HOME_ROUTE } from './home.route';
import { NOT_VERIFIED_ROUTE } from './not-verified.route';
import { PORTFOLIO_ROUTE } from './portfolio.route';
import { PROFILE_ROUTE } from './profile.route';
import { SETS_ROUTE } from './sets.route';

export const PAGE_ROUTES: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard, USER_EXISTS_GUARD],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      HOME_ROUTE,
      SETS_ROUTE,
      CARDS_ROUTE,
      PORTFOLIO_ROUTE,
      PROFILE_ROUTE,
      NOT_VERIFIED_ROUTE,
    ],
  },
  { path: '**', redirectTo: 'profile', pathMatch: 'full' },
];
