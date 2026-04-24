import { AbstractControl, ValidatorFn } from '@angular/forms';

export class LinesValidator {
  static maxLinesValidator(length: number): ValidatorFn {
    return (control: AbstractControl) => {
      const controlValue = control.value || '';
      const exceeded = controlValue.split('\n').length > length;
      return exceeded ? { maxLines: { value: true } } : null;
    };
  }
}
