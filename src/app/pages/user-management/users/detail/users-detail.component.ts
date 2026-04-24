import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { TabRoutingManagerModule } from 'src/app/shared/components/common/tab-routing-manager/tab-routing-manager.module';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { CardModule } from 'src/app/shared/components/core/card/card.module';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { IconModule } from 'src/app/shared/components/core/icon/icon.module';
import { PopupService } from 'src/app/shared/components/core/popup/popup.service';
import { BasicDialogComponent } from 'src/app/shared/components/dialogs/base-dialog/basic-dialog.component';
import { ResetPasswordDialog } from 'src/app/shared/components/dialogs/reset-password-dialog/reset-password-dialog.component';
import { UserAddUpdateDialog } from 'src/app/shared/components/dialogs/user-add-update-dialog/user-add-update-dialog.component';
import { Access, App, FeatureType, Page } from 'src/app/shared/models/common.model';
import { User } from 'src/app/shared/models/user.model';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { CommonService } from 'src/services/common.service';
import { DialogService } from 'src/services/dialog.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  imports: [
    IconModule,
    HeaderModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DatePipe,
    ClipboardModule,
    TabRoutingManagerModule,
    GridModule,
    CommonModule,
  ],
})
export class UserDetailComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly popupService = inject(PopupService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly userAccessService = inject(UserAccessService);
  private readonly commonService = inject(CommonService);

  destroyRef = inject(DestroyRef);
  user: User;
  userRoleDataloader: any;
  accessingUser: User;
  userAccess: User;

  App = App;
  FeatureType = FeatureType;
  Access = Access;

  showTempPassword = false;
  canEditUser = false;
  canDeleteUser = false;
  isSameUser = false;

  userJobsDataloader: any;

  ngOnInit(): void {
    this.route.data
      .pipe(
        tap((res) => (this.user = res.user)),
        tap(() => (this.userRoleDataloader = Page.ofDataloader(this.user.roles))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.userAccessService.user$
      .pipe(
        tap((res) => (this.userAccess = res)),
        tap(() => (this.accessingUser = this.userAccess)),

        tap(() => this.setCanEditUser()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onBackClick() {
    this.router.navigateByUrl('/user-management/users');
  }

  onResetPassword(resetOtherUser: boolean) {
    this.dialogService.open(ResetPasswordDialog, {
      data: { user: this.user, resetOtherUser: resetOtherUser },
    });
  }

  onEditUser(): void {
    const editUserDialog = this.dialogService.open(UserAddUpdateDialog, {
      data: { user: this.user, saveButtonText: 'Update', title: 'Update User' },
    }).componentInstance;

    editUserDialog
      .onUserChange()
      .pipe(
        tap((res) => (this.user = res)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  toggleShowTempPassword() {
    this.showTempPassword = !this.showTempPassword;
  }

  onCopyTempPassword() {
    this.popupService.success('Temporary password copied to clipboard!');
  }

  onDeleteUser() {
    const deleteUserDialog = this.dialogService.open(BasicDialogComponent, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
        actionLeft: { text: 'Cancel', variant: 'brand', emphasis: 'secondary' },
        actionRight: { text: 'Delete', variant: 'danger', emphasis: 'primary', icon: 'delete' },
      },
    }).componentInstance;

    deleteUserDialog
      .onActionLeft()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => deleteUserDialog.close());

    deleteUserDialog
      .onActionRight()
      .pipe(
        tap(() => (deleteUserDialog.loading = true)),
        switchMap(() => this.userService.delete(this.user.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          deleteUserDialog.close();
          this.popupService.success('User deleted successfully.');
          this.router.navigateByUrl('/user-management/users');
        },
        error: () => {
          this.popupService.error('Unable to delete user. Please try again later.');
          deleteUserDialog.close();
        },
      });
  }

  setCanEditUser() {
    const correctRole = this.commonService.canAccessUser(this.accessingUser, this.user);
    this.canDeleteUser = this.commonService.canDeleteUser(this.accessingUser, this.user);
    this.canEditUser = correctRole && !this.commonService.isSystemUser(this.user);
    this.isSameUser = this.accessingUser.id === this.user?.id;
  }
}
