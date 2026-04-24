import { Component, input } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeDefinition, FormField } from '../../models/form-builder.model';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule],
  providers: [provideNativeDateAdapter()],
})
export class DateFieldComponent {
  element = input.required<FormField>();

  static readonly DEFINITION: FieldTypeDefinition = {
    id: 'DATE',
    type: 'date',
    label: 'Date Field',
    icon: 'calendar_today',
    component: DateFieldComponent,
    defaultConfig: {
      label: 'Date Label',
      required: false,
    },
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
    ],
  };
}
