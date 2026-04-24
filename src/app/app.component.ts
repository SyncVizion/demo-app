import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, of, switchMap } from 'rxjs';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { SplashScreenLayoutComponent } from './shared/components/layouts/splash-screen-layout/splash-screen-layout.component';
import { SplashScreenService } from './shared/components/layouts/splash-screen-layout/splash-screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule, CommonModule, SplashScreenLayoutComponent],
})
export class AppComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly userAccessService = inject(UserAccessService);
  private readonly splashScreenService = inject(SplashScreenService);
  protected auth = inject(AuthService);

  pageLoading = false;
  unknownError = false;
  destroyRef = inject(DestroyRef);

  constructor() {
    this.userAccessService.loadUser();
  }

  ngOnInit() {
    this.splashScreenService
      .listen()
      .pipe(
        switchMap((res) => combineLatest([of(res), this.auth.isAuthenticated$])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([showSplashScreen, isAuthenticated]) => {
        if (showSplashScreen === null) {
          this.pageLoading = true;
          this.unknownError = true;
        } else {
          this.pageLoading = isAuthenticated ? showSplashScreen : this.pageLoading;
        }
      });
  }

  private touchStartX = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].screenX;
    if (touchEndX - this.touchStartX > 100) {
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }
}
