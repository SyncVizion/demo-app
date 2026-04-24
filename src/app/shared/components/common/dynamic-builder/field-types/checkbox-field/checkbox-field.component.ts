import { Component, input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FieldTypeDefinition, FormField } from '../../models/form-builder.model';

@Component({
  selector: 'app-checkbox-field',
  imports: [MatCheckboxModule],
  templateUrl: './checkbox-field.component.html',
})
export class CheckboxFieldComponent {
  element = input.required<FormField>();

  static readonly DEFINITION: FieldTypeDefinition = {
    type: 'checkbox',
    label: 'Checkbox Field',
    icon: 'check_box',
    component: CheckboxFieldComponent,
    defaultConfig: {
      label: 'Checkbox Label',
      required: false,
    },
    settingsConfig: [
      {
        type: 'text',
        key: 'label',
        label: 'Label',
      },
      {
        type: 'checkbox',
        key: 'required',
        label: 'Required',
      },
    ],
  };
}
