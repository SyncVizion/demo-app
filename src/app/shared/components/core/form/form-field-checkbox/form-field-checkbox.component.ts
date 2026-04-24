
import { Component, forwardRef, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-checkbox',
  templateUrl: './form-field-checkbox.component.html',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldCheckboxComponent),
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
export class FormFieldCheckboxComponent extends BaseFormFieldComponent<MatInput> {
  protected readonly formService: FormService;

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }
}
