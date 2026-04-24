import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FieldTypeDefinition, FormField } from '../../models/form-builder.model';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  imports: [MatSelectModule, MatFormFieldModule, FormsModule],
})
export class SelectFieldComponent {
  element = input.required<FormField>();

  static readonly DEFINITION: FieldTypeDefinition = {
    type: 'select',
    label: 'Dropdown Field',
    icon: 'arrow_drop_down_circle',
    component: SelectFieldComponent,
    defaultConfig: {
      label: 'Select Label',
      required: false,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
    settingsConfig: [
      { type: 'text', key: 'label', label: 'Label' },
      { type: 'checkbox', key: 'required', label: 'Required' },
      { type: 'dynamic-options', key: 'options', label: 'Dropdown Options' },
    ],
  };
}
