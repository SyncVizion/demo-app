import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, input, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FieldTypeDefinition, FormField } from '../../models/form-builder.model';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './text-area-field.component.html',
  imports: [MatFormFieldModule, MatInputModule, TextFieldModule, ReactiveFormsModule],
})
export class TextAreaFieldComponent {
  matControl = viewChild(MatFormFieldControl<MatInput>);
  element = input.required<FormField>();

  static readonly DEFINITION: FieldTypeDefinition = {
    id: 'TEXTAREA',
    type: 'textarea',
    label: 'Text Area Field',
    icon: 'insert_text',
    defaultConfig: {
      label: 'Text Area Label',
      required: false,
      inputType: 'text',
      cdkAutosizeMinRows: 3,
      cdkAutosizeMaxRows: 5,
    },
    component: TextAreaFieldComponent,
    settingsConfig: [
      {
        type: 'text',
        key: 'label',
        label: 'Label',
      },
      {
        type: 'text',
        key: 'placeholder',
        label: 'Placeholder',
      },
      {
        type: 'text',
        key: 'maxLength',
        label: 'Max Length',
      },
      {
        type: 'text',
        key: 'cdkAutosizeMinRows',
        label: 'Min Rows',
      },
      {
        type: 'text',
        key: 'cdkAutosizeMaxRows',
        label: 'Max Rows',
      },
      {
        type: 'checkbox',
        key: 'required',
        label: 'Required',
      },
    ],
  };
}
