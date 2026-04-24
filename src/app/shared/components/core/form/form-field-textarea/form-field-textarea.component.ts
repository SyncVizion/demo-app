import { TextFieldModule } from '@angular/cdk/text-field';

import { Component, forwardRef, input, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';
@Component({
  selector: 'app-form-field-textarea',
  templateUrl: './form-field-textarea.component.html',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, TextFieldModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldTextAreaComponent),
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
export class FormFieldTextAreaComponent extends BaseFormFieldComponent<MatInput> {
  protected readonly formService: FormService;

  subscriptSizing = input('fixed');
  showMaxLength = input(true);
  maxlength = input();
  cdkAutosizeMinRows = input(2);
  cdkAutosizeMaxRows = input(8);

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }
}
