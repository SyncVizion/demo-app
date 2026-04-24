import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonUtil {
  /**
   * Will return the cloned object of it's own instance.
   *
   * @param obj The object to be cloned
   * @returns new object instance
   */
  public static clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Formats the given date object or string. The default format being used is month/day/year.
   *
   * @param value The value to be formatted.
   * @returns The formatted string.
   */
  public static formatDate(value: Date | string, format = 'MM/dd/yyyy', zone?: string): string {
    if (value === null) {
      return '-';
    }

    let dateValue;
    if (value instanceof Date) {
      dateValue = value;
    } else {
      dateValue = new Date(value);
    }

    return new DatePipe('en-US', zone).transform(dateValue, format);
  }
}
