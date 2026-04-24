import { ChangeDetectionStrategy, Component, Injector, input, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormModule } from '../../../form/form.module';
import { IconModule } from '../../../icon/icon.module';
import { MultiSelectComponent } from '../../../multi-select/multi-select.component';
import { GridFilterComponent } from '../grid-filter.component';

/**
 * Component for displaying a grid search filter.
 */
@Component({
  selector: 'app-grid-filter-search',
  templateUrl: './grid-filter-search.component.html',
  providers: [{ provide: GridFilterComponent, useExisting: GridFilterSearchComponent }],
  imports: [MultiSelectComponent, IconModule, FormModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFilterSearchComponent extends GridFilterComponent {
  placeholder = input('Search');
  key = input<string>('search');
  fill = input(true);
  control = new FormControl([]);

  constructor() {
    const injector = inject(Injector);

    super(injector);
  }

  get value(): any[] {
    return this.control.value;
  }

  set value(value: any) {
    this.control.setValue(value);
    this.control.markAsTouched();
  }

  /**
   * Performs a search.
   */
  search(): void {
    this.notifyChange();
  }

  /**
   * Callback for when the multiselect value changes.
   */
  onMultiSelectValueChange(): void {
    this.notifyChange();
  }
}
