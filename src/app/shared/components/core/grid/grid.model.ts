import { InjectionToken, ValueProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { GridPagerOperators } from './grid-pager.operator';

export interface PagerChangeEvent {
  pageNumber: number;
  pageSize: number;
}

export interface PagerConfig {
  totalCount: number;
  totalPages?: number;
  size?: number;
}

export class PagerPage<T> implements PagerConfig {
  totalCount: number;
  totalPages?: number;
  size?: number;
  totalText?: string;
  data?: T[];
}

export type GridQueryParams = Map<string, string[]>;

export type GridPagerOperator = <T>(prefix: string) => (source: Observable<any>) => Observable<PagerPage<T>>;

export const GRID_PAGER_OPERATOR = new InjectionToken<GridPagerOperator>('Grid pager function to process data');

export const GRID_PAGER_OPERATOR_PROVIDER: ValueProvider = {
  provide: GRID_PAGER_OPERATOR,
  useValue: GridPagerOperators.standardObject,
};

export interface GridFilterValue {
  id: string;
  value: any;
}

export interface GridSort {
  active: string;
  direction: string;
  field: string;
}

export interface GridPreference {
  filters?: Map<string, string[]>;
  sort?: GridSort;
}
