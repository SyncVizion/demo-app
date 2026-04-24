import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldColorPickerComponent } from './form-color-picker/form-field-color-picker.component';
import { FormFieldCheckboxComponent } from './form-field-checkbox/form-field-checkbox.component';
import { FormFieldDatePickerComponent } from './form-field-datepicker/form-field-datepicker.component';
import { FormFieldInputComponent } from './form-field-input/form-field-input.component';
import { FormFieldMultiSelectComponent } from './form-field-multi-select/form-field-multi-select.component';
import { FormFieldPhoneInputComponent } from './form-field-phone-input/form-field-phone-input.component';
import { FormFieldRadioGroupComponent } from './form-field-radio/form-field-radio-group.component';
import { FormFieldRadioComponent } from './form-field-radio/form-field-radio.component';
import { FormFieldSingleSelectVirtualComponent } from './form-field-single-select-virtual/form-field-single-select-virtual.component';
import { FormFieldSingleSelectComponent } from './form-field-single-select/form-field-single-select.component';
import { FormFieldTextAreaComponent } from './form-field-textarea/form-field-textarea.component';
import { FormFieldTimePickerComponent } from './form-field-timepicker/form-field-timepicker.component';

/**
 * Form Module
 *
 * @author Sam Butler
 * @since August 18, 2022
 */
@NgModule({
  imports: [
    FormFieldInputComponent,
    FormFieldSingleSelectComponent,
    FormFieldTextAreaComponent,
    FormFieldTimePickerComponent,
    FormFieldDatePickerComponent,
    FormFieldCheckboxComponent,
    FormFieldPhoneInputComponent,
    FormFieldColorPickerComponent,
    FormFieldMultiSelectComponent,
    FormFieldRadioGroupComponent,
    FormFieldRadioComponent,
    FormFieldSingleSelectVirtualComponent,
  ],
  exports: [
    FormFieldInputComponent,
    FormFieldSingleSelectComponent,
    FormFieldTextAreaComponent,
    FormFieldTimePickerComponent,
    FormFieldDatePickerComponent,
    FormFieldCheckboxComponent,
    FormFieldPhoneInputComponent,
    FormFieldColorPickerComponent,
    FormFieldMultiSelectComponent,
    FormFieldRadioGroupComponent,
    FormFieldRadioComponent,
    FormFieldSingleSelectVirtualComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FormModule {}
