
import { Component, forwardRef, input, output, inject } from '@angular/core';
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
import { BaseFormFieldComponent } from '../base-form-field.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form-field-input',
  templateUrl: './form-field-input.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldInputComponent),
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
export class FormFieldInputComponent extends BaseFormFieldComponent<MatInput> {
  protected readonly formService: FormService;

  icon = input();
  iconClick = output<void>();
  onEnter = output<void>();
  maxlength = input();

  constructor() {
    const formService = inject(FormService);

    super(formService);
  
    this.formService = formService;
  }

  onIconClick() {
    this.iconClick.emit();
  }
}
