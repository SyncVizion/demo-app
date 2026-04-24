import { Component, OnDestroy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { ButtonModule } from 'src/app/shared/components/core/button/button.module';
import { GridModule } from 'src/app/shared/components/core/grid/grid.module';
import { HeaderModule } from 'src/app/shared/components/core/header/header.module';
import { UserAddUpdateDialog } from 'src/app/shared/components/dialogs/user-add-update-dialog/user-add-update-dialog.component';
import { Access, App, FeatureType } from 'src/app/shared/models/common.model';
import { DialogService } from 'src/services/dialog.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  imports: [GridModule, MatPaginatorModule, MatIconModule, HeaderModule, RouterModule, ButtonModule],
})
export class UserGridComponent implements OnDestroy {
  private readonly service = inject(UserService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  destroy = new Subject<void>();
  dataLoader: any;
  pageSize = 25;
  totalRecords: any;

  App = App;
  FeatureType = FeatureType;
  Access = Access;

  constructor() {
    this.dataLoader = this.getUsers();
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  onAddUser(): void {
    this.dialogService.open(UserAddUpdateDialog);
  }

  onRowClick(event: any) {
    this.router.navigateByUrl(`/user-management/users/${event.id}`);
  }

  getUsers() {
    return (params) => this.service.getUsers(params);
  }
}
