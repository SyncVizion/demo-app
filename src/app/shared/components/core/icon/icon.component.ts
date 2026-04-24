import { Directive } from '@angular/core';

/**
 * A app icon prefix to be placed at the beginning
 */
@Directive({
  selector: 'mat-icon[appPrefix]',
})
export class Prefix {}

/**
 * A app icon suffix to be placed at the end
 */
@Directive({
  selector: 'mat-icon[appSuffix]',
})
export class Suffix {}
