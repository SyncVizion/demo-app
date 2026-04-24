import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CollectionCard } from '../models/collection.model';

@Pipe({
  name: 'tcgMarketPrice',
  standalone: true,
})
export class TcgMarketPricePipe implements PipeTransform {
  constructor(private readonly currencyPipe: CurrencyPipe) {}

  transform(card: CollectionCard) {
    if (card?.cardSource?.tcgplayer?.prices) {
      const price = card.cardSource.tcgplayer.prices.find((price) => price.cardType === card.cardType);
      return price ? this.currencyPipe.transform(price.market, 'USD') : '-';
    }
    return '-';
  }
}
