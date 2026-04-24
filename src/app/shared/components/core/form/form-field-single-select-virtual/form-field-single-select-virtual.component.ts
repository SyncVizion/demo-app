import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

import { AfterViewInit, booleanAttribute, Component, computed, forwardRef, input, numberAttribute, output, viewChild, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { Page } from 'src/app/shared/models/common.model';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { DropdownItem } from '../dropdown-item.model';
import { FormService } from '../form.service';
import { DropdownVirtualDataSource, VirtualScrollConfig } from './virtual-scroll-dropdown.datasource';

@Component({
  selector: 'app-form-field-single-select-virtual',
  templateUrl: './form-field-single-select-virtual.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ScrollingModule
],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldSingleSelectVirtualComponent),
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
export class FormFieldSingleSelectVirtualComponent extends BaseFormFieldComponent<MatSelect> implements AfterViewInit {
  protected readonly formService: FormService;

  cdkVirtualScrollViewPort = viewChild(CdkVirtualScrollViewport);

  datasource = input<(params) => Observable<Page<any>>>();
  cacheSize = input(1000);
  pageSize = input(20);
  minBufferPx = input(200, { transform: numberAttribute });
  maxBufferPx = input(400, { transform: numberAttribute });
  datasourceConfig = input<VirtualScrollConfig>();
  displayField = input<string>();
  idField = input<string>('id');
  compareFn = computed(() => (o1: any, o2: any) => o1?.[this.idField()] === o2?.[this.idField()]);
  multiple = input(false, { transform: booleanAttribute });

  selectChange = output<DropdownItem | DropdownItem[]>();

  virtualDatasource = computed(() =>
    this.datasource() ? new DropdownVirtualDataSource(this.datasource(), this.buildVirtualConfig()) : null,
  );

  previousSelection: any;
  hasNewSelection = false;
  selectCount: number;

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   */
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  /**
   * Builds the configuration for the virtual scroll.
   *
   * @returns The configuration object for the virtual scroll.
   */
  buildVirtualConfig() {
    return {
      pageSize: this.pageSize(),
      cacheSize: this.cacheSize(),
      displayField: this.displayField(),
    } as VirtualScrollConfig;
  }

  /**
   * Clears the value of the select control.
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
    if (this.datasource()) {
      this.virtualOpenChange(panelOpen);
    }

    if (!panelOpen && this.hasNewSelection) {
      const selectedValue = this.control.value;

      if (Array.isArray(selectedValue)) {
        if (
          selectedValue?.length != this.previousSelection?.length ||
          !selectedValue.every((item) => this.previousSelection?.includes(item))
        ) {
          this.previousSelection = [...selectedValue];
          this.selectChange.emit(selectedValue);
        }
      } else if (selectedValue !== this.previousSelection) {
        this.selectChange.emit(selectedValue);
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

  /**
   * When the virtual scroll is opened, it scrolls to the top and checks the viewport size.
   *
   * @param $event The event emitted when the virtual scroll is opened.
   */
  virtualOpenChange($event: boolean) {
    if ($event) {
      this.cdkVirtualScrollViewPort().scrollToIndex(0);
      this.cdkVirtualScrollViewPort().checkViewportSize();
    }
  }
}
