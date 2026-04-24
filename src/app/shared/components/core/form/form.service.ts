import { Injectable, inject } from '@angular/core';
import { default as formErrorMessages } from 'src/assets/translations/form/en.json';
import { CommonService } from 'src/services/common.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private readonly commonService = inject(CommonService);


  getErrorTranslation(key: string, errorData: any, errorName: string) {
    const errorMessages = Object.values(formErrorMessages)[0];

    if (errorMessages[errorName]?.[key]) {
      const errorInjectionKeys = Object.keys(errorData) || [];
      let errorMessage = errorMessages[errorName][key];
      if (errorInjectionKeys.length > 0) {
        errorInjectionKeys.forEach(
          (key) => (errorMessage = errorMessage.replace(`{${key}}`, this.formatErrorDataValue(errorData[key]))),
        );
      }
      return errorMessage;
    } else {
      return '';
    }
  }

  formatErrorDataValue(value: any): string {
    if (value instanceof Date) {
      return this.commonService.formatDate(value, 'MMM d, y');
    } else {
      return value;
    }
  }
}
