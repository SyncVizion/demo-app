import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, Subject, tap } from 'rxjs';
import { Role, User } from 'src/app/shared/models/user.model';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { UserService } from 'src/services/user.service';
import { ButtonModule } from '../../core/button/button.module';
import { FormModule } from '../../core/form/form.module';
import { PopupService } from '../../core/popup/popup.service';
import { BaseDialogComponent } from '../base-dialog/dialog-base.component';

@Component({
  selector: 'user-add-update-dialog',
  templateUrl: 'user-add-update-dialog.component.html',
  imports: [FormModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, ButtonModule],
})
export class UserAddUpdateDialog extends BaseDialogComponent implements OnInit {
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly popupService = inject(PopupService);
  private readonly authService = inject(AuthService);
  private readonly userAccessService = inject(UserAccessService);

  private readonly userChange$ = new Subject<User>();
  userForm: UntypedFormGroup;
  roles: Role[];

  existingUser: User;
  allowCancel = true;

  ngOnInit() {
    this.existingUser = this.data?.user;
    this.allowCancel = this.data?.allowCancel ?? true;

    this.userForm = this.formBuilder.group({
      firstName: [
        this.existingUser ? this.existingUser.firstName : null,
        { validators: [Validators.required, Validators.maxLength(50)] },
      ],
      lastName: [
        this.existingUser ? this.existingUser.lastName : null,
        { validators: [Validators.required, Validators.maxLength(50)] },
      ],
      email: [this.existingUser ? this.existingUser.email : this.data?.email],
    });
  }

  save(): void {
    this.loading = true;

    if (this.existingUser) {
      if (this.data.profileUser) {
        this.updateProfile();
      } else {
        this.updateUser();
      }
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.userService.createUser(this.userForm.value).subscribe({
      next: (res) => {
        this.userChange$.next(res);
        globalThis.location.reload();
        this.popupService.success('User created successfully');
      },
      error: () => {
        this.loading = false;
        this.popupService.error('Unable to create user. Try again later.');
      },
    });
  }

  updateProfile() {
    this.userService
      .updateUserProfile(this.userForm.value)
      .pipe(tap((res) => this.userChange$.next(res)))
      .subscribe({
        next: () => {
          globalThis.location.reload();
          this.popupService.success('Profile updated successfully');
        },
        error: () => {
          this.loading = false;
          this.popupService.error('Unable to update profile. Try again later.');
        },
      });
  }

  updateUser() {
    this.userService.updateUserById(this.existingUser.id, this.userForm.value).subscribe({
      next: (res) => {
        this.userChange$.next(res);
        this.close();
        this.popupService.success('User updated successfully');
      },
      error: () => {
        this.loading = false;
        this.popupService.error('Unable to update user. Try again later.');
      },
    });
  }

  onUserChange(): Observable<User> {
    return this.userChange$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }
}
