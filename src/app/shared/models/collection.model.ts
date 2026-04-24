import { CardPricingType, PokemonCard } from './pokemon-card.model';

export interface Collection {
  id?: number;
  title?: string;
  publicCollection?: boolean;
  ownerId?: number;
  cards?: PokemonCard[];
}

export interface CollectionCard {
  id?: number;
  collectionId?: number;
  name?: string;
  localId?: string;
  cardType?: CardPricingType;
  condition?: string;
  quantity?: number;
  cardSource?: PokemonCard;
}
