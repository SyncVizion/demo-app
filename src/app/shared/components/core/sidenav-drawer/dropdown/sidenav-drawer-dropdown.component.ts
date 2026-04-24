import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NavItem } from '../sidenav-drawer.config';

@Component({
  selector: 'ik-sidenav-drawer-dropdown',
  templateUrl: 'sidenav-drawer-dropdown.component.html',
  host: {
    class: 'w-100',
  },
  imports: [CommonModule, RouterModule, MatIconModule],
})
export class SidenavDrawerDropdownComponent {
  private readonly router = inject(Router);

  navItem = input<NavItem>();
  isNested = input(false);
  baseRoute = input('');
  nestedRouted = output<string>();

  isOpen = false;
  dropdownCloseIcon = 'caret-left';
  dropdownOpenIcon = 'caret-down';

  toggleDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  onRoute(path: string) {
    this.nestedRouted.emit(path);
  }

  isRouteActive(route: any) {
    return this.router.url.includes(route);
  }
}
