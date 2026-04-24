import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { IconModule } from '../icon/icon.module';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: 'mobile-nav.component.html',
  host: {
    class: 'mobile-nav',
  },
  imports: [IconModule, RouterModule],
})
export class MobileNavComponent {
  private readonly router = inject(Router);

  activeIndex = 0;

  routes = ['/home', '/sets', '/cards', '/portfolio', '/profile'];

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateActiveIndex();
    });

    this.updateActiveIndex(); // initial load
  }

  updateActiveIndex() {
    const current = this.router.url;
    const index = this.routes.findIndex((route) => current.startsWith(route));
    this.activeIndex = index !== -1 ? index : 0;
  }
}
