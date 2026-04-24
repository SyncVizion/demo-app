import { map } from 'rxjs/operators';
import { GridPagerOperator, PagerPage } from './grid.model';

export class GridPagerOperators {
  /**
   * @description Function that sets the 3 values the grid needs from the
   * page object (data, totalCount & totalText pluralized translation keys) based on the most common IT payload keys.
   *
   * @example providers: [{ provide: GRID_PAGER_OPERATOR, useValue: GridPagerOperators.standardObject }]
   *
   * @param prefix Grid translation key prefix for generating pager labels
   * @returns PagerPage Page object with grid data
   */
  static readonly standardObject: GridPagerOperator = <T>(prefix: string) => {
    return map((data: { totalElements: number; totalPages: number; content: T[] }) => {
      const page = new PagerPage<T>();
      page.data = data.content;
      page.totalCount = data.totalElements;
      page.totalPages = data.totalPages;
      page.totalText = this.getTotalText(prefix, page.totalCount);
      return page;
    });
  };

  /**
   * @description Function that sets the 3 values the grid needs from the
   * page object (data, totalCount & totalText pluralized translation keys) based on the payload content being an array of objects.
   *
   * @example providers: [{ provide: GRID_PAGER_OPERATOR, useValue: GridPagerOperators.array }]
   *
   * @param prefix Grid translation key prefix for generating pager labels
   * @returns PagerPage Page object with grid data
   */
  static readonly array: GridPagerOperator = <T>(prefix: string) => {
    return map((data: T[]) => {
      const page = new PagerPage<T>();
      page.data = data;
      page.totalCount = data.length;
      page.totalText = this.getTotalText(prefix, page.totalCount);
      return page;
    });
  };

  /**
   * Gets the total text based on the prefix and total count.
   *
   * @param prefix Translation key prefix
   * @param totalCount Total count
   * @returns Total text
   */
  private static getTotalText(prefix: string, totalCount: number): string {
    if (totalCount === 0) {
      return `${prefix}.total.none`;
    } else if (totalCount === 1) {
      return `${prefix}.total.singular`;
    } else {
      return `${prefix}.total.plural`;
    }
  }
}
