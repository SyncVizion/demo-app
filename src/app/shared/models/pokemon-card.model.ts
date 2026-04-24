import { LabelTag } from './label-tag.model';

export enum CardPricingType {
  NORMAL = 'NORMAL',
  HOLOFOIL = 'HOLOFOIL',
  REVERSE_HOLOFOIL = 'REVERSE_HOLOFOIL',
  UNLIMITED_HOLOFOIL = 'UNLIMITED_HOLOFOIL',
  FIRST_EDITION_HOLOFOIL = 'FIRST_EDITION_HOLOFOIL',
  FIRST_EDITION_NORMAL = 'FIRST_EDITION_NORMAL',
}

export const CARD_TYPE_TRANSLATIONS: Record<CardPricingType, string> = {
  [CardPricingType.NORMAL]: 'Normal',
  [CardPricingType.HOLOFOIL]: 'Holofoil',
  [CardPricingType.REVERSE_HOLOFOIL]: 'Reverse Holofoil',
  [CardPricingType.UNLIMITED_HOLOFOIL]: 'Unlimited Holofoil',
  [CardPricingType.FIRST_EDITION_HOLOFOIL]: 'First Edition Holofoil',
  [CardPricingType.FIRST_EDITION_NORMAL]: 'First Edition Normal',
};

export interface PokemonCard {
  id?: string;
  setId?: string;
  setName?: string;
  name?: string;
  illustrator?: string;
  image?: string;
  rarity?: string;
  localId?: string;
  tcgplayer?: TcgPlayer;
  cardmarket?: CardMarket;
  condition?: LabelTag;
  quantity?: number;
  collectionCardId?: number;
}

export interface Pricing {
  cardmarket?: CardMarket;
  tcgplayer?: TcgPlayer;
}

export interface CardMarket {
  id?: string;
  url?: string;
  updatedAt?: string;
  averageSellPrice?: number;
  lowPrice?: number;
  trendPrice?: number;
  germanProLow?: number;
  suggestedPrice?: number;
  reverseHoloSell?: number;
  reverseHoloLow?: number;
  reverseHoloTrend?: number;
  lowPriceExPlus?: number;
  avg1?: number;
  avg7?: number;
  avg30?: number;
  reverseHoloAvg1?: number;
  reverseHoloAvg7?: number;
  reverseHoloAvg30?: number;
}

export interface TcgPlayer {
  id?: string;
  url?: string;
  updatedAt?: string;
  prices?: TcgPlayerPrice[];
}

export interface TcgPlayerPrice {
  id?: string;
  cardType?: CardPricingType;
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
}

export interface PokemonSet {
  id?: string;
  name?: string;
  series?: string;
  printedTotal?: number;
  total?: number;
  ptcgoCode?: string;
  releaseDate?: string;
  updatedAt?: string;
  symbol?: string;
  logo?: string;
}

export interface PokemonCardSet {
  id?: string;
  name?: string;
  image?: string;
}
