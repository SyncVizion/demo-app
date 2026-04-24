import { PortalModule } from '@angular/cdk/portal';
import { Component, computed, contentChildren, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { TabRouteComponent } from './tab-route/tab-route.component';

@Component({
  selector: 'app-tab-routing-manager',
  templateUrl: './tab-routing-manager.component.html',
  imports: [RouterModule, MatTabsModule, MatTooltipModule, PortalModule],
})
export class TabRoutingManagerComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  contentTabs = contentChildren(TabRouteComponent);
  fragments = computed(() => this.contentTabs().map((tab) => tab.label()));
  fragmentsChange = toObservable(this.fragments);
  selectedTabIndex = 0;

  destroyRef = inject(DestroyRef);

  ngOnInit() {
    combineLatest([this.fragmentsChange, this.route.fragment])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([fragments, routeFragment]) => {
        const foundTabIndex = this.fragments().findIndex((tab) => tab === routeFragment);

        if (foundTabIndex >= 0) {
          this.selectedTabIndex = foundTabIndex;
        } else {
          this.navigateToFragment(fragments[0]);
        }
      });
  }

  onTabChange(tabChange: MatTabChangeEvent) {
    this.router.navigate([], {
      fragment: this.fragments()[tabChange.index],
    });
  }

  /**
   * Navigate to a specific fragment in the URL.
   *
   * @param fragment The fragment to navigate to.
   */
  navigateToFragment(fragment: string) {
    this.router.navigate([], {
      fragment: fragment,
    });
  }
}
