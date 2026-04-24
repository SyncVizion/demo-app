import { ChangeDetectionStrategy, Component, effect, inject, Injector, input, InputSignal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormModule } from '../../../form/form.module';
import { IconModule } from '../../../icon/icon.module';
import { GridFilterComponent } from '../grid-filter.component';

/**
 * Component for displaying a grid select
 */
@Component({
  selector: 'app-grid-filter-select',
  templateUrl: './grid-filter-select.component.html',
  providers: [{ provide: GridFilterComponent, useExisting: GridFilterSelectComponent }],
  imports: [IconModule, FormModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFilterSelectComponent extends GridFilterComponent {
  items: InputSignal<any[]> = input();
  key = input('select');
  clearable = input(false);
  showColors = input(true);
  idField = input('id');
  placeholder = input('Add Placeholder');
  formBuilder = inject(UntypedFormBuilder);
  formGroup: UntypedFormGroup;

  constructor() {
    const injector = inject(Injector);

    super(injector);

    this.formGroup = this.formBuilder.group({
      select: [null],
    });

    effect(() => {
      if (this.items()) {
        this.updateControl(this.items(), this.formGroup.value.select);
      }
    });
  }

  get value(): any[] {
    return this.formGroup?.controls?.select?.value?.map((v) => v?.[this.idField()]) || [];
  }

  /**
   * Updates the filter value.
   *
   * @param value The updated value.
   */
  set value(value: any) {
    this.updateControl(this.items(), value);
  }

  /**
   * Updates the control value based on the items and the current value.
   *
   * @param items The list of items to filter.
   * @param value The current value of the filter.
   */
  updateControl(items: any[], value: any) {
    if (items && Array.isArray(value)) {
      this.formGroup.controls.select.setValue(
        items?.filter((i) => value.includes(i?.[this.idField()])),
        { emitEvent: false },
      );
    } else {
      this.formGroup.controls.select.setValue(value, { emitEvent: false });
    }
    this.formGroup.markAllAsTouched();
  }

  /**
   * Callback for when the multiselect value changes.
   */
  onChange(): void {
    this.notifyChange();
  }
}
