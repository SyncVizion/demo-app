
import { Component, forwardRef, input, output, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-datepicker',
  templateUrl: './form-field-datepicker.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule
],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldDatePickerComponent),
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
export class FormFieldDatePickerComponent extends BaseFormFieldComponent<MatInput> {
  protected readonly formService: FormService;

  hint = input('');
  pickerId = input('picker');
  closed = output<void>();

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }
}
