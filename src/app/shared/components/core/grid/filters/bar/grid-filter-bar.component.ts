import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, contentChildren, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ButtonComponent } from '../../../button/button.component';
import { ButtonModule } from '../../../button/button.module';
import { IconModule } from '../../../icon/icon.module';
import { GridFilterComponent } from '../grid-filter.component';

@Component({
  selector: 'app-grid-filter-bar',
  templateUrl: './grid-filter-bar.component.html',
  imports: [CommonModule, IconModule, ButtonModule, PortalModule],
})
export class GridFilterBarComponent {
  destroyRef = inject(DestroyRef);
  buttons = contentChildren(ButtonComponent);
  filters = contentChildren(GridFilterComponent, { descendants: true });

  private filterChange$ = new Subject<Map<string, string[]>>();

  /**
   * Notifies that a filter has changed
   */
  notifyChange() {
    this.filterChange$.next(this.getFilterMap());
  }

  /**
   * Gets the observable for the filter change event.
   *
   * @returns The observable for the filter change event
   */
  onFilterChange() {
    return this.filterChange$.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }

  /**
   * Gets the map of filters.
   *
   * @returns The map of filters
   */
  getFilterMap(): Map<string, string[]> {
    const filterMap = new Map<string, string[]>();
    this.filters().forEach((filter) => filterMap.set(filter.key(), filter.value));
    return filterMap;
  }
}
