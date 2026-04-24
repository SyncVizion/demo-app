
import { Component, forwardRef, output, inject } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhoneMaskDirective } from 'src/app/shared/directives/phone-mask.directive';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-phone-input',
  templateUrl: './form-field-phone-input.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PhoneMaskDirective
],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldPhoneInputComponent),
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
export class FormFieldPhoneInputComponent extends BaseFormFieldComponent<MatInput> {
  protected readonly formService: FormService;

  onEnter = output<void>();

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }
}
