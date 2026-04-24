import { Component, forwardRef, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxColorsModule } from 'ngx-colors';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

/**
 * Component for displaying form input fields.
 */
@Component({
  selector: 'app-form-field-color-picker',
  templateUrl: './form-field-color-picker.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgxColorsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldColorPickerComponent),
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
export class FormFieldColorPickerComponent extends BaseFormFieldComponent<MatInput> {
  protected formService: FormService;

  constructor() {
    const formService = inject(FormService);

    super(formService);

    this.formService = formService;
  }

  onColorChange(color: any) {
    if (this.matControl && color) {
      this.matControl.value = color;
    }
  }
}
