import { Component, input } from '@angular/core';
import { UploadComponent } from 'src/app/shared/components/core/upload/upload.component';
import { FieldTypeDefinition, FormField } from '../../models/form-builder.model';

@Component({
  selector: 'app-upload-field',
  imports: [UploadComponent],
  templateUrl: './upload-field.component.html',
})
export class UploadFieldComponent {
  element = input.required<FormField>();

  static readonly DEFINITION: FieldTypeDefinition = {
    id: 'UPLOAD',
    type: 'upload',
    label: 'Upload Field',
    icon: 'upload',
    component: UploadComponent,
    defaultConfig: {
      label: 'Upload Label',
      required: false,
    },
    settingsConfig: [],
  };
}
