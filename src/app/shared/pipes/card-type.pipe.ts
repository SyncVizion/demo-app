import { Pipe, PipeTransform } from '@angular/core';
import { CardPricingType } from '../models/pokemon-card.model';

@Pipe({
  name: 'cardType',
  standalone: true,
})
export class CardTypePipe implements PipeTransform {
  transform(type: CardPricingType) {
    if (!type) return type;

    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
