import { Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { ButtonModule } from '../../button/button.module';
import { UploadComponent } from '../../upload/upload.component';

@Component({
  selector: 'app-form-field-upload',
  templateUrl: './form-field-upload.component.html',
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    UploadComponent,
  ],
})
export class FormFieldUploadComponent {
  multiple = input(false);
  update = input<Subject<any>>();

  queueChange(queue) {
    this.update().next(queue);
  }
}
