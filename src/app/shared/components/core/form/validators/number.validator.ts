import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validators for numbers
 */
export class NumberValidator {
  static integer(control: AbstractControl): ValidationErrors | null {
    if (control.value == null || control.value == '') {
      return null;
    }
    return /^-?[0-9]*$/.test(control.value) ? null : { integer: control.value };
  }

  static decimal(control: AbstractControl): ValidationErrors | null {
    if (control.value == null || control.value == '') {
      return null;
    }
    return /^-?\d*[.]?\d{1,2}$/.test(control.value) ? null : { decimal: control.value };
  }
}
