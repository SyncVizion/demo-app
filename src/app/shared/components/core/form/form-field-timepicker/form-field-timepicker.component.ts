
import { Component, forwardRef, input, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-timepicker',
  templateUrl: './form-field-timepicker.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTimepickerModule
],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldTimePickerComponent),
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
export class FormFieldTimePickerComponent extends BaseFormFieldComponent<MatInput> {
  protected readonly formService: FormService;

  interval = input<string>('15min');

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }
}
