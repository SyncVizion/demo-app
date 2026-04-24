import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { FormModule } from 'src/app/shared/components/core/form/form.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { User } from 'src/app/shared/models/user.model';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { SubscriptionService } from 'src/services/stomp/subscription.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.component.html',
  styleUrls: ['./setup-profile.component.scss'],
  imports: [
    CardModule,
    HeaderModule,
    IconModule,
    ButtonModule,
    MatSlideToggleModule,
    MatMenuModule,
    FormModule,
    MatProgressSpinnerModule,
  ],
})
export class SetupProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly userAccessService = inject(UserAccessService);
  private readonly userService = inject(UserService);
  private readonly popupService = inject(PopupService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(UntypedFormBuilder);

  user: User;
  loading = false;
  userForm: UntypedFormGroup;

  ngOnInit() {
    this.userAccessService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.user = user;
      this.userForm = this.formBuilder.group({
        firstName: [null, { validators: [Validators.required, Validators.maxLength(50)] }],
        lastName: [null, { validators: [Validators.required, Validators.maxLength(50)] }],
        email: [user.email],
      });
    });
  }

  logout() {
    this.subscriptionService.disconnect();
    this.authService.logout();
  }

  saveProfile() {
    this.loading = true;
    this.userService
      .createUser(this.userForm.value)
      .pipe(
        switchMap(() => this.authService.getAccessTokenSilently()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => globalThis.location.reload(),
        error: () => {
          this.loading = false;
          this.popupService.error('Unable to setup profile at this time. Try again later.');
        },
      });
  }
}
