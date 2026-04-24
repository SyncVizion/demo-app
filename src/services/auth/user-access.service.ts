import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable, catchError, filter, of, switchMap, tap } from 'rxjs';
import { SplashScreenService } from 'src/app/shared/components/layouts/splash-screen-layout/splash-screen.service';
import { AppTheme, User } from 'src/app/shared/models/user.model';
import { DialogService } from '../dialog.service';
import { UserService } from '../user.service';
import { ThemeService } from '../user/theme.service';

@Injectable({
  providedIn: 'root',
})
export class UserAccessService {
  private readonly userService = inject(UserService);
  private readonly splashScreenService = inject(SplashScreenService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  private userInitalized = false;
  private readonly _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  readonly user$: Observable<User | null> = this._user.asObservable().pipe(filter(() => this.userInitalized));

  activeEmail: string;

  loadUser() {
    this.auth.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated && !this.userInitalized),
        switchMap(() => this.auth.user$),
        tap((res) => this.handleNotVerified(res)),
        filter((res) => res.email_verified),
        switchMap(() => this.userService.getCurrentUser()),
        tap((user) => ThemeService.setTheme(user.theme)),
        catchError((err: HttpErrorResponse) => this.handleUserNotFound(err)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (user: User) => {
          this.userInitalized = true;
          this._user.next(user);
          this.splashScreenService.setLoading(false);
        },
        error: () => this.splashScreenService.setLoading(null),
      });
  }

  refreshUser() {
    this.userService
      .getCurrentUser()
      .pipe(
        tap((user) => ThemeService.setTheme(user.theme)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => this._user.next(user));
  }

  setUser(user: User) {
    this._user.next(user);
  }

  private handleNotVerified(user: any) {
    this.activeEmail = user.email;
    if (!user.email_verified) {
      this.router.navigate(['/not-verified']);
    }
  }

  private handleUserNotFound(err: HttpErrorResponse): Observable<User> {
    ThemeService.setTheme(AppTheme.LIGHT);
    if (err.status === 404) {
      this.router.navigate(['/profile/setup']);
      // this.dialogService.open(UserAddUpdateDialog, {
      //   data: { title: 'Update Profile', allowCancel: false, email: this.activeEmail },
      //   disableClose: true,
      // });
      return of({ email: this.activeEmail });
    }
    throw err;
  }
}
