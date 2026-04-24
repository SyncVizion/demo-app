
import { Component, input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-form-field-radio',
  templateUrl: './form-field-radio.component.html',
  imports: [MatInputModule, MatRadioModule],
})
export class FormFieldRadioComponent {
  label = input();
  value = input();
  checked = input();
}
