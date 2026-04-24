import { AfterViewInit, Component, DestroyRef, inject, input, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ValueAccessorBase } from '../multi-select/value-accessor-base';
import { FormService } from './form.service';

/**
 * Base Component for displaying form input fields.
 */
@Component({
  selector: 'app-base-form-field',
  template: '',
})
export abstract class BaseFormFieldComponent<T> extends ValueAccessorBase<any> implements AfterViewInit {
  @ViewChild(MatFormFieldControl) matControl: MatFormFieldControl<T>;

  label = input('');
  formControlName = input('');
  placeholder = input('');
  inputmode = input('text');
  type = input('text');
  readonly = input(false);
  name = input('');
  loading = input(false);
  overrideErrorTranslation = input(false);
  bottomGap = input(true);
  subscriptSizing = input('fixed');
  showLabel = input(true);

  control: AbstractControl<any, any>;
  errorMessage = signal('');
  controlValue = signal('');

  destroyRef = inject(DestroyRef);

  constructor(protected readonly formService: FormService) {
    super();
  }

  /**
   * Lifecycle hook that is called after Angular has fully initialized a component's view to listen for
   * state changes on the form control to update the error message.
   */
  ngAfterViewInit() {
    this.control = this.matControl?.ngControl?.control;
    if (this.control) {
      this.controlValue.set(this.control.value);
      this.control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => this.controlValue.set(res));
      this.matControl.stateChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateErrorMessage());
    }
  }

  /**
   * Updates the error message based on the form control's state. It will pull the first error from the control
   * and translate it.
   */
  updateErrorMessage() {
    if (this.matControl.ngControl?.errors) {
      const errorKey = Object.keys(this.matControl.ngControl.errors)[0];

      this.errorMessage.set(
        this.formService.getErrorTranslation(
          errorKey,
          this.matControl.ngControl.errors[errorKey],
          this.overrideErrorTranslation() ? 'common' : this.formControlName(),
        ),
      );
    } else {
      this.errorMessage.set(null);
    }
  }
}
