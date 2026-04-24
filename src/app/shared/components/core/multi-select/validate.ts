import { AbstractControl, AsyncValidatorFn, Validator, ValidatorFn, Validators } from '@angular/forms';
import { Observable, from, map, of } from 'rxjs';

export type DeprecatedValidationResult = {
  [validator: string]: string | boolean;
};

export type DeprecatedAsyncValidatorArray = (Validator | AsyncValidatorFn)[];

export type DeprecatedValidatorArray = (Validator | ValidatorFn)[];

export const deprecatedNormalizeValidator = (validator: Validator | ValidatorFn): ValidatorFn | AsyncValidatorFn => {
  const func = (validator as Validator).validate.bind(validator);
  if (typeof func === 'function') {
    return (c: AbstractControl) => func(c);
  } else {
    return validator as ValidatorFn | AsyncValidatorFn;
  }
};

export const deprecatedComposeValidators = (validators: DeprecatedValidatorArray): AsyncValidatorFn | ValidatorFn => {
  if (validators == null || validators.length === 0) {
    return null;
  }
  return Validators.compose(validators.map(deprecatedNormalizeValidator));
};

export const deprecatedValidate = (
  validators: DeprecatedValidatorArray,
  asyncValidators: DeprecatedAsyncValidatorArray,
): ((control: AbstractControl) => Observable<DeprecatedValidationResult>) => {
  return (control: AbstractControl) => {
    const synchronousValid = () => deprecatedComposeValidators(validators)(control) as DeprecatedValidationResult;

    if (asyncValidators) {
      const asyncValidator = deprecatedComposeValidators(asyncValidators);
      const result = asyncValidator(control);

      if (result instanceof Observable) {
        return result.pipe(
          map((v): DeprecatedValidationResult => {
            const secondary = synchronousValid();
            if (secondary || v) {
              return { ...secondary, ...v } as DeprecatedValidationResult;
            }
            return null as DeprecatedValidationResult;
          }),
        );
      } else if (result instanceof Promise) {
        return from(result).pipe(
          map((v): DeprecatedValidationResult => {
            const secondary = synchronousValid();
            if (secondary || v) {
              return { ...secondary, ...v } as DeprecatedValidationResult;
            }
            return null as DeprecatedValidationResult;
          }),
        );
      } else if (result) {
        return of({
          ...synchronousValid(),
          ...result,
        } as DeprecatedValidationResult);
      }
    }

    return of(synchronousValid());
  };
};

export const deprecatedMessage = (validator: DeprecatedValidationResult, key: string): string => {
  switch (key) {
    case 'required':
      return 'common.requiredField';
  }

  switch (typeof validator[key]) {
    case 'string':
      return validator[key] as string;
    default:
      return `Validation failed: ${key}`;
  }
};
