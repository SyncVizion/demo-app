import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { App } from 'src/app/shared/models/common.model';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { UserAccessService } from 'src/services/auth/user-access.service';
import { SidenavDrawerDropdownComponent } from './dropdown/sidenav-drawer-dropdown.component';
import { NAVIGATION_ROUTES } from './sidenav-drawer.config';

@Component({
  selector: 'app-sidenav-drawer',
  templateUrl: 'sidenav-drawer.component.html',
  imports: [CommonModule, SidenavDrawerDropdownComponent, RouterModule, MatIconModule],
})
export class SidenavDrawerComponent implements OnInit {
  private readonly userAccessService = inject(UserAccessService);

  routed = output<string>();

  navigationConfig = NAVIGATION_ROUTES;
  userData: User;
  initials: string;

  Application = App;

  logoUrl = `assets/images/${environment.companyFolder}/logo.jpeg`;

  ngOnInit() {
    this.userAccessService.user$.subscribe((ua) => {
      this.userData = ua;
      this.initials = `${this.userData.firstName[0]}${this.userData.lastName[0]}`;
    });
  }

  onRoute(path: string) {
    this.routed.emit(path);
  }
}
