import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { defaultIfEmpty, filter, first, map, switchMap } from 'rxjs/operators';

export const DEFAULT_ASYNC_VALIDATOR_DEBOUNCE = 750;

export function createValidator(
  validator: (control: AbstractControl) => Observable<ValidationErrors>,
  debounceTime = DEFAULT_ASYNC_VALIDATOR_DEBOUNCE,
) {
  return (control: AbstractControl) => {
    return internalValidator(() => validator(control), debounceTime);
  };
}

export function createUniqueValidator(
  paramName: string,
  validator: (value: any) => Observable<any>,
  originalValueCheck: boolean = true,
  debounceTime: number = DEFAULT_ASYNC_VALIDATOR_DEBOUNCE,
) {
  let originalValue;

  return (control: AbstractControl) => {
    if (control.pristine) {
      originalValue = control.value;
      return of(null);
    }

    if (originalValueCheck && originalValue === control.value) {
      return of(null);
    }

    return internalValidator(() => {
      return validator(control.value).pipe(
        filter((res) => !!res),
        map(() => ({ [paramName]: { value: control.value } })),
      );
    }, debounceTime);
  };
}

export function internalValidator(
  validator: () => Observable<ValidationErrors>,
  debounceTime = DEFAULT_ASYNC_VALIDATOR_DEBOUNCE,
) {
  return timer(debounceTime, 1).pipe(
    first(),
    switchMap(() => validator()),
    defaultIfEmpty(null),
  );
}

export function whitespaceOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespaceOnly: true } : null;
  };
}

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    /\s/.test(control.value) ? { noWhitespace: true } : null;
}
