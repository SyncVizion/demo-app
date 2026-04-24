import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeDefinition, FormField } from '../../models/form-builder.model';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  imports: [MatFormFieldModule, MatInputModule],
})
export class TextFieldComponent {
  element = input.required<FormField>();

  static readonly DEFINITION: FieldTypeDefinition = {
    id: 'TEXT',
    type: 'text',
    label: 'Text Field',
    icon: 'text_fields',
    defaultConfig: {
      label: 'Text Label',
      required: false,
    },
    component: TextFieldComponent,
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
        type: 'checkbox',
        key: 'required',
        label: 'Required',
      },
      {
        type: 'select',
        key: 'inputType',
        label: 'Input Type',
        options: [
          { value: 'text', label: 'Text' },
          { value: 'number', label: 'Number' },
          { value: 'email', label: 'Email' },
          { value: 'tel', label: 'Phone' },
        ],
      },
    ],
  };
}
