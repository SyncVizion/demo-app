import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ElementOptionItem } from '../../models/dynamic-builder.model';

@Component({
  selector: 'app-dynamic-options',
  templateUrl: './dynamic-options.component.html',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInput, FormsModule],
  styleUrls: ['./dynamic-options.component.scss'],
})
export class DynamicOptionsComponent {
  title = input('');
  options = input.required<ElementOptionItem[]>();
  optionsChange = output<ElementOptionItem[]>();

  addOption() {
    const currentOptions = this.options();
    const newOptions = [...currentOptions];
    newOptions.push({ label: `Option ${newOptions.length + 1}`, value: `option-${newOptions.length + 1}` });
    this.optionsChange.emit(newOptions);
  }

  removeOption(index: number) {
    const currentOptions = this.options();
    const newOptions = [...currentOptions];
    newOptions.splice(index, 1);
    this.optionsChange.emit(newOptions);
  }

  updateOption(index: number, newLabel: string) {
    const currentOptions = this.options();
    const newOptions = [...currentOptions];
    newOptions[index] = {
      ...newOptions[index],
      label: newLabel,
    };
    this.optionsChange.emit(newOptions);
  }
}
