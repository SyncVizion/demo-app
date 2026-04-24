import { Signal } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DeprecatedAsyncValidatorArray,
  DeprecatedValidationResult,
  DeprecatedValidatorArray,
  deprecatedMessage,
  deprecatedValidate,
} from './validate';
import { ValueAccessorBase } from './value-accessor-base';

export abstract class InputElementBase<T> extends ValueAccessorBase<T> {
  protected abstract model: Signal<NgModel>;

  constructor(
    private readonly validators: DeprecatedValidatorArray,
    private readonly asyncValidators: DeprecatedAsyncValidatorArray,
  ) {
    super();
  }

  protected validate(): Observable<DeprecatedValidationResult> {
    return deprecatedValidate(this.validators, this.asyncValidators)(this.model().control);
  }

  protected get invalid(): Observable<boolean> {
    return this.validate().pipe(map((v) => Object.keys(v || {}).length > 0));
  }

  protected get failures(): Observable<string[]> {
    return this.validate().pipe(map((v) => Object.keys(v).map((k) => deprecatedMessage(v, k))));
  }
}
