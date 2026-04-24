import { Directive } from '@angular/core';

/**
 * Content of a card, intended for use within `<app-card>`. This component is an optional
 * convenience.
 */
@Directive({
  selector: 'app-card-content, [app-card-content]',
})
export class CardContentComponent {}
