
import { AfterViewInit, booleanAttribute, Component, effect, forwardRef, input, output, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { DropdownItem } from '../dropdown-item.model';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-single-select',
  templateUrl: './form-field-single-select.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldSingleSelectComponent),
      multi: true,
    },
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormFieldSingleSelectComponent extends BaseFormFieldComponent<MatSelect> implements AfterViewInit {
  protected readonly formService: FormService;

  items = input<any[]>();
  hasIconValues = input(false);
  hasColorValues = input(false);
  clearable = input(false);
  multiple = input(false, { transform: booleanAttribute });
  showColors = input(true, { transform: booleanAttribute });
  idField = input<string>('id');
  displayField = input<string>('name');
  noResultsText = input<string>('No results');

  selectChange = output<DropdownItem | DropdownItem[]>();
  valueChange = output<DropdownItem | DropdownItem[]>();

  previousSelection: any;
  hasNewSelection = false;
  selectCount: number;

  constructor() {
    const formService = inject(FormService);

    super(formService);
    this.formService = formService;


    effect(() => {
      if (this.items() && this.idField() && this.control?.value) {
        this.control.setValue(this.selectExistingOptions(this.control.value));
      } else {
        this.control?.setValue(this.control?.value);
      }
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.items() && this.idField() && this.control?.value) {
      this.control.setValue(this.selectExistingOptions(this.control.value));
    }
  }

  selectExistingOptions(selectedOptions: any) {
    if (selectedOptions) {
      if (Array.isArray(selectedOptions)) {
        let selectedIds: any[] = selectedOptions?.map((si) => si[this.idField()]) ?? [];
        const selectedItems = this.items()?.filter((i) => selectedIds?.includes(i[this.idField()]));
        return selectedItems?.length > 0 ? selectedItems : selectedOptions;
      } else {
        const foundItem = this.items().find((item) => item[this.idField()] === selectedOptions[this.idField()]);
        return foundItem ?? selectedOptions;
      }
    }
  }

  /**
   * Clears the selected value in the select field.
   */
  clearValue() {
    this.value = null;
  }

  /**
   * Triggers a filter check when the panel closes and the selection has changed.
   *
   * @param panelOpen The state of the panel
   */
  onPanelToggle(panelOpen: boolean) {
    if (!panelOpen && this.hasNewSelection) {
      const selectValue = this.control.value;
      if (Array.isArray(selectValue)) {
        if (
          selectValue?.length != this.previousSelection?.length ||
          !selectValue.every((item) => this.previousSelection?.includes(item))
        ) {
          this.previousSelection = [...selectValue];
          this.selectChange.emit(selectValue);
        }
      } else if (selectValue !== this.previousSelection) {
        this.selectChange.emit(selectValue);
      }
    }

    this.hasNewSelection = false;
  }

  /**
   * Listens for change in the selected value
   */
  onValueChange(event) {
    this.selectCount = event?.value?.length;
    this.hasNewSelection = true;
  }
}
