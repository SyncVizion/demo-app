import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  InputSignal,
  model,
  OnChanges,
  output,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipGrid, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-multi-select',
  templateUrl: './form-field-multi-select.component.html',
  styleUrls: ['./form-field-multi-select.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldMultiSelectComponent),
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
export class FormFieldMultiSelectComponent extends BaseFormFieldComponent<MatChipGrid> implements OnChanges {
  protected formService: FormService;

  autocompleteTrigger = viewChild(MatAutocompleteTrigger);

  items: InputSignal<{ name: any; value: any }[]> = input();
  itemAdded = output<{ name: any; value: any }>();

  readonly currentSelection = model('');
  readonly manualRefresh = model();
  readonly filteredSelections = computed(() => this.searchSelection(this.manualRefresh(), this.currentSelection()));

  constructor() {
    const formService = inject(FormService);

    super(formService);

    this.formService = formService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.items?.currentValue) {
      this.manualRefresh.set(this.items);
    }
  }

  /**
   * Removes an item from the current selections
   */
  remove(item: { name: any; value: any }): void {
    const index = this.value.findIndex((i: any) => i.value === item.value);

    if (index >= 0) {
      this.value.splice(index, 1);
      this.control.markAsDirty();
    }

    this.autocompleteTrigger().closePanel();
    this.manualRefresh.set(item.value);
  }

  /**
   * Adds an item to the current selections and clears the input
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value;
    if (this.value) {
      if (!this.value.find((i: any) => i.value === item.value)) {
        this.value = [...this.value, item];
      }
    } else {
      this.value = [item];
    }

    this.itemAdded.emit(item);
    this.currentSelection.set('');
  }

  /**
   * Performs a search on the selection
   */
  private searchSelection(refreshValue: any, value: any): { name: any; value: any }[] {
    const acceptedItems =
      this.value && this.value.length > 0
        ? this.items().filter((item) => !this.value.find((i: any) => i.value === item.value))
        : this.items();

    if (value && !(value instanceof Array) && !value.name) {
      return acceptedItems.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    }

    if (this.items) {
      return acceptedItems.slice();
    }
  }
}
