import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { AuthService } from '@auth0/auth0-angular';
import { from, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { MobileNavComponent } from '../../core/mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MobileNavComponent,
  ],
})
export class AuthenticatedLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userAccessService = inject(UserAccessService);
  private readonly router = inject(Router);
  private readonly updates = inject(SwUpdate);

  newAppVersion = false;
  destroyRef = inject(DestroyRef);
  updateAppLoading = false;
  companyName = environment.companyName;
  isVerified = false;
  userExists = false;

  ngOnInit() {
    this.authService.user$
      .pipe(
        tap((user) => (this.isVerified = !!user?.email_verified)),
        switchMap(() => this.userAccessService.user$),
        tap((user) => (this.userExists = !!user?.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    if (environment.production) {
      from(navigator.serviceWorker.getRegistration())
        .pipe(
          switchMap((registration) =>
            registration ? of(null) : from(navigator.serviceWorker.register('ngsw-worker.js')),
          ),
          switchMap(() => (this.updates.isEnabled ? from(this.updates.checkForUpdate()) : of(false))),
          tap((event) => (this.newAppVersion = event)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }

  reload() {
    this.updateAppLoading = true;
    from(navigator.serviceWorker.getRegistration())
      .pipe(
        switchMap((registration) => (registration ? from(registration.unregister()) : of(true))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => globalThis.location.reload());
  }
}
