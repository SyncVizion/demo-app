import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '@auth0/auth0-angular';
import { debounceTime, filter, Subject, switchMap, tap } from 'rxjs';
import { ActionBarComponent } from 'src/app/shared/components/core/button/action-bar/action-bar.component';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { PopoverPanelComponent } from 'src/app/shared/components/core/popover/popover.component';
import { PopoverModule } from 'src/app/shared/components/core/popover/popover.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { UserAddUpdateDialog } from 'src/app/shared/components/dialogs/user-add-update-dialog/user-add-update-dialog.component';
import { AppSkeletonLoaderDirective } from 'src/app/shared/directives/skeleton-loader.directive';
import { AppTheme, User } from 'src/app/shared/models/user.model';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { DialogService } from 'src/services/dialog.service';
import { SubscriptionService } from 'src/services/stomp/subscription.service';
import { StripeSubscriptionService } from 'src/services/stripe/stripe-subscription.service';
import { UserService } from 'src/services/user.service';
import { ThemeService } from 'src/services/user/theme.service';
import { PaymentChangeDialogComponent } from './subscription-change-dialog/payment-change-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CardModule,
    HeaderModule,
    IconModule,
    ButtonModule,
    MatSlideToggleModule,
    MatMenuModule,
    DatePipe,
    TitleCasePipe,
    PopoverModule,
    ActionBarComponent,
    AppSkeletonLoaderDirective,
  ],
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly stripeSubService = inject(StripeSubscriptionService);
  private readonly userAccessService = inject(UserAccessService);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private readonly popupService = inject(PopupService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeChange = new Subject<AppTheme>();

  user: User;
  AppTheme = AppTheme;
  stripeSub: any;
  subLoading = true;

  ngOnInit() {
    this.themeChange
      .pipe(
        debounceTime(500),
        filter((newTheme) => newTheme !== this.user.theme),
        switchMap((theme) => this.userService.updateUserProfile({ theme })),
      )
      .subscribe({
        next: (updatedUser) => this.userAccessService.setUser(updatedUser),
        error: () => this.popupService.error('Failed to update theme preference. Please try again later.'),
      });

    this.userAccessService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((u) => (this.user = u));

    this.stripeSubService.get().subscribe({
      next: (res) => {
        this.stripeSub = res;
        this.subLoading = false;
      },
      error: (err) => {
        this.popupService.error('Failed to get Stripe subscription info. Please try again later.');
        this.subLoading = false;
      },
    });
  }

  onEditUser(): void {
    const editUserDialog = this.dialogService.open(UserAddUpdateDialog, {
      data: { user: this.user, profileUser: true, saveButtonText: 'Update', title: 'Update Profile' },
    }).componentInstance;

    editUserDialog
      .onUserChange()
      .pipe(
        tap((res) => (this.user = res)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  openNewPaymentDialog() {
    const paymentChangeDialog = this.dialogService.open(PaymentChangeDialogComponent, {
      // disableClose: true,
      // hasBackdrop: false,
      // maxHeight: '200px',
      // position: {
      //   bottom: '0px', // Forces dialog to the bottom of the viewport
      // },
    }).componentInstance;

    // paymentChangeDialog
    //   .onSaved()
    //   .pipe(
    //     switchMap(() => this.stripeSubService.get()),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       this.stripeSub = res;
    //       this.popupService.success('Payment method updated successfully');
    //       changeSubPanel.close();
    //     },
    //     error: () => {
    //       this.popupService.error('Failed to update payment method. Please try again later.');
    //     },
    //   });
  }

  toggleTheme() {
    this.themeChange.next(ThemeService.toggleTheme());
  }

  logout() {
    this.subscriptionService.disconnect();
    this.authService.logout();
  }

  changeSub(changeSubPanel: PopoverPanelComponent) {
    this.subLoading = true;
    if (this.stripeSub?.cancellationDate) {
      this.stripeSubService.uncancelSubscription().subscribe({
        next: (res) => {
          this.stripeSub = res;
          this.subLoading = false;
          changeSubPanel.close();
        },
        error: () => {
          this.popupService.error('Failed to renew subscription. Please try again later.');
          this.subLoading = false;
        },
      });
    } else {
      this.stripeSubService.cancelSubscription().subscribe({
        next: (res) => {
          this.stripeSub = res;
          this.subLoading = false;
          changeSubPanel.close();
        },
        error: () => {
          this.popupService.error('Failed to cancel subscription. Please try again later.');
          this.subLoading = false;
        },
      });
    }
  }
}
